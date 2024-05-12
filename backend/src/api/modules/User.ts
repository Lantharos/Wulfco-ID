import crypto from "crypto";
import bcrypt from "bcrypt";
import * as database from "./util/FirebaseHandler";
import Payments from "./Payments";
import CryptoHelper from "./util/CryptoHelper";
import {Resend} from "resend";
import sendVerificationEmail from "./emails/verify-email";

export default class User {
    public static async get(req: any, checkPassword?: any) {
        const session_id = req.headers['w-sessionid']
        let encryptedToken = req.headers['w-auth']

        if (!session_id || !encryptedToken) {
            return {status: 400, success: false, message: "Missing headers"}
        }

        encryptedToken = encryptedToken.split(",").map(Number)

        const sessionIdentification = JSON.parse(session_id)

        const sessionDoc = await database.getSessionDocById(sessionIdentification.sessionDoc)
        if (!sessionDoc) {return {status: 400, success: false, message: "Could not find session document"}}

        const session = await database.getSession(sessionIdentification.sessionDoc, sessionIdentification.sessionId)
        if (!session) {return {status: 400, success: false, message: "Could not find session"}}

        const user_id = sessionDoc.data().userId

        const rawUser = await database.getUser(user_id)
        if (!rawUser) {return {status: 400, success: false, message: "Could not find user"}}

        const user = rawUser.data()
        if (!user) { return {status: 400, success: false, message: "Could not find user"} }

        const iv = Buffer.from(user.iv, "hex")

        const rawSessionSecret = Buffer.from(session.secret, "hex")
        const sessionSecret = crypto.createSecretKey(rawSessionSecret)

        const tokenRaw = new CryptoHelper().decryptAES(Buffer.from(encryptedToken), sessionSecret, iv, "aes-256-cbc")
        if (!tokenRaw) {return {status: 400, success: false, message: "Could not decrypt token"}}

        const tokenString = JSON.parse(tokenRaw)["token"]
        const token = new Uint8Array(tokenString.split(",").map(Number))
        const sessionDetailsRaw = new CryptoHelper().decryptAES(Buffer.from(session.sessionData, "hex"), crypto.createSecretKey(token), iv, "aes-256-cbc")
        if (!sessionDetailsRaw) {return {status: 400, success: false, message: "Could not decrypt session details"}}

        const sessionDetails = JSON.parse(sessionDetailsRaw)
        const tedk = crypto.createSecretKey(Buffer.from(sessionDetails.tedk, "hex"))

        const userDataRaw = new CryptoHelper().decryptAES(Buffer.from(user.data, "hex"), tedk, iv, "aes-256-cbc")
        if (!userDataRaw) {return {status: 400, success: false, message: "Could not decrypt user data"}}

        const userData = JSON.parse(userDataRaw)

        if (checkPassword != undefined) {
            const pdTEDK = new CryptoHelper().KDF(checkPassword, user.username)
            const decryptedUser = new CryptoHelper().decryptAES(Buffer.from(user.data, 'hex'), pdTEDK, iv, 'aes-256-cbc')
            if (!decryptedUser) {return {status: 400, success: false, error: "invalid_password", message: "Incorrect password!"}}
        }

        const requesterIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress
        const hashedIp = new CryptoHelper().Hash(requesterIp)

        if (session.ip !== hashedIp) {return {status: 400, success: false, message: "Invalid IP"}}

        const customerId = userData.account.billing.stripe
        if (customerId != '') {
            let billingInfo = {}

            const resultic = await Payments.getStripeCards(customerId)
            billingInfo["cards"] = resultic.cards

            const resultit = await Payments.getStripeTransactions(customerId)
            billingInfo["transactions"] = resultit.transactions

            userData["account"]["billing"]["stripe"] = billingInfo
        }

        const paypals = userData.account.billing.paypal
        if (paypals) {
            if (paypals.length > 0) {
                userData["account"]["billing"]["paypal"] = user.account.billing.paypal;
            } else {
                delete userData["account"]["billing"]["paypal"]
            }
        }

        userData["username"] = user.username
        userData["id"] = user_id
        userData["iv"] = user.iv

        const encryptedUserData = new CryptoHelper().encryptAES(JSON.stringify(userData), crypto.createSecretKey(rawSessionSecret), iv, "aes-256-cbc")

        return {status: 200, success: true, user: userData, encryptedUserData: new Uint8Array(encryptedUserData).toString(), kdf: tedk}
    }

