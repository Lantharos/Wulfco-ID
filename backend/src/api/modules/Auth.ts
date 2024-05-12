import crypto from "crypto";
import * as database from "./util/FirebaseHandler";
import User from "./User";
import { Resend } from "resend"
import * as hcaptcha from "hcaptcha";
import CH from "./util/CryptoHelper";
import verifyEmail from "./emails/verify-email"
import firebase from "firebase/compat/app";

const CryptoHelper = new CH()

// const resend = new Resend(process.env.RESEND_KEY);

export default class Auth {
    public static async login(req: any) {
        if (req.method !== "POST") {return "error"}

        const requesterIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress

        if (req.body.hcaptcha) {
            const returned = await hcaptcha.verify(process.env.HCAPTCHA_SECRET, req.body.hcaptcha, requesterIp, process.env.HCAPTCHA_SITE_KEY).then((data: any) => {
                if (!data.success) {return {status: 400, success: false, error: "Invalid captcha token"}}
                return false
            })

            if (returned) {return returned}
        } else {
            return {status: 400, success: false, error: "Missing captcha token"}
        }

        const { encryptedData: base64EncodedEncryptedData, encryptedSymmetricKey: base64EncodedEncryptedSymmetricKey, iv: base64EncodedIv } = req.body
        if (!base64EncodedEncryptedData || !base64EncodedEncryptedSymmetricKey || !base64EncodedIv) {return {status: 400, success: false, error: "Missing encrypted data or symmetric key"}}

        const decryptedData = CryptoHelper.SimpleDecrypt(base64EncodedEncryptedData, base64EncodedEncryptedSymmetricKey, base64EncodedIv)
        if (!decryptedData) {return {status: 400, success: false, error: "Invalid data"}}
        const baseStuff = JSON.parse(decryptedData)

        if (req.body.hcaptcha) {
            const returned = await hcaptcha.verify(process.env.HCAPTCHA_SECRET, req.body.hcaptcha, requesterIp, process.env.HCAPTCHA_SITE_KEY).then((data: any) => {
                if (!data.success) {return {status: 400, success: false, error: "Invalid captcha token"}}
                return false
            })

            if (returned) {return returned}
        } else {
            return {status: 400, success: false, error: "Missing captcha token"}
        }

        const user = await database.getUserByUsername(baseStuff.username)
        if (!user) {return {status: 404, success: false, error: "invalid_username", message: "Username not found!"}}

        const userData = user.data()
        if (!userData) {return {status: 404, success: false, error: "User not found"}}
        if (userData.key) {return {status: 400, success: false, error: "email_not_verified", message: "Email isnt verified!", uuid: user.id}}

        const encryptionKey = CryptoHelper.KDF(baseStuff.passwordHash, baseStuff.username)
        const userIv = Buffer.from(userData.iv, 'hex')

        const decryptedUser = CryptoHelper.decryptAES(Buffer.from(userData.data, 'hex'), encryptionKey, userIv, 'aes-256-cbc')
        if (!decryptedUser) {return {status: 400, success: false, error: "invalid_password", message: "Incorrect password!"}}

        const userObject = JSON.parse(decryptedUser)

        const location = await fetch(`http://ip-api.com/json/${requesterIp}`)
        const hashedIp = CryptoHelper.Hash(requesterIp)

        const sessionToken = crypto.randomBytes(32)

        const sessionData = {
            token: sessionToken.toString("hex"),
            location: await location.json(),
            device: req.headers['user-agent'],
            tedk: encryptionKey.export().toString('hex')
        }

        const sessionSecret = CryptoHelper.generateAESKey()

        const encryptedSessionData = CryptoHelper.encryptAES(JSON.stringify(sessionData), crypto.createSecretKey(sessionToken), userIv, 'aes-256-cbc')

        const session = {
            id: crypto.randomBytes(16).toString('hex'),
            created: Date.now(),
            ip: hashedIp,
            secret: sessionSecret.export().toString('hex'),
            sessionData: encryptedSessionData.toString('hex')
        }

        const sesDocId = await database.getSessionDoc(user.id)
        if (sesDocId) {
            const existingSession = await database.getSessionByIp(sesDocId.id, hashedIp)
            if (existingSession) {await database.deleteSession(sesDocId.id, existingSession.id)}
        }

        const newSession = await database.createSession(user.id, session)

        userObject.account.security.last_login = Date.now()

        const updatedUser = CryptoHelper.encryptAES(JSON.stringify(userObject), encryptionKey, userIv, 'aes-256-cbc')
        await database.updateUser(user.id, { data: updatedUser.toString('hex') })

        const encryptedSessionDataToSend = CryptoHelper.encryptAES(JSON.stringify({
            secret: new Uint8Array(sessionSecret.export()).toString(),
            token: new Uint8Array(sessionToken).toString(),
            id: session.id,
            sessionDoc: newSession
        }), encryptionKey, userIv, 'aes-256-cbc')

        return {
            status: 200,
            success: true,
            session: new Uint8Array(encryptedSessionDataToSend).toString(),
            iv: new Uint8Array(userIv).toString(),
            uuid: user.id
        }
    }

