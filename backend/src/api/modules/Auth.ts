import crypto from "crypto";
import * as database from "../FirebaseHandler";
import User from "./User";
import bcrypt from "bcrypt";
import mail from "@sendgrid/mail";

mail.setApiKey(`${process.env.SENDGRID_API_KEY}`)

export default class Auth {
    public static async login(req: any) {
        if (req.method !== "POST") {return "error"}

        const isCrypto = req.headers['W-Crypto'] === "true"

        if (isCrypto) {
            return {
                status: 501,
                success: false,
                message: "Crypto login is not implemented yet"
            }
        } else {
            const email = atob(req.body.email)
            const password = atob(req.body.password)

            if (!email || !password) {return {status: 400, success: false, error: "Missing email or password"}}

            const rawUser = await database.getUserByEmail(email)
            if (!rawUser) {return {status: 404, success: false, error: "User not found"}}

            const user = rawUser.data()
            if (!user) {return {status: 404, success: false, error: "User not found"}}

            if (!user.account.email || !user.account.email.verified) {return {status: 401, success: false, error: "Email not verified"}}

            if (await bcrypt.compare(password, user.password, null) === false) {return {status: 401, success: false, error: "Invalid password"} }

            const requesterIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress

            const location = await fetch(`http://ip-api.com/json/${requesterIp}`)

            const session = {
                session_id: crypto.randomBytes(16).toString("hex"),
                secret: crypto.randomBytes(16).toString("hex"),
                token: crypto.randomBytes(16).toString("hex"),
                loggen: crypto.randomBytes(8).toString("hex"),
                created: Date.now(),
                ip: requesterIp,
                location: await location.json(),
                device: req.headers['user-agent']
            }

            const existingSessionIndex = user.account.sessions.findIndex((session: any) => session.ip === requesterIp);

            if (existingSessionIndex !== -1) {
                user.account.sessions.splice(existingSessionIndex, 1);
            }

            const expiredSessions = user.account.sessions.filter((session: any) => Date.now() - session.created > 1000 * 60 * 60 * 24)
            if (expiredSessions != undefined) {
                expiredSessions.forEach((expiredSession: any) => {
                    user.account.sessions.splice(user.account.sessions.indexOf(expiredSession), 1)
                })
            }

            user.account.sessions.push(session)
            user.account.last_login = Date.now()

            await database.updateUser(rawUser.id, user)

            return {
                status: 200,
                success: true,
                session,
                uuid: rawUser.id
            }
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
        const rawuser = await User.get(req)
        if (!rawuser.success) {return {status: 404, success: false, error: "User not found"}}

        if (rawuser.user.account.sessions.length === 0) {return {status: 404, success: false, error: "User not logged in"}}

        await database.updateUser(rawuser.rawUser.id, { "account.sessions": [] })

        return {status: 200, success: true}
    }

    public static async create(req: any) {
        const requesterIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress
        const location = await fetch(`http://ip-api.com/json/${requesterIp}`)

        const session = {
            session_id: crypto.randomBytes(16).toString("hex"),
            secret: crypto.randomBytes(16).toString("hex"),
            token: crypto.randomBytes(16).toString("hex"),
            loggen: crypto.randomBytes(8).toString("hex"),
            created: Date.now(),
            location: await location.json(),
            ip: requesterIp,
            device: req.headers['user-agent'],
        }

        const code = Math.floor(100000 + Math.random() * 900000)

        const discriminator = Math.floor(Math.random() * 9999)

        const docId = await database.createUser({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10, null),
            account: {
                created: Date.now(),
                last_login: Date.now(),
                sessions: [session],
                email: {
                    verified: false,
                    code: code
                },
                analytics: {
                    share_storage_data: true,
                    share_analytics: true
                }
            },
            friends: {},
            profile: {
                username: req.body.username,
                discriminator: discriminator,
                full_name: req.body.name,
                gender: req.body.gender,
                avatar: `https://api.dicebear.com/5.x/identicon/svg?seed=${req.body.name.split(" ")[0]}&backgroundColor=ffdfbf`
            },
            connections: {}
        })

        if (!docId) {return {status: 500, success: false, error: "Failed to create user"}}

        await mail.send({
            to: req.body.email,
            from: "no-reply@wulfco.xyz",
            subject: 'Verify your email',
            text: `Hello @${req.body.username},\n\nThank you for signing up for Wulfco! Please verify your email by entering the following code in the app: ${code}\n\nBest regards,\nYour Wulfco team`
        })

        return { status: 200, success: true, session, uuid: docId }
    }

    public static async verifyEmail(req: any) {
        const rawuser = await database.getUser(req.body.user)
        if (!rawuser) {return {status: 404, success: false, error: "User not found"}}

        const code = req.body.code
        if (!code) {return {status: 400, success: false, error: "Missing code"}}

        if (rawuser.data().account.email && rawuser.data().account.email.verified) {return {status: 400, success: false, error: "Email already verified"}}

        if (code === rawuser.data().account.email.code.toString()) {
            await database.updateUser(rawuser.id, { "account.email.verified": true })

            await mail.send({
                to: rawuser.data().email,
                from: "no-reply@wulfco.xyz",
                subject: 'Email verified',
                text: `Hello @${rawuser.data().profile.username},\n\nYour email has been verified successfully!\n\nBest regards,\nYour Wulfco team`
            })

            return {status: 200, success: true}
        } else {
            return {status: 400, success: false, error: "Invalid code"}
        }
    }
}