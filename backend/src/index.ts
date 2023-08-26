import id from "./api/id";
import * as firebase from "firebase-functions";
import * as FirebaseHandler from "./api/FirebaseHandler";
import dotenv from 'dotenv';
import express from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import * as database from "./api/FirebaseHandler";
import mail from "@sendgrid/mail";
import slowDown from "express-slow-down";
import rateLimit from "express-rate-limit";

dotenv.config({ path: './.env' });
const cors = require("cors")
const app = express();

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

app.use(cors());
app.use(cookieParser());

app.use('/', express.json(), slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // allow 100 requests per 15 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100.
}), async(req: any, res: any, next) => {
    if (req.headers['w-reason'] === "life_check") {res.sendStatus(200);return}
    if (req.headers['w-reason'] === "heartbeat") {res.sendStatus(200);return}
    if (req.originalUrl === "/stripe") {next();return}
    if (req.headers["origin"] !== "https://id.wulfco.xyz") {res.sendStatus(403);return}
    if (req.originalUrl === "/login") {next();return}
    if (req.originalUrl === "/create") {next();return}

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
    max: 5, // Limit each IP to 5 requests per `window` (here, per 60 minutes)
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

app.post("/create", express.json(), rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 5, // Limit each IP to 5 requests per `window` (here, per 24 hours)
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

app.listen(() => {
    console.log(`>>> App online`);
})

export const api = firebase.https.onRequest(app);

exports.sendPasswordResetLink = firebase.pubsub.schedule('every 24 hours').onRun((context) => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    FirebaseHandler.getAllResetRequests(sevenDaysAgo).then(async (requests: any) => {
        if (requests) {
            for (const request of requests) {
                const user = await FirebaseHandler.getUser(request.data().user_id)
                if (user) {
                    const token = crypto.randomBytes(20).toString("hex")
                    const link = `https://id.wulfco.xyz/change-password?token=${token}`

                    await database.updateUser(request.data().user_id, { "account.security.pass_reset_token": {token: token, created: Date.now()} })

                    mail.setApiKey(`${process.env.SENDGRID_API_KEY}`)

                    await mail.send({
                        to: user.data().email,
                        from: "no-reply@wulfco.xyz",
                        subject: "Password reset",
                        text: `Hello ${user.data().profile.username},\n\nYou recently requested a password reset. If this was you, please click the link below to reset your password.\n\n${link}\n\nIf this wasn't you, please ignore this email.\n\nThanks,\nWulfco`
                    })
                }
            }
        }
    })
});