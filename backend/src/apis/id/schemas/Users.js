"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    uuid: String,
    email: String,
    password: String,
    account: Object,
    friends: Object,
    billing: Object,
    profile: Object,
    connections: Object
}, { timestamps: true });
exports.default = mongoose_1.default.model('users', schema);
