import Auth from "./modules/Auth";
import User from "./modules/User";
import Security from "./modules/Security";
import OAuth from "./modules/OAuth";
import Connections from "./modules/Connections";

export default class ID {
    // Auth module
    public static async login(req: any) { return await Auth.login(req) }
    public static qrLogin() { return Auth.qrLogin() }
    public static async logout(req: any) { return await Auth.logout(req) }
    public static async logoutAll(req: any) { return await Auth.logoutAll(req) }
    public static async create(req: any) { return await Auth.create(req) }

    // User module
    public static async get(req: any) { return await User.get(req) }
    public static async verifyPassword(req: any) { return await User.checkPassword(req) }
    public static async profile(req: any) { return await User.profile(req) }
    public static async account(req: any) { return await User.account(req) }
    public static async preferences(req: any) { return await User.preferences(req) }
    public static async avatar(req: any) {
        if (req.method == "POST") {
            return await User.updateAvatar(req)
        } else if (req.method == "DELETE") {
            return await User.resetAvatar(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }

    // Security module
    public static async securityKey(req: any) {
        if (req.method === "POST") {
            return await Security.registerSecurityKey(req)
        } else if (req.method === "DELETE") {
            return await Security.removeSecurityKey(req)
        } else {
            return { status: 400, success: false, message: "Invalid method"}
        }
    }
    public static async password(req: any) {
        if (req.method == "POST") {
            return await Security.resetPassword(req)
        } else if (req.method == "PATCH") {
            return await Security.changePassword(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }
    public static async email(req: any) {
        if (req.query.stage == 1) {
            return await Security.sendEmailVerification(req)
        } else if (req.query.stage == 2) {
            return await Security.verifyEmail(req)
        } else if (req.query.stage == 3) {
            return await Security.changeEmail(req)
        } else {
            return {status: 400, success: false, message: "Invalid stage"}
        }
    }

    // OAuth module
    public static async scopes(req: any) { return await OAuth.getReadableScopes(req) }
    public static async authorize(req: any) { return await OAuth.authorize(req) }
    public static async oauth(req: any) {
        if (req.method === "GET") {
            return await OAuth.getApplication(req)
        } else if (req.method === "POST") {
            return await OAuth.createApplication(req)
        } else if (req.method === "DELETE") {
            return await OAuth.deleteApplication(req)
        } else if (req.method == "PATCH") {
            return await OAuth.editApplication(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }

    // Connections module
    public static async connections(req: any) {
        const reason = req.query.function

        if (reason == "get") {
            return await Connections.getLinkingURL(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }
}