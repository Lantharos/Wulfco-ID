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
const OAuthApps_1 = __importDefault(require("../schemas/OAuthApps"));
const User_1 = __importDefault(require("./User"));
const Users_1 = __importDefault(require("../schemas/Users"));
const crypto_1 = __importDefault(require("crypto"));
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
};
class OAuth {
    static getReadableScopes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const scopes = req.body.scopes;
            if (!scopes) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const readableScopes = [];
            for (const scope of scopes) {
                const scopeSplit = scope.split(".");
                if (scopeSplit) {
                    // @ts-ignore
                    readableScopes.push(scopesText[scopeSplit[0]][scopeSplit[1]]);
                }
                else {
                    readableScopes.push("Unknown scope");
                }
            }
            return { status: 200, success: true, scopes: readableScopes };
        });
    }
    static getApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.query.id;
            if (!user_id) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const user = yield User_1.default.get(req);
            if (!user.success) {
                return user;
            }
            if (user.user === undefined) {
                return { status: 400, success: false, message: "Could not find user" };
            }
            const app_id = req.query.app;
            if (!app_id) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const result = yield OAuthApps_1.default.findOne({ id: app_id });
            if (!result) {
                return { status: 400, success: false, message: "Could not find application" };
            }
            return { status: 200, success: true, app: result, user_avatar: user.user.profile.avatar };
        });
    }
    static authorize(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield OAuth.getApplication(req);
            if (!application.success) {
                return application;
            }
            // @ts-ignore
            if ((application === null || application === void 0 ? void 0 : application.app) === undefined) {
                return { status: 400, success: false, message: "Could not find application" };
            }
            const scopes = req.body.scopes;
            if (!scopes) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const readableScopes = yield OAuth.getReadableScopes(req);
            if (!readableScopes.success) {
                return readableScopes;
            }
            const state = req.body.state;
            if (!state) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const redirect_uri = req.body.redirect_uri;
            if (!redirect_uri) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const code = crypto_1.default.randomBytes(16).toString("hex");
            const code_expires = Date.now() + 60000;
            // @ts-ignore
            if (application.app.codes) {
                // @ts-ignore
                const codes = application.app.codes;
                for (const code of codes) {
                    if (code.user === req.query.id) {
                        // @ts-ignore
                        yield OAuthApps_1.default.updateOne({ id: application.app.id }, { $pull: { codes: { code: code.code } } });
                    }
                }
            }
            // @ts-ignore
            yield OAuthApps_1.default.updateOne({ id: application.app.id }, { $push: { codes: { code, code_expires, scopes, state, redirect_uri, user: req.query.id } } });
            // @ts-ignore
            yield Users_1.default.updateOne({ id: req.query.id }, { $push: { "connections.oauth": { app_id: application.app.id, app_name: application.app.name, about_app: application.app.description, app_permissions: readableScopes.scopes } } });
            return { status: 200, success: true, redirect_uri: `${redirect_uri}?code=${code}&state=${state}` };
        });
    }
    static createApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.body.name;
            const description = req.body.description;
            const redirect_uri = req.body.redirect_uri;
            if (!name || !description || !redirect_uri) {
                return { status: 400, success: false, message: "Missing fields" };
            }
            const secret = crypto_1.default.randomBytes(32).toString("hex");
            const id = crypto_1.default.randomBytes(32).toString("hex");
            const app = yield new OAuthApps_1.default({
                name,
                description,
                redirects: [redirect_uri],
                secret,
                id
            }).save();
            return { status: 200, success: true, app };
        });
    }
    static editApplication(req) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    static deleteApplication(req) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = OAuth;
