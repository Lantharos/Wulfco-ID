import User from "./User";
import crypto from "crypto";
import * as database from "../FirebaseHandler";

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

        const rawResult = await database.getOAuthApp(app_id)
        console.log("rawResult is: " + rawResult)
        if (!rawResult) { return {status: 404, success: false, message: "Could not find application"} }

        const result = rawResult.data()
        console.log("result is: " + result)
        if (!result) { return {status: 404, success: false, message: "Could not find application"} }

        return {status: 200, success: true, app: result, user_avatar: user.user.profile.avatar, rawApp: rawResult}
    }

    public static async authorize(req: any) {
        const application = await OAuth.getApplication(req)
        if (!application.success) { return application }
        // @ts-ignore
        if (!application.rawApp) { return {status: 400, success: false, message: "Could not find application"} }
        // @ts-ignore
        const app = application.rawApp.data()
        if (!app) { return {status: 400, success: false, message: "Could not find application"} }

        const scopes = req.body.scopes
        if (!scopes) { return {status: 400, success: false, message: "Missing fields"} }
        const readableScopes = await OAuth.getReadableScopes(req)
        if (!readableScopes.success) { return readableScopes }

        const state = req.body.state
        if (!state) { return {status: 400, success: false, message: "Missing fields"} }

        const redirect_uri = req.body.redirect_uri
        if (!redirect_uri) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const code = crypto.randomBytes(16).toString("hex")
        const code_expires = Date.now() + 60000

        if (app.codes) {
            const codes = app.codes
            for (const code of codes) {
                if (code.user === req.query.id) {
                    await database.updateOAuthApp(app.id, { codes: app.codes.pull({ code: code.code }) })
                }
            }

            await database.updateOAuthApp(app.id, { codes: [{ code, code_expires, scopes, state, redirect_uri, user: req.query.id }] })
        } else {
            await database.updateOAuthApp(app.id, { codes: [{ code, code_expires, scopes, state, redirect_uri, user: req.query.id }] })
            if (user.user.connections.oauth) {
                await database.updateUser(req.query.id, { "connections.oauth": user.user.connections.oauth.push({app_id: app.id, app_name: app.name, about_app: app.description, app_permissions: readableScopes.scopes}) })

            } else {
                await database.updateUser(req.query.id, { "connections.oauth": [{app_id: app.id, app_name: app.name, about_app: app.description, app_permissions: readableScopes.scopes}] })
            }
        }

        return {status: 200, success: true, redirect_uri: `${redirect_uri}?code=${code}&state=${state}`}
    }

    public static async createApplication(req: any) {
        const name = req.body.name
        const description = req.body.description
        const redirect_uri = req.body.redirect_uri
        if (!name || !description || !redirect_uri) { return {status: 400, success: false, message: "Missing fields"} }

        const secret = crypto.randomBytes(32).toString("hex")
        const id = crypto.randomBytes(32).toString("hex")

        const app = database.createOAuthApp({ name, description, redirects: [redirect_uri], secret, id })
        return {status: 200, success: true, app}
    }

    public static async editApplication(req: any) {}
    public static async deleteApplication(req: any) {}
}