    public static async checkPassword(req: any) {
        const password = req.body.password
        if (!password) {return {status: 400, success: false, message: "Missing fields"}}

        const result = await User.get(req)
        if (!result.success) {return result}

        const user = result.user
        if (!user) {return {status: 400, success: false, message: "Could not find user"}}

        if (await bcrypt.compare(password, user.password, null) === true) {return {status: 200, success: true}} else {return {status: 400, success: false, message: "Invalid password"}}
    }

    public static async account(req: any, type: string) {
        const { encryptedData: base64EncodedEncryptedData, encryptedSymmetricKey: base64EncodedEncryptedSymmetricKey, iv: base64EncodedIv } = req.body
        if (!base64EncodedEncryptedData || !base64EncodedEncryptedSymmetricKey || !base64EncodedIv) {return {status: 400, success: false, error: "Missing encrypted data or symmetric key"}}

        const decryptedData = new CryptoHelper().SimpleDecrypt(base64EncodedEncryptedData, base64EncodedEncryptedSymmetricKey, base64EncodedIv)
        if (!decryptedData) {return {status: 400, success: false, error: "Invalid data"}}
        const requestData = JSON.parse(decryptedData)

        const passwordHash = requestData["password"]
        if (!passwordHash) {return {status: 400, success: false, error: "Missing password hash"}}

        const user = await User.get(req, passwordHash)
        if (!user.success) {return user}

        const kdf = user.kdf

        const newUser = user.user

        if (type == "name") {
            newUser["profile"]["name"] = requestData["name"].split(" ")
            const newEncryptedUser = new CryptoHelper().encryptAES(JSON.stringify(newUser), kdf, Buffer.from(user.user.iv, "hex"), "aes-256-cbc")
            if (!newEncryptedUser) {return {status: 400, success: false, error: "Could not encrypt user data"}}

            await database.updateUser(user.user.id, {data: newEncryptedUser.toString("hex")})
        } else if (type == "username") {
            const newKdf = new CryptoHelper().KDF(passwordHash, requestData["username"])
            const newEncryptedUser = new CryptoHelper().encryptAES(JSON.stringify(newUser), newKdf, Buffer.from(user.user.iv, "hex"), "aes-256-cbc")
            if (!newEncryptedUser) {return {status: 400, success: false, error: "Could not encrypt user data"}}
            await database.updateUser(user.user.id, {username: requestData["username"], data: newEncryptedUser.toString("hex")})

            await database.deleteAllSessions(user.user.id)

            // Create new session
            const requesterIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress
            const hashedIp = new CryptoHelper().Hash(requesterIp)
            const location = await fetch(`http://ip-api.com/json/${requesterIp}`)

            const sessionToken = crypto.randomBytes(32)

            const sessionData = {
                token: sessionToken.toString("hex"),
                location: await location.json(),
                device: req.headers['user-agent'],
                tedk: newKdf.export().toString('hex')
            }

            const sessionSecret = new CryptoHelper().generateAESKey()

            const encryptedSessionData = new CryptoHelper().encryptAES(JSON.stringify(sessionData), crypto.createSecretKey(sessionToken), Buffer.from(user.user.iv, "hex"), 'aes-256-cbc')

            const session = {
                id: crypto.randomBytes(16).toString('hex'),
                created: Date.now(),
                ip: hashedIp,
                secret: sessionSecret.export().toString('hex'),
                sessionData: encryptedSessionData.toString('hex')
            }

            const newSession = await database.createSession(user.user.id, session)

            const encryptedSessionDataToSend = new CryptoHelper().encryptAES(JSON.stringify({
                secret: new Uint8Array(sessionSecret.export()).toString(),
                token: new Uint8Array(sessionToken).toString(),
                id: session.id,
                sessionDoc: newSession
            }), newKdf, Buffer.from(user.user.iv, "hex"), 'aes-256-cbc')
            // end session creation

            return {
                status: 200,
                success: true,
                session: new Uint8Array(encryptedSessionDataToSend).toString(),
                iv: new Uint8Array(Buffer.from(user.user.iv, "hex")).toString(),
                uuid: user.user.id
            }
        } else if (type == "birthday") {
            const bdayDate = new Date(requestData["birthday"])
            newUser["account"]["birthday"] = bdayDate.getTime()
            const newEncryptedUser = new CryptoHelper().encryptAES(JSON.stringify(newUser), kdf, Buffer.from(user.user.iv, "hex"), "aes-256-cbc")
            if (!newEncryptedUser) {return {status: 400, success: false, error: "Could not encrypt user data"}}

            await database.updateUser(user.user.id, {data: newEncryptedUser.toString("hex")})
        }


        return {status: 200, success: true}
    }

