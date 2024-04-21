import id from "./api/id";
import * as firebase from "firebase-functions";
import * as FirebaseHandler from "./api/modules/util/FirebaseHandler";
import dotenv from 'dotenv';
import express from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import * as database from "./api/modules/util/FirebaseHandler";
import slowDown from "express-slow-down";
import rateLimit from "express-rate-limit";
import cors from "cors";

dotenv.config({ path: './.env' });
const app = express();

app.use(express.static(__dirname + '/assets'))

const ConvertURLParams = (params: string) => {
    if (params.charAt(0) === "/") {
        params = params.slice(1)
    }

    const regex = /-[a-z]/g
    const matches = params.match(regex)
    if (matches) {
        for (const match of matches) {
            params = params.replace(match, match.charAt(1).toUpperCase())
        }
    }

    return params
}

app.use(cookieParser());

const allowedOrigins = [
    "https://authorize.roblox.com",
    "https://id.wulfco.xyz",
    "https://github.com",
    "https://reddit.com",
    "https://steampowered.com",
    "https://twitter.com",
    "https://x.com",
    "https://accounts.google.com",
    "https://twitch.tv",
    "https://discord.com",
    "https://spotify.com",
    "http://localhost:4200"
]

var corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.options('*', cors())
app.use(cors());

app.use('/', express.json(), slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // allow 100 requests per 15 minutes, then...
    delayMs: () => 500 // begin adding 500ms of delay per request above 100.
}), async(req: any, res: any, next) => {
    if (req.headers['w-reason'] === "life_check") {res.sendStatus(200);return}
    if (req.headers['w-reason'] === "heartbeat") {res.sendStatus(200);return}
    if (req.originalUrl === "/stripe") {next();return}
    if (req.originalUrl.replace(/\?.*$/, '') === "/paypal-callback") {next();return}
    // if (req.headers["origin"]) {
    //     if (!allowedOrigins.includes(req.headers["origin"])) {
    //         res.sendStatus(403);return
    //     }
    // } else {
    //     if (!allowedOrigins.includes(req.headers["referrer"])) {
    //         res.sendStatus(403);return
    //     }
    // }
    if (req.originalUrl === "/login") {next();return}
    if (req.originalUrl === "/register") {next();return}

    try {
        if (!req.path.split('/')[1]) { res.sendStatus(400); return; }

        const readableParams = ConvertURLParams(req.path.split('/')[1])

        if (!id[readableParams]) { res.sendStatus(404); return; }
        const returned = await id[readableParams](req)
        if (returned === "error") { res.sendStatus(500); return; }

        if (returned.redirect) {
            res.redirect(returned.redirect)
            return
        }

        res.status(returned.status).send(returned)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/login", express.json(), rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 60 minutes)
    standardHeaders: true,
    legacyHeaders: false,
}), async(req: any, res: any) => {
    try {
        const returned = await id.login(req)
        if (typeof returned !== "string") {
            res.status(returned.status).send(returned)
        } else {
            res.redirect(returned)
        }
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/register", express.json(), rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 24 hours)
    standardHeaders: true,
    legacyHeaders: false,
}), async(req: any, res: any) => {
    try {
        const returned = await id.create(req)
        if (typeof returned !== "string") {
            res.status(returned.status).send(returned)
        } else {
            res.redirect(returned)
        }
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/stripe", express.raw({type: 'application/json'}), async(req: any, res: any) => {
    try {
        const returned = await id.stripe(req)
        res.status(returned.status).send(returned)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.get("/paypal-callback", express.json(), async(req: any, res: any) => {
    try {
        const returned = await id.paypalCallback(req)
        if (returned.status === 300) {
            res.redirect(returned.redirect)
        } else {
            res.status(returned.status).send(returned)
        }
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.listen(3000, () => {
    console.log(`>>> App online`);
})

export const api = firebase.https.onRequest(app);

exports.sendPasswordResetLink = firebase.pubsub.schedule('every 24 hours').onRun((context) => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    try {

    } catch (e) {
        console.error(e)
    }
});