import User from "./User";
import * as database from "../FirebaseHandler";

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
}