    public static async email(req: any, step: number) {
        if (step === 1) {
            const user = await User.get(req)
            if (!user.success) {return user}
            const newUser = user.user

            const resend = new Resend(process.env.RESEND_KEY);
            const emailVerification = Math.random().toString(36).slice(2, 8)
            const formattedEmailVerification = emailVerification.toUpperCase().slice(0, 3) + "-" + emailVerification.toUpperCase().slice(3)
            await sendVerificationEmail(resend, user.user.account.email, formattedEmailVerification)

            newUser["account"]["email_change"] = {step: 1, code: emailVerification, email: user.user.account.email}
            const newEncryptedUser = new CryptoHelper().encryptAES(JSON.stringify(newUser), user.kdf, Buffer.from(user.user.iv, "hex"), "aes-256-cbc")
            if (!newEncryptedUser) {return {status: 400, success: false, error: "Could not encrypt user data"}}
            await database.updateUser(user.user.id, {data: newEncryptedUser.toString("hex")})

            return {status: 200, success: true}
        } else if (step === 2) {
            const user = await User.get(req)
            if (!user.success) {return user}
            const newUser = user.user

            const code = req.body.code

            if (code == newUser.account.email_change.code && newUser.account.email_change.step == 1) {
                return {status: 200, success: true}
            } else {
                return {status: 500, success: false, message: "Invalid state"}
            }
        } else if (step === 3) {
            const decryptedData = new CryptoHelper().SimpleDecrypt(req.body.encryptedData, req.body.encryptedSymmetricKey, req.body.iv)
            if (!decryptedData) {return {status: 400, success: false, message: "Invalid data"}}
            const decryptedDataJSON = JSON.parse(decryptedData)

            console.log(decryptedDataJSON)
            const user = await User.get(req, decryptedDataJSON.password)
            if (!user.success) {return user}
            const newUser = user.user

            if (newUser.account.email_change == null) {
                return {status: 500, success: false, message: "Invalid state"}
            }

            newUser.account.email = decryptedDataJSON.email
            newUser.account.email_change.step = 0

            const newEncryptedUser = new CryptoHelper().encryptAES(JSON.stringify(newUser), user.kdf, Buffer.from(user.user.iv, "hex"), "aes-256-cbc")
            if (!newEncryptedUser) {return {status: 400, success: false, error: "Could not encrypt user data"}}
            await database.updateUser(user.user.id, {data: newEncryptedUser.toString("hex")})

            return {status: 200, success: true}
        }

        return {status: 500, success: false, message: "Internal conflict"}
    }

