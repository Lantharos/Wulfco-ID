import crypto from "crypto";
import bcrypt from "bcrypt";
import * as database from "../FirebaseHandler";
import mail from "@sendgrid/mail";
import Payments from "./Payments";

mail.setApiKey(`${process.env.SENDGRID_API_KEY}`)

export default class User {
    public static async get(req: any) {
        const session_id = req.headers['w-session']
        const signedToken = req.headers['w-auth']
        const loggen = req.headers['w-loggen']
        const user_id = req.query.id

        if (!session_id || !signedToken || !loggen || !user_id) {
            return {status: 400, success: false, message: "Missing headers"}
        }

        const rawUser = await database.getUser(user_id)
        if (!rawUser) {
            return {status: 400, success: false, message: "Could not find user"}
        }
        const user = rawUser.data()
        if (!user) { return {status: 400, success: false, message: "Could not find user"} }

        if (!user.account.email || !user.account.email.verified) { return {status: 401, success: false, message: "Email not verified"} }

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

        const requesterIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress

        if (req.headers['w-reason'] === 'get-user-data') {
            const location = await fetch(`http://ip-api.com/json/${requesterIp}`)
            const locationData = await location.json()

            if (locationData.region !== session.location.region) {
                await mail.send({
                    to: user.email,
                    from: "alerts@wulfco.xyz",
                    subject: 'Suspicious activity detected on your account',
                    text: `Hello @${user.profile.username},\n\nSomeone has tried to access your account from an unusual location or device. If this wasn\'t you, please log in to your account and change your password immediately. If you need further help don\'t hesitate to contact us!\n\nBest regards,\nYour Wulfco team`
                })

                return {status: 400, success: false, message: "Invalid location"}
            }
        }

        let billingInfo = {}

        if (user.account.billing && user.account.billing.customer_id) {
            const resultic = await Payments.getCards(user)
            billingInfo["cards"] = resultic.cards

            const resultit = await Payments.getTransactions(user)
            billingInfo["transactions"] = resultit.transactions
        }

        user["account"]["billing"] = billingInfo

        return {status: 200, success: true, user, rawUser}
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

        const rawUser = result.rawUser
        if (!rawUser) {return {status: 400, success: false, message: "Could not find user"}}

        if (user.email === newEmail && user.profile.username === newUsername && !req.body["birthday"] && !req.body["name"]) {return {status: 400, success: false, message: "No changes were made"}}
        if (req.body["birthday"]) {
            const birthday = Date.parse(req.body["birthday"])
            await database.updateUser(rawUser.id, {"account.birthday": birthday})
        } else if (req.body["name"]) {
            const name = req.body["name"]
            await database.updateUser(rawUser.id, {"account.full_name": name})
        } else {
            if (user.email === newEmail) {
                const discriminator = Math.floor(Math.random() * 9999)

                await database.updateUser(rawUser.id, {"profile.username": newUsername, "profile.discriminator": discriminator})
            } else {
                await database.updateUser(rawUser.id, {email: newEmail, "profile.username": newUsername})
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
            await database.updateUser(result.rawUser.id, {"account.analytics.share_analytics": share_analytics})
            return {status: 200, success: true}
        } else if (share_storage_data !== undefined) {
            await database.updateUser(result.rawUser.id, {"account.analytics.share_storage_data": share_storage_data})
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
        const rawUser = result.rawUser
        if (!rawUser) {return {status: 400, success: false, message: "Could not find user"}}

        const success = await database.uploadAvatar(rawUser.id, file)

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
        const rawUser = result.rawUser
        if (!rawUser) {return {status: 400, success: false, message: "Could not find user"}}

        await database.updateUser(rawUser.id, {"profile.avatar": `https://api.dicebear.com/5.x/identicon/svg?seed=${user.profile.full_name.split(" ")[0]}&backgroundColor=ffdfbf`})

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

        const rawUser = result.rawUser
        if (!rawUser) {
            return {status: 400, success: false, message: "Could not find user"}
        }

        await database.updateUser(rawUser.id, {"profile.about_me": newAboutMe || "", "profile.profile_color": newProfileColor || "#008cff", "profile.pronouns": newPronouns || ""})

        return {status: 200, success: true}
    }
}