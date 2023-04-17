import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import id from "./apis/id/id";
import { initializeApp } from "firebase/app";
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
dotenv.config({ path: './.env' });
const app = express();

mongoose.connect(`${process.env.MONGO_URL}`).then(() => {
    console.log(">>> Connected to MongoDB");
})

const firebaseConfig = {
    apiKey: process.env.APPFIREBASE_AKEY,
    authDomain: "wulfco-id.firebaseapp.com",
    projectId: "wulfco-id",
    storageBucket: "wulfco-id.appspot.com",
    messagingSenderId: process.env.APPFIREBASE_SENDER_ID,
    appId: process.env.APPFIREBASE_APP_ID,
    measurementId: process.env.APPFIREBASE_MEASUREMENT_ID
};

// @ts-ignore
const firebaseApp = initializeApp(firebaseConfig);

const ConvertURLParams = (params: string) => {
    if (params.includes('-')) {
        const split = params.split('-')
        let newParams = split[0]
        for (let i = 1; i < split.length; i++) {
            newParams += split[i].charAt(0).toUpperCase() + split[i].slice(1)
        }

        return newParams
    } else {
        return params
    }
}

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/', async(req: any, res: any) => {
    if (req.headers['w-reason'] === "life_check") {res.sendStatus(200);return}

    if (!req.path.split('/')[1]) { res.sendStatus(400); return; }

    switch (req.path.split('/')[1]) {
        case 'id': {
            if (!req.path.split('/')[2]) { res.sendStatus(400); }

            const readableParams = ConvertURLParams(req.path.split('/')[2])

            // @ts-ignore
            if (!id[readableParams]) { res.sendStatus(404); return; }
            // @ts-ignore
            const returned = await id[readableParams](req)
            if (returned === "error") { res.sendStatus(500); return; }

            res.status(returned.status).send(returned)
            break
        }
        default: {
            res.sendStatus(404)
            break
        }
    }
})

app.listen(() => {
    console.log(`>>> App online`);
})