    public static qrLogin() {
        return { status: 200, success: true, data: "Unavailable" }
    }

    public static async logout(req: any) {
        const session_id = req.body.session
        const loggen = req.body.loggen
        const uuid = req.body.uuid
        if (!session_id || !loggen || !uuid) {return {status: 400, success: false, error: "Missing session or loggen"}}

        const rawuser = await database.getUser(uuid)
        if (!rawuser) {return {status: 404, success: false, error: "User not found"}}

        const user = rawuser.data()
        if (!user) {return {status: 404, success: false, error: "User not found"}}

        if (user.account.sessions.length === 0) {return {status: 404, success: false, error: "User not logged in"}}
        const session = user.account.sessions.find((session: any) => session.session_id === session_id)
        if (!session) {return {status: 404, success: false, error: "Session not found"}}
        if (session.loggen !== loggen) {return {status: 401, success: false, error: "Invalid loggen"}}

        user.account.sessions.splice(user.account.sessions.indexOf(session), 1)
        await database.updateUser(user.id, user)

        return {status: 200, success: true}
    }

    public static async logoutAll(req: any) {
        const result = await User.get(req)
        if (!result.success) {return {status: 404, success: false, error: "User not found"}}

        if (result.user.account.sessions.length === 0) {return {status: 404, success: false, error: "User not logged in"}}

        await database.updateUser(result.user.id, { "account.sessions": [] })

        return {status: 200, success: true}
    }

