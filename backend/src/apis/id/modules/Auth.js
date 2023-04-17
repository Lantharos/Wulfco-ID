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
const bcrypt = require("bcrypt");
class Auth {
    static login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method !== "POST") {
                return "error";
            }
            const isCrypto = req.headers['W-Crypto'] === "true";
            if (isCrypto) {
                return {
                    status: 501,
                    success: false,
                    message: "Crypto login is not implemented yet"
                };
            }
            else {
                const email = atob(req.body.email);
                const password = atob(req.body.password);
                if (!email || !password) {
                    return { status: 400, success: false, error: "Missing email or password" };
                }
                const user = yield Users_1.default.findOne({ email });
                if (!user) {
                    return { status: 404, success: false, error: "User not found" };
                }
                if ((yield bcrypt.compare(password, user.password, null)) === false) {
                    return { status: 401, success: false, error: "Invalid password" };
                }
                const requesterIp = req.body.ip;
                const location = yield fetch(`http://ip-api.com/json/${requesterIp}`);
                const session = {
                    session_id: crypto_1.default.randomBytes(16).toString("hex"),
                    secret: crypto_1.default.randomBytes(16).toString("hex"),
                    token: crypto_1.default.randomBytes(16).toString("hex"),
                    loggen: crypto_1.default.randomBytes(8).toString("hex"),
                    created: Date.now(),
                    ip: requesterIp,
                    location: yield location.json(),
                    device: req.headers['user-agent']
                };
                const existingSession = user.account.sessions.find((session) => session.ip === requesterIp);
                if (existingSession) {
                    user.account.sessions.splice(user.account.sessions.indexOf(existingSession), 1);
                }
                const expiredSessions = user.account.sessions.filter((session) => Date.now() - session.created > 1000 * 60 * 60 * 24);
                expiredSessions.forEach((session) => {
                    user.account.sessions.splice(user.account.sessions.indexOf(session), 1);
                });
                user.account.sessions.push(session);
                user.account.last_login = Date.now();
                yield Users_1.default.updateOne({ uuid: user.uuid }, user);
                return {
                    status: 200,
                    success: true,
                    session,
                    uuid: user.uuid
                };
            }
        });
    }
    static qrLogin() {
        return { qr: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Hello%20World" };
    }
    static logout(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const session_id = req.body.session;
            const loggen = req.body.loggen;
            const uuid = req.body.uuid;
            if (!session_id || !loggen || !uuid) {
                return { status: 400, success: false, error: "Missing session or loggen" };
            }
            const user = yield Users_1.default.findOne({ uuid });
            if (!user) {
                return { status: 404, success: false, error: "User not found" };
            }
            if (user.account.sessions.length === 0) {
                return { status: 404, success: false, error: "User not logged in" };
            }
            const session = user.account.sessions.find((session) => session.session_id === session_id);
            if (!session) {
                return { status: 404, success: false, error: "Session not found" };
            }
            if (session.loggen !== loggen) {
                return { status: 401, success: false, error: "Invalid loggen" };
            }
            user.account.sessions.splice(user.account.sessions.indexOf(session), 1);
            yield Users_1.default.updateOne({ uuid: user.uuid }, user);
            return { status: 200, success: true };
        });
    }
    static create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = {
                session_id: crypto_1.default.randomBytes(16).toString("hex"),
                secret: crypto_1.default.randomBytes(16).toString("hex"),
                token: crypto_1.default.randomBytes(16).toString("hex"),
                loggen: crypto_1.default.randomBytes(8).toString("hex"),
                created: Date.now(),
                ip: req.ip,
                device: req.headers['user-agent'],
            };
            const uuid = crypto_1.default.randomUUID();
            const discriminator = Math.floor(Math.random() * 9999);
            yield new Users_1.default({
                uuid,
                email: req.body.email,
                password: yield bcrypt.hash(req.body.password, 10, null),
                account: {
                    created: Date.now(),
                    last_login: Date.now(),
                    sessions: [session],
                    analytics: {
                        share_storage_data: true,
                        share_analytics: true
                    }
                },
                friends: {},
                billing: {},
                profile: {
                    username: req.body.username,
                    discriminator: discriminator,
                    full_name: req.body.name,
                    gender: req.body.gender,
                    avatar: `https://api.dicebear.com/5.x/identicon/svg?seed=${req.body.name.split(" ")[0]}`
                },
                connections: {}
            }).save();
            return { status: 200, success: true, session, uuid };
        });
    }
}
exports.default = Auth;
