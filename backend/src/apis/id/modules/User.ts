import Users from "../schemas/Users";
import * as crypto from "crypto";
import mail from "@sendgrid/mail";
const bcrypt = require("bcrypt")

export default class User {
    public static async get(req: any) {
        const session_id = req.headers['w-session']
        const signedToken = req.headers['w-auth']
        const loggen = req.headers['w-loggen']
        const user_id = req.query.id

        if (!session_id || !signedToken || !loggen || !user_id) {
            return {status: 400, success: false, message: "Missing headers"}
        }

        const user = await Users.findOne({uuid: user_id})
        if (!user) {
            return {status: 400, success: false, message: "Could not find user"}
        }
        const session = user.account.sessions.find((session: any) => session.session_id === session_id)

        if (!session) {
            return {status: 400, success: false, message: "Could not find session!"}
        }
        if (session.loggen !== loggen) {
            return {status: 401, success: false, message: "Invalid loggen"}
        }
        const obtainedSignedToken = crypto.createHmac("sha256", session.secret).update(session.token).digest("hex")
        if (obtainedSignedToken !== signedToken) {
            return {status: 401, success: false, message: "Invalid token"}
        }

        const requesterIp = req.headers['w-ip']
        const location = await fetch(`http://ip-api.com/json/${requesterIp}`)
        const locationData = await location.json()

        if (req.headers['w-reason'] === 'get-user-data') {
            if (locationData.region !== session.location.region) {
                mail.setApiKey(`${process.env.SENDGRID_API_KEY}`)

                await mail.send({
                    to: user.email,
                    from: "alerts@wulfco.xyz",
                    subject: 'Suspicious activity detected on your account',
                    text: `Hello @${user.profile.username},\n\nSomeone has tried to access your account from an unusual location or device. If this wasn\'t you, please log in to your account and change your password immediately. If you need further help don\'t hesitate to contact us!\n\nBest regards,\nYour Wulfco team`
                })

                return {status: 400, success: false, message: "Invalid location"}
            }
        }

        return {status: 200, success: true, user}
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

    public static async account(req: any) {
        const newEmail = req.body["email"]
        const newUsername = req.body["username"]
        if(!newEmail || !newUsername) {return {status: 400, success: false, message: "Missing fields"}}

        const result = await User.get(req)
        if (!result.success) {return result}

        const user = result.user
        if (!user) {return {status: 400, success: false, message: "Could not find user"}}

        if (user.email === newEmail && user.profile.username === newUsername && !req.body["birthday"]) {return {status: 400, success: false, message: "No changes were made"}}
        if (req.body["birthday"]) {
            const birthday = Date.parse(req.body["birthday"])
            await Users.updateOne({uuid: user.uuid}, {"account.birthday": birthday})
        } else {
            if (user.email === newEmail) {
                const discriminator = Math.floor(Math.random() * 9999)
                await Users.updateOne({uuid: user.uuid}, {"profile.username": newUsername, "profile.discriminator": discriminator})
            } else {
                await Users.updateOne({uuid: user.uuid}, {email: newEmail, "profile.username": newUsername})
            }
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
            await Users.updateOne({uuid: user.uuid}, { "account.analytics.share_analytics": share_analytics })
            return {status: 200, success: true}
        } else if (share_storage_data !== undefined) {
            await Users.updateOne({uuid: user.uuid}, { "account.analytics.share_storage_data": share_storage_data })
            return {status: 200, success: true}
        } else {
            return {status: 400, success: false, message: "Missing fields"}
        }
    }

    public static async profile(req: any) {
        const newAboutMe = req.body["about_me"]
        const newProfileColor = req.body["profile_color"]
        const newPronouns = req.body["pronouns"]

        if (!newAboutMe || !newProfileColor || !newPronouns) {
            return {status: 400, success: false, message: "Missing fields"}
        }

        const result = await User.get(req)
        if (!result.success) {
            return result
        }

        const user = result.user
        if (!user) {
            return {status: 400, success: false, message: "Could not find user"}
        }

        await Users.updateOne({uuid: user.uuid}, {
            "profile.about_me": newAboutMe,
            "profile.profile_color": newProfileColor,
            "profile.pronouns": newPronouns
        })

        return {status: 200, success: true}
    }
}