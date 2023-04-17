import Users from "../schemas/Users";
import * as crypto from "crypto";
const bcrypt = require("bcrypt")

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

            const user = await Users.findOne({email})
            if (!user) {return {status: 404, success: false, error: "User not found"}}

            if (await bcrypt.compare(password, user.password, null) === false) {return {status: 401, success: false, error: "Invalid password"} }

            const requesterIp = req.body.ip

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

            const existingSession = user.account.sessions.find((session: any) => session.ip === requesterIp)

            if (existingSession) {
                user.account.sessions.splice(user.account.sessions.indexOf(existingSession), 1)
            }

            const expiredSessions = user.account.sessions.filter((session: any) => Date.now() - session.created > 1000 * 60 * 60 * 24)
            expiredSessions.forEach((session: any) => {
                user.account.sessions.splice(user.account.sessions.indexOf(session), 1)
            })

            user.account.sessions.push(session)
            user.account.last_login = Date.now()

            await Users.updateOne({uuid: user.uuid}, user)

            return {
                status: 200,
                success: true,
                session,
                uuid: user.uuid
            }
        }
    }

    public static qrLogin() {
        return {qr: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Hello%20World"}
    }

    public static async logout(req: any) {
        const session_id = req.body.session
        const loggen = req.body.loggen
        const uuid = req.body.uuid
        if (!session_id || !loggen || !uuid) {return {status: 400, success: false, error: "Missing session or loggen"}}

        const user = await Users.findOne({ uuid })
        if (!user) {return {status: 404, success: false, error: "User not found"}}

        if (user.account.sessions.length === 0) {return {status: 404, success: false, error: "User not logged in"}}
        const session = user.account.sessions.find((session: any) => session.session_id === session_id)
        if (!session) {return {status: 404, success: false, error: "Session not found"}}
        if (session.loggen !== loggen) {return {status: 401, success: false, error: "Invalid loggen"}}

        user.account.sessions.splice(user.account.sessions.indexOf(session), 1)
        await Users.updateOne({uuid: user.uuid}, user)

        return {status: 200, success: true}
    }

    public static async create(req: any) {
        const session = {
            session_id: crypto.randomBytes(16).toString("hex"),
            secret: crypto.randomBytes(16).toString("hex"),
            token: crypto.randomBytes(16).toString("hex"),
            loggen: crypto.randomBytes(8).toString("hex"),
            created: Date.now(),
            ip: req.ip,
            device: req.headers['user-agent'],
        }

        const uuid = crypto.randomUUID()
        const discriminator = Math.floor(Math.random() * 9999)

        await new Users({
            uuid,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10, null),
            account: {
                created: Date.now(),
                last_login: Date.now(),
                sessions: [session],
                analytics: {
                    share_storage_data: true,
                    share_analytics: true
                }
            },
            friends: {},
            billing: {},
            profile: {
                username: req.body.username,
                discriminator: discriminator,
                full_name: req.body.name,
                gender: req.body.gender,
                avatar: `https://api.dicebear.com/5.x/identicon/svg?seed=${req.body.name.split(" ")[0]}`
            },
            connections: {}
        }).save()

        return { status: 200, success: true, session, uuid }
    }
}