import Auth from "./modules/Auth";
import User from "./modules/User";
import Security from "./modules/Security";
import OAuth from "./modules/OAuth";

export default class ID {
    // Auth module
    public static async login(req: any) { return await Auth.login(req) }
    public static qrLogin() { return Auth.qrLogin() }
    public static async logout(req: any) { return await Auth.logout(req) }
    public static async create(req: any) { return await Auth.create(req) }

    // User module
    public static async get(req: any) { return await User.get(req) }
    public static async verifyPassword(req: any) { return await User.checkPassword(req) }
    public static async profile(req: any) { return await User.profile(req) }
    public static async account(req: any) { return await User.account(req) }
    public static async preferences(req: any) { return await User.preferences(req) }

    // Security module
    public static async securityKey(req: any) { if (req.method === "POST") { return await Security.registerSecurityKey(req) } else if (req.method === "DELETE") { return await Security.removeSecurityKey(req) } else { return { status: 400, success: false, message: "Invalid method"}} }

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
}