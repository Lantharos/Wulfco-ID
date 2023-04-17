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
const Auth_1 = __importDefault(require("./modules/Auth"));
const User_1 = __importDefault(require("./modules/User"));
const Security_1 = __importDefault(require("./modules/Security"));
const OAuth_1 = __importDefault(require("./modules/OAuth"));
class ID {
    // Auth module
    static login(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield Auth_1.default.login(req); });
    }
    static qrLogin() { return Auth_1.default.qrLogin(); }
    static logout(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield Auth_1.default.logout(req); });
    }
    static create(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield Auth_1.default.create(req); });
    }
    // User module
    static get(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield User_1.default.get(req); });
    }
    static verifyPassword(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield User_1.default.checkPassword(req); });
    }
    static profile(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield User_1.default.profile(req); });
    }
    static account(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield User_1.default.account(req); });
    }
    static preferences(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield User_1.default.preferences(req); });
    }
    // Security module
    static securityKey(req) {
        return __awaiter(this, void 0, void 0, function* () { if (req.method === "POST") {
            return yield Security_1.default.registerSecurityKey(req);
        }
        else if (req.method === "DELETE") {
            return yield Security_1.default.removeSecurityKey(req);
        }
        else {
            return { status: 400, success: false, message: "Invalid method" };
        } });
    }
    // OAuth module
    static scopes(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield OAuth_1.default.getReadableScopes(req); });
    }
    static authorize(req) {
        return __awaiter(this, void 0, void 0, function* () { return yield OAuth_1.default.authorize(req); });
    }
    static oauth(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method === "GET") {
                return yield OAuth_1.default.getApplication(req);
            }
            else if (req.method === "POST") {
                return yield OAuth_1.default.createApplication(req);
            }
            else if (req.method === "DELETE") {
                return yield OAuth_1.default.deleteApplication(req);
            }
            else if (req.method == "PATCH") {
                return yield OAuth_1.default.editApplication(req);
            }
            else {
                return { status: 400, success: false, message: "Invalid method" };
            }
        });
    }
}
exports.default = ID;
