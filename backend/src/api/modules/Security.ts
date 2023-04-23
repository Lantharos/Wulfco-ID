import User from "./User";
import * as crypto from "crypto";
import * as database from "../FirebaseHandler";
import mail from "@sendgrid/mail";
const bcrypt = require("bcrypt")

export default class Security {
    public static async registerSecurityKey(req: any) {
        const id = Buffer.from(req.body.id, "base64").toString("hex")
        const rawId = Buffer.from(req.body.rawId, "base64").toString("hex")
        const attestationObject = Buffer.from(req.body.response.attestationObject, "base64").toString("hex")
        const clientDataJSON = Buffer.from(req.body.response.clientDataJSON, "base64").toString("hex")
 
        if (!id || !rawId || !attestationObject || !clientDataJSON) { return {status: 400, success: false, message: "Missing fields"} }

        const result = await User.get(req)
        if (!result.success) { return result }
        if (!result.user) { return {status: 400, success: false, message: "Could not find user"} }

        const credential = { id, rawId, response: { attestationObject, clientDataJSON }, type: req.body.type, name: req.body.name };

        const currentUser = result.user
        const rawUser = result.rawUser

        if (currentUser.account.security && currentUser.account.security.security_keys) {
            await database.updateUser(rawUser.id, { "account.security.security_keys": currentUser.account.security.security_keys.push(credential), "account.security.protected": true })
        } else {
            await database.updateUser(rawUser.id, { "account.security.security_keys": [credential], "account.security.protected": true })
        }

        return {status: 200, success: true}
    }

    public static async removeSecurityKey(req: any) {
        const number = req.query.key
        if (!number) { return {status: 400, success: false, message: "Missing fields"} }

        const result = await User.get(req)
        if (!result.success) { return result }
        if (!result.user) { return {status: 400, success: false, message: "Could not find user"} }

        const currentUser = result.user
        const rawUser = result.rawUser

        if (currentUser.account.security.security_keys && currentUser.account.security.security_keys[number]) {
            const securityKeys = currentUser.account.security.security_keys;
            securityKeys.splice(number, 1);
            if (securityKeys === 1) {
                await database.updateUser(rawUser.id, {
                    "account.security.security_keys": [],
                    "account.security.protected": false
                });
                return {status: 200, success: true}
            } else {
                await database.updateUser(rawUser.id, {
                    "account.security.security_keys": securityKeys,
                    "account.security.protected": false
                });
                return {status: 200, success: true}
            }
        } else {
            return {status: 400, success: false, message: "Could not find key"}
        }
    }

    public static async resetPassword(req: any) {
        const email = atob(req.body.email)
        if (!email) { return {status: 400, success: false, message: "Missing fields"} }

        const rawUser = await database.getUserByEmail(email)
        if (!rawUser) { return {status: 400, success: false, message: "Could not find user"} }

        const token = crypto.randomBytes(20).toString("hex")

        mail.setApiKey(`${process.env.SENDGRID_API_KEY}`)

        await mail.send({
            to: email,
            from: "alerts@wulfco.xyz",
            subject: "Wulfco Password Reset",
            text: `Hello @${rawUser.data().profile.username}, \n\nYou or someone has requested a password reset using this email, if this was you please click the link below to reset your password. \n\nhttps://id.wulfco.xyz/change-password?token=${token} \n\nIf this was not you please ignore this email.\n\nThanks, \nWulfco Team`
        })

        await database.updateUser(rawUser.id, { "account.security.pass_reset_token": {token: token, created: Date.now()} })

        return {status: 200, success: true}
    }

    public static async changePassword(req: any) {
        const token = req.body.token
        const newPassword = atob(req.body.password)

        if (!token || !newPassword) { return {status: 400, success: false, message: "Missing fields"} }

        const rawUser = await database.getUserByResetToken(token)
        if (!rawUser) { return {status: 400, success: false, message: "Could not find user"} }

        const newHashedPassword = await bcrypt.hash(newPassword, 10, null)
        await database.updateUser(rawUser.id, { "password": newHashedPassword, "account.security.pass_reset_token": null })

        mail.setApiKey(`${process.env.SENDGRID_API_KEY}`)
        await mail.send({
            to: rawUser.data().email,
            from: "alerts@wulfco.xyz",
            subject: "Wulfco Password Changed",
            text: `Hello @${rawUser.data().profile.username}, \n\nYou or someone has changed your password, if this was you please ignore this email. \n\nIf this was not you please contact us at support@wulfco.xyz. \n\nThanks, \nWulfco Team`
        })

        return {status: 200, success: true}
    }
}