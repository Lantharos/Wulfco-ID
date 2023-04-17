"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../schemas/Users"));
const crypto_1 = __importDefault(require("crypto"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const bcrypt = require("bcrypt");
class User {
    static get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const session_id = req.headers['w-session'];
            const signedToken = req.headers['w-auth'];
            const loggen = req.headers['w-loggen'];
            const user_id = req.query.id;
            if (!session_id || !signedToken || !loggen || !user_id) {
                return { status: 400, success: false, message: "Missing headers" };
            }
            const user = yield Users_1.default.findOne({ uuid: user_id });
            if (!user) {
                return { status: 400, success: false, message: "Could not find user" };
            }
            const session = user.account.sessions.find((session) => session.session_id === session_id);
            if (!session) {
                return { status: 400, success: false, message: "Could not find session!" };
            }
            if (session.loggen !== loggen) {
                return { status: 401, success: false, message: "Invalid loggen" };
            }
            const obtainedSignedToken = crypto_1.default.createHmac("sha256", session.secret).update(session.token).digest("hex");
            if (obtainedSignedToken !== signedToken) {
                return { status: 401, success: false, message: "Invalid token" };
            }
            const requesterIp = req.headers['w-ip'];
            const location = yield fetch(`http://ip-api.com/json/${requesterIp}`);
            const locationData = yield location.json();
            if (req.headers['w-reason'] === 'get-user-data') {
                if (locationData.region !== session.location.region) {
                    mail_1.default.setApiKey(`${process.env.SENDGRID_API_KEY}`);
                    yield mail_1.default.send({
                        to: user.email,
                        from: "alerts@wulfco.xyz",
                        subject: 'Suspicious activity detected on your account',
                        text: `Hello @${user.profile.username},\n\nSomeone has tried to access your account from an unusual location or device. If this wasn\'t you, please log in to your account and change your password immediately. If you need further help don\'t hesitate to contact us!\n\nBest regards,\nYour Wulfco team`
                    });
                    return { status: 400, success: false, message: "Invalid location" };
                }
            }
            return { status: 200, success: true, user };
        });
    }
    static checkPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.body.password;
            if (!password) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const result = yield User.get(req);
            if (!result.success) {
                return result;
            }
            const user = result.user;
            if (!user) {
                return { status: 400, success: false, message: "Could not find user" };
            }
            if ((yield bcrypt.compare(password, user.password, null)) === true) {
                return { status: 200, success: true };
            }
            else {
                return { status: 400, success: false, message: "Invalid password" };
            }
        });
    }
    static account(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const newEmail = req.body["email"];
            const newUsername = req.body["username"];
            if (!newEmail || !newUsername) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const result = yield User.get(req);
            if (!result.success) {
                return result;
            }
            const user = result.user;
            if (!user) {
                return { status: 400, success: false, message: "Could not find user" };
            }
            if (user.email === newEmail && user.profile.username === newUsername && !req.body["birthday"]) {
                return { status: 400, success: false, message: "No changes were made" };
            }
            if (req.body["birthday"]) {
                const birthday = Date.parse(req.body["birthday"]);
                yield Users_1.default.updateOne({ uuid: user.uuid }, { "account.birthday": birthday });
            }
            else {
                if (user.email === newEmail) {
                    const discriminator = Math.floor(Math.random() * 9999);
                    yield Users_1.default.updateOne({ uuid: user.uuid }, { "profile.username": newUsername, "profile.discriminator": discriminator });
                }
                else {
                    yield Users_1.default.updateOne({ uuid: user.uuid }, { email: newEmail, "profile.username": newUsername });
                }
            }
            return { status: 200, success: true };
        });
    }
    static preferences(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const share_analytics = req.body["share_analytics"];
            const share_storage_data = req.body["share_storage_data"];
            const result = yield User.get(req);
            if (!result.success) {
                return result;
            }
            const user = result.user;
            if (!user) {
                return { status: 400, success: false, message: "Could not find user" };
            }
            if (share_analytics !== undefined) {
                yield Users_1.default.updateOne({ uuid: user.uuid }, { "account.analytics.share_analytics": share_analytics });
                return { status: 200, success: true };
            }
            else if (share_storage_data !== undefined) {
                yield Users_1.default.updateOne({ uuid: user.uuid }, { "account.analytics.share_storage_data": share_storage_data });
                return { status: 200, success: true };
            }
            else {
                return { status: 400, success: false, message: "Missing fields" };
            }
        });
    }
    static profile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAboutMe = req.body["about_me"];
            const newProfileColor = req.body["profile_color"];
            const newPronouns = req.body["pronouns"];
            if (!newAboutMe || !newProfileColor || !newPronouns) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const result = yield User.get(req);
            if (!result.success) {
                return result;
            }
            const user = result.user;
            if (!user) {
                return { status: 400, success: false, message: "Could not find user" };
            }
            yield Users_1.default.updateOne({ uuid: user.uuid }, {
                "profile.about_me": newAboutMe,
                "profile.profile_color": newProfileColor,
                "profile.pronouns": newPronouns
            });
            return { status: 200, success: true };
        });
    }
}
exports.default = User;
