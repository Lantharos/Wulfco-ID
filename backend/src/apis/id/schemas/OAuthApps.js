"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    id: String,
    description: String,
    avatar: Buffer,
    name: String,
    secret: String,
    redirects: Array,
    grants: Array,
    tokens: Array,
    codes: Array
}, { timestamps: true });
exports.default = mongoose_1.default.model('oauth', schema);
