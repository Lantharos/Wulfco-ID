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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const id_1 = __importDefault(require("./apis/id/id"));
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv_1.default.config({ path: './.env' });
const app = express();
const port = 5000;
mongoose_1.default.connect(`${process.env.MONGO_URL}`).then(() => {
    console.log(">>> Connected to MongoDB");
});
const firebaseConfig = {
    apiKey: "AIzaSyDEqlbBEH1hcxaBwouloI8xsmReiXwTfcY",
    authDomain: "wulfco-id.firebaseapp.com",
    projectId: "wulfco-id",
    storageBucket: "wulfco-id.appspot.com",
    messagingSenderId: "775008964746",
    appId: "1:775008964746:web:4582f5baa8ef285f63dd73",
    measurementId: "G-PRL4CSHQZC"
};
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
const analytics = (0, analytics_1.getAnalytics)(firebaseApp);
const ConvertURLParams = (params) => {
    if (params.includes('-')) {
        const split = params.split('-');
        let newParams = split[0];
        for (let i = 1; i < split.length; i++) {
            newParams += split[i].charAt(0).toUpperCase() + split[i].slice(1);
        }
        return newParams;
    }
    else {
        return params;
    }
};
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers['w-reason'] === "life_check") {
        res.sendStatus(200);
        return;
    }
    if (!req.path.split('/')[1]) {
        res.sendStatus(400);
        return;
    }
    switch (req.path.split('/')[1]) {
        case 'id': {
            if (!req.path.split('/')[2]) {
                res.sendStatus(400);
            }
            const readableParams = ConvertURLParams(req.path.split('/')[2]);
            // @ts-ignore
            if (!id_1.default[readableParams]) {
                res.sendStatus(404);
                return;
            }
            // @ts-ignore
            const returned = yield id_1.default[readableParams](req);
            if (returned === "error") {
                res.sendStatus(500);
                return;
            }
            res.status(returned.status).send(returned);
            break;
        }
        default: {
            res.sendStatus(404);
            break;
        }
    }
}));
app.listen(port, () => {
    console.log(`>>> App listening at http://localhost:${port}`);
});
