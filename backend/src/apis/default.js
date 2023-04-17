"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csrf_1 = __importDefault(require("csrf"));
const csrf = new csrf_1.default();
class DefaultHandler {
    static generateCSRFToken() {
        const secret = csrf.secretSync();
        return csrf.create(secret);
    }
}
exports.default = DefaultHandler;
