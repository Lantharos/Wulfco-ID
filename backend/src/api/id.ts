import Auth from "./modules/Auth";
import User from "./modules/User";
import Security from "./modules/Security";
import OAuth from "./modules/OAuth";
import Connections from "./modules/Connections";
import Friends from "./modules/Friends";
import Payments from "./modules/Payments";

export default class ID {
    // Auth module
    public static async login(req: any) { return await Auth.login(req) }
    public static qrLogin() { return Auth.qrLogin() }
    public static async logout(req: any) { return await Auth.logout(req) }
    public static async logoutAll(req: any) { return await Auth.logoutAll(req) }
    public static async create(req: any) { return await Auth.create(req) }
    public static async verifyRegistration(req: any) { return await Auth.verifyEmail(req) }

    // User module
    public static async get(req: any) {
        const resp = await User.get(req)
        if (resp.success) {return {status: 200, success: true, user: resp.user}} else {return resp}
    }
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
    public static async emailAuth(req: any) {
        if (req.method == "POST") {
            return await Security.enableEmailAuth(req)
        } else if (req.method == "DELETE") {
            return await Security.disableEmailAuth(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }
    public static async totp(req: any) {
        if (req.method === 'GET') {
            return await Security.getTOTP(req)
        } else if (req.method === 'POST') {
            return await Security.enableTOTP(req)
        } else if (req.method === 'DELETE') {
            return await Security.disableTOTP(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
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

        if (reason === "get") {
            return await Connections.getLinkingURL(req)
        } else if (reason === "callback") {
            const resp = await Connections.callback(req)
            if (resp.status == 200) {
                return { status: 200, success: true, redirect: "https://id.wulfco.xyz/login" }
            } else {
                return resp
            }
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }

    // Friends module
    public static async friends(req: any) {
        if (req.method === "POST") {
            return await Friends.addFriend(req)
        } else if (req.method === "DELETE") {
            return await Friends.removeFriend(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }
    public static async friendRequests(req: any) {
        if (req.method === "POST") {
            return await Friends.acceptFriend(req)
        } else if (req.method === "DELETE") {
            return await Friends.declineFriend(req)
        } else if (req.method === "PATCH") {
            return await Friends.cancelRequest(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }
    public static async block(req: any) {
        if (req.method === "POST") {
            return await Friends.block(req)
        } else if (req.method === "DELETE") {
            return await Friends.unblock(req)
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }

    // Payments module
    public static async paymentMethods(req: any) {
        if (req.method === "POST") {
            if (req.query.type === "stripe") {
                return await Payments.addCard(req)
            } else {
                return {status: 400, success: false, message: "Invalid type"}
            }
        } else if (req.method === "PATCH") {
            // todo: update card
            return {status: 400, success: false, message: "Invalid method"}
        } else if (req.method === "DELETE") {
            // todo: delete card
            return {status: 400, success: false, message: "Invalid method"}
        } else {
            return {status: 400, success: false, message: "Invalid method"}
        }
    }
    public static async verifyIdentity(req: any) { return await Payments.verifyIdentity(req) }
    public static async stripe(req: any) { return await Payments.stripeEvents(req) }
}