    public static async create(req: any) {
        const requesterIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip

        const { encryptedData: base64EncodedEncryptedData, encryptedSymmetricKey: base64EncodedEncryptedSymmetricKey, iv: base64EncodedIv } = req.body
        if (!base64EncodedEncryptedData || !base64EncodedEncryptedSymmetricKey || !base64EncodedIv) {return {status: 400, success: false, error: "Missing encrypted data or symmetric key"}}

        const decryptedData = CryptoHelper.SimpleDecrypt(base64EncodedEncryptedData, base64EncodedEncryptedSymmetricKey, base64EncodedIv)
        if (!decryptedData) {return {status: 400, success: false, error: "Invalid data"}}
        const userData = JSON.parse(decryptedData)

        if (req.body.hcaptcha) {
            const returned = await hcaptcha.verify(process.env.HCAPTCHA_SECRET, req.body.hcaptcha, requesterIp, process.env.HCAPTCHA_SITE_KEY).then((data: any) => {
                if (!data.success) {return {status: 400, success: false, error: "Invalid captcha token"}}
                return false
            })

            if (returned) {return returned}
        } else {
            return {status: 400, success: false, error: "Missing captcha token"}
        }

        const usernameExists = await database.getUserByUsername(userData.username)
        if (usernameExists) {return {status: 400, success: false, error: "username_taken", message: "Username already taken!"}}

        const emailVerification = Math.random().toString(36).slice(2, 8)

        const toEncryptUser = {
            account: {
                analytics: { personalization: true, analytics: true, zipped: true, marketing: false, tp_marketing: true },
                billing: { paypal: [], stripe: ''},
                birthday: undefined,
                created: Date.now(),
                email: userData.email,
                email_verification: {token: emailVerification, verified: false},
                identity_verification: {},
                security: {
                    email: false,
                    protected: false,
                    last_login: Date.now(),
                    security_keys: [],
                    passkeys: [],
                    totp: { enabled: false, secret: '' },
                },
            },
            connections: [],
            oauth: [],
            friends: { friends: [], requests: { inbound: [], outbound: [] }, blocked: []},
            profile: {
                name: userData.name.split(' '),
                display_name: userData.display_name,
                gender: userData.gender,
                avatar: userData.picture,
                about_me: '',
                profile_color: "#ff4444",
                pronouns: (userData.gender.toLowerCase() === "male") ? "he/him" : (userData.gender.toLowerCase() === "female") ? "she/her" : "they/them",
            }
        }

        const userIV = crypto.randomBytes(16)

        const encryptionKey = CryptoHelper.KDF(userData.password, userData.username)
        const encryptedUser = CryptoHelper.encryptAES(JSON.stringify(toEncryptUser), encryptionKey, userIV, 'aes-256-cbc')

        const encryptedUserKey = CryptoHelper.encryptPublicKey(new Uint8Array(encryptionKey.export()))

        const user = {
            username: userData.username,
            iv: userIV.toString('hex'),
            data: encryptedUser.toString("hex"),
            key: encryptedUserKey.toString("hex")
        }

        const docId = await database.createUser(user)

        const resend = new Resend(process.env.RESEND_KEY);

        const formattedEmailVerification = emailVerification.toUpperCase().slice(0, 3) + "-" + emailVerification.toUpperCase().slice(3)

        await verifyEmail(resend, userData.email, formattedEmailVerification)

        return { status: 200, success: true, uuid: docId }
    }

    public static async verifyEmail(req: any) {
        const userId = req.body.id
        if (!userId) {return {status: 400, success: false, error: "Missing user id"}}

        const rawuser = await database.getUser(userId)
        if (!rawuser) {return {status: 404, success: false, error: "User not found"}}

        const code = req.body.code
        if (!code) {return {status: 400, success: false, error: "Missing code"}}

        const userData = rawuser.data()
        if (!userData) {return {status: 400, success: false, error: "User is invalid"}}
        if (!userData.key) {return {status: 400, success: false, error: "Key missing, presuming email already verified"}}

        const userIV = Buffer.from(rawuser.data().iv, 'hex')
        const userKeyBuffer = Buffer.from(userData.key, 'hex')
        const userKeyObject = CryptoHelper.decryptPrivateKey(userKeyBuffer)
        const userKeySecret = crypto.createSecretKey(userKeyObject)

        const decryptedUser = CryptoHelper.decryptAES(Buffer.from(rawuser.data().data, 'hex'), userKeySecret, userIV, 'aes-256-cbc')
        if (!decryptedUser) {return {status: 400, success: false, error: "Invalid user data"}}
        const user = JSON.parse(decryptedUser)

        if (user.account.email_verification.verified) {return {status: 400, success: false, error: "Email already verified"}}

        if (user.account.email_verification.token === code) {
            user.account.email_verification.verified = true
            const updatedUser = CryptoHelper.encryptAES(JSON.stringify(user), userKeySecret, userIV, 'aes-256-cbc')
            await database.updateUser(userId, { data: updatedUser.toString('hex'), key: firebase.firestore.FieldValue.delete() })

            return {status: 200, success: true}
        } else {
            return {status: 400, success: false, error: "Invalid code"}
        }
    }
}