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
const User_1 = __importDefault(require("./User"));
const Users_1 = __importDefault(require("../schemas/Users"));
class Security {
    static registerSecurityKey(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Buffer.from(req.body.id, "base64").toString("hex");
            const rawId = Buffer.from(req.body.rawId, "base64").toString("hex");
            const attestationObject = Buffer.from(req.body.response.attestationObject, "base64").toString("hex");
            const clientDataJSON = Buffer.from(req.body.response.clientDataJSON, "base64").toString("hex");
            if (!id || !rawId || !attestationObject || !clientDataJSON) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const result = yield User_1.default.get(req);
            if (!result.success) {
                return result;
            }
            if (!result.user) {
                return { status: 400, success: false, message: "Could not find user" };
            }
            const credential = { id, rawId, response: { attestationObject, clientDataJSON }, type: req.body.type, name: req.body.name };
            const currentUser = result.user;
            if (currentUser.account.security.security_keys) {
                yield Users_1.default.updateOne({ uuid: result.user.uuid }, { $push: { "account.security.security_keys": credential }, "account.security.protected": true });
            }
            else {
                yield Users_1.default.updateOne({ uuid: result.user.uuid }, { "account.security.security_keys": [credential], "account.security.protected": true });
            }
            return { status: 200, success: true };
        });
    }
    static removeSecurityKey(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const number = req.query.key;
            if (!number) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const result = yield User_1.default.get(req);
            if (!result.success) {
                return result;
            }
            if (!result.user) {
                return { status: 400, success: false, message: "Could not find user" };
            }
            const currentUser = result.user;
            if (currentUser.account.security.security_keys && currentUser.account.security.security_keys[number]) {
                yield Users_1.default.updateOne({ uuid: result.user.uuid }, { $pull: { "account.security.security_keys": currentUser.account.security.security_keys[number] }, "account.security.protected": false });
                return { status: 200, success: true };
            }
            else {
                return { status: 400, success: false, message: "Could not find key" };
            }
        });
    }
}
exports.default = Security;
