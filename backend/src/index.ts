import id from "./api/id";
import * as firebase from "firebase-functions";
import dotenv from 'dotenv';
import express from "express";
import cookieParser from "cookie-parser";
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

app.use('/', express.json(), async(req: any, res: any) => {
    if (req.headers['w-reason'] === "life_check") {res.sendStatus(200);return}

    try {
        if (!req.path.split('/')[1]) { res.sendStatus(400); return; }

        const readableParams = ConvertURLParams(req.path.split('/')[1])

        // @ts-ignore
        if (!id[readableParams]) { res.sendStatus(404); return; }
        // @ts-ignore
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

app.listen(() => {
    console.log(`>>> App online`);
})

export const api = firebase.https.onRequest(app);