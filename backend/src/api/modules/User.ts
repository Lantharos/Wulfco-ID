import crypto from "crypto";
import bcrypt from "bcrypt";
import * as database from "./util/FirebaseHandler";
import Payments from "./Payments";
import CryptoHelper from "./util/CryptoHelper";
import Auth from "./Auth";

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

        return {status: 200, success: true, user: userData, encryptedUserData: new Uint8Array(encryptedUserData).toString()}
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

        const kdf = new CryptoHelper().KDF(passwordHash, user.user.username)

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
        if (!file) {return {status: 400, success: false, message: "Missing fields"}}

        const result = await User.get(req)
        if (!result.success) {return result}
        const user = result.user
        if (!user) {return {status: 400, success: false, message: "Could not find user"}}

        const success = await database.uploadAvatar(user.id, file)

        if (success) {
            return {status: 200, success: true}
        } else {
            return {status: 400, success: false, message: "Could not upload avatar"}
        }
    }

    public static async resetAvatar(req: any) {
        const result = await User.get(req)
        if (!result.success) {return result}
        const user = result.user
        if (!user) {return {status: 400, success: false, message: "Could not find user"}}

        await database.updateUser(user.id, {"profile.avatar": `https://api.dicebear.com/5.x/identicon/svg?seed=${user.profile.full_name.split(" ")[0]}&backgroundColor=ffdfbf`})

        return {status: 200, success: true}
    }

    public static async profile(req: any) {
        const newAboutMe = req.body["about_me"]
        const newProfileColor = req.body["profile_color"]
        const newPronouns = req.body["pronouns"]

        if (!newAboutMe && !newProfileColor && !newPronouns) {
            return {status: 400, success: false, message: "Missing fields"}
        }

        const result = await User.get(req)
        if (!result.success) {
            return result
        }

        await database.updateUser(result.user.id, {"profile.about_me": newAboutMe || "", "profile.profile_color": newProfileColor || "#008cff", "profile.pronouns": newPronouns || ""})

        return {status: 200, success: true}
    }
}