    public static async preferences(req: any) {
        const share_analytics = req.body["share_analytics"]
        const share_storage_data = req.body["share_storage_data"]

        const result = await User.get(req)
        if (!result.success) {return result}
        const user = result.user
        if (!user) {return {status: 400, success: false, message: "Could not find user"}}

        if (share_analytics !== undefined) {
            await database.updateUser(user.id, {"account.analytics.share_analytics": share_analytics})
            return {status: 200, success: true}
        } else if (share_storage_data !== undefined) {
            await database.updateUser(user.id, {"account.analytics.share_storage_data": share_storage_data})
            return {status: 200, success: true}
        } else {
            return {status: 400, success: false, message: "Missing fields"}
        }
    }

    public static async updateAvatar(req: any) {
        const file = req.body
        if (!file || !file.fileName || !file.fileSize || !file.fileType || !file.data) {return {status: 400, success: false, message: "Missing fields"}}

        const user = await User.get(req)
        if (!user.success) {return user}

        const avatarURL = await database.uploadAvatar(user.user.id, file)

        if (avatarURL) {
            const newUser = user.user
            newUser["profile"]["avatar"] = avatarURL
            const newEncryptedUser = new CryptoHelper().encryptAES(JSON.stringify(newUser), user.kdf, Buffer.from(user.user.iv, "hex"), "aes-256-cbc")
            if (!newEncryptedUser) {return {status: 400, success: false, error: "Could not encrypt user data"}}

            await database.updateUser(user.user.id, {data: newEncryptedUser.toString("hex")})
            return {status: 200, success: true}
        } else {
            return {status: 400, success: false, message: "Could not upload avatar"}
        }
    }

    public static async resetAvatar(req: any) {
        const user = await User.get(req)
        if (!user.success) {return user}

        const newUser = user.user
        newUser["profile"]["avatar"] = "https://api.dicebear.com/5.x/identicon/svg?backgroundType=gradientLinear,solid&row1[]&row5[]&backgroundColor=ffd5dc,d1d4f9,c0aede,b6e3f4,ffdfbf&seed=" + user.user.username
        const newEncryptedUser = new CryptoHelper().encryptAES(JSON.stringify(newUser), user.kdf, Buffer.from(user.user.iv, "hex"), "aes-256-cbc")
        if (!newEncryptedUser) {return {status: 400, success: false, error: "Could not encrypt user data"}}

        await database.updateUser(user.user.id, {data: newEncryptedUser.toString("hex")})

        return {status: 200, success: true}
    }

    public static async profile(req: any) {
        const user = await User.get(req)
        if (!user.success) {return user}

        const newUser = user.user
        const decryptedData = new CryptoHelper().SimpleDecrypt(req.body.encryptedData, req.body.encryptedSymmetricKey, req.body.iv)
        if (!decryptedData) {return {status: 400, success: false, message: "Invalid data"}}
        const decryptedDataJSON = JSON.parse(decryptedData)

        newUser["profile"]["about_me"] = decryptedDataJSON["about_me"]
        newUser["profile"]["display_name"] = decryptedDataJSON["display_name"]
        if (decryptedDataJSON["color"] == "#ff4444" || decryptedDataJSON["color"] == null) {
            newUser["profile"]["profile_color"] = "#ff4444"
        } else {
            newUser["profile"]["profile_color"] = decryptedDataJSON["color"]
            newUser["profile"]["last_custom_color"] = decryptedDataJSON["color"]
        }

        const newEncryptedUser = new CryptoHelper().encryptAES(JSON.stringify(newUser), user.kdf, Buffer.from(user.user.iv, "hex"), "aes-256-cbc")
        if (!newEncryptedUser) {return {status: 400, success: false, error: "Could not encrypt user data"}}
        await database.updateUser(user.user.id, {data: newEncryptedUser.toString("hex")})

        return {status: 200, success: true}
    }
}