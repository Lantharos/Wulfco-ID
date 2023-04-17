import OAuthApps from "../schemas/OAuthApps";
import User from "./User";
import Users from "../schemas/Users";
import crypto from "crypto";

const scopesText = {
    "user": {
        "read_basic": "Access your username and avatar",
        "email": "Access your email address",
        "connections": "Access your third-party connections",
        "friends": "Access your friends list"
    },
    "storage": {
        "full": "Use cloud storage"
    },
    "oauth": {
        "read": "Access your OAuth applications",
        "write": "Create, edit and delete your OAuth applications",
        "read_connections": "Access your OAuth connections"
    }
}

export default class OAuth {
    public static async getReadableScopes(req: any) {
        const scopes = req.body.scopes
        if (!scopes) { return {status: 400, success: false, message: "Missing fields"} }

        const readableScopes = []
        for (const scope of scopes) {
            const scopeSplit : string = scope.split(".")
            if (scopeSplit) {
                // @ts-ignore
                readableScopes.push(scopesText[scopeSplit[0]][scopeSplit[1]])
            } else {
                readableScopes.push("Unknown scope")
            }
        }

        return {status: 200, success: true, scopes: readableScopes}
    }

    public static async getApplication(req: any) {
        const user_id = req.query.id
        if (!user_id) { return {status: 400, success: false, message: "Missing fields"} }
        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const app_id = req.query.app
        if (!app_id) { return {status: 400, success: false, message: "Missing fields"} }

        const result = await OAuthApps.findOne({id: app_id})
        if (!result) { return {status: 400, success: false, message: "Could not find application"} }

        return {status: 200, success: true, app: result, user_avatar: user.user.profile.avatar}
    }

    public static async authorize(req: any) {
        const application = await OAuth.getApplication(req)
        if (!application.success) { return application }
        // @ts-ignore
        if (application?.app === undefined) { return {status: 400, success: false, message: "Could not find application"} }

        const scopes = req.body.scopes
        if (!scopes) { return {status: 400, success: false, message: "Missing fields"} }
        const readableScopes = await OAuth.getReadableScopes(req)
        if (!readableScopes.success) { return readableScopes }

        const state = req.body.state
        if (!state) { return {status: 400, success: false, message: "Missing fields"} }

        const redirect_uri = req.body.redirect_uri
        if (!redirect_uri) { return {status: 400, success: false, message: "Missing fields"} }

        const code = crypto.randomBytes(16).toString("hex")
        const code_expires = Date.now() + 60000

        // @ts-ignore
        if (application.app.codes) {
            // @ts-ignore
            const codes = application.app.codes
            for (const code of codes) {
                if (code.user === req.query.id) {
                    // @ts-ignore
                    await OAuthApps.updateOne({id: application.app.id}, {$pull: {codes: {code: code.code}}})
                }
            }
        }

        // @ts-ignore
        await OAuthApps.updateOne({id: application.app.id}, {$push: {codes: {code, code_expires, scopes, state, redirect_uri, user: req.query.id }}})
        // @ts-ignore
        await Users.updateOne({id: req.query.id}, {$push: {"connections.oauth": {app_id: application.app.id, app_name: application.app.name, about_app: application.app.description, app_permissions: readableScopes.scopes}}})

        return {status: 200, success: true, redirect_uri: `${redirect_uri}?code=${code}&state=${state}`}
    }

    public static async createApplication(req: any) {
        const name = req.body.name
        const description = req.body.description
        const redirect_uri = req.body.redirect_uri
        if (!name || !description || !redirect_uri) { return {status: 400, success: false, message: "Missing fields"} }

        const secret = crypto.randomBytes(32).toString("hex")
        const id = crypto.randomBytes(32).toString("hex")

        const app = await new OAuthApps({
            name,
            description,
            redirects: [redirect_uri],
            secret,
            id
        }).save()

        return {status: 200, success: true, app}
    }

    public static async editApplication(req: any) {}
    public static async deleteApplication(req: any) {}
}