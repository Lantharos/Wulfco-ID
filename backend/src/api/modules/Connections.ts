import User from "./User";
import * as database from "../FirebaseHandler"
import crypto from "crypto"
import SteamAuth from "node-steam-openid"
import OAuth from "oauth-1.0a"

export default class Connections {
    public static async getLinkingURL(req: any) {
        const service = req.query.service
        const result = await User.get(req)
        if (!result.success) { return result }
        const token = crypto.randomBytes(6).toString("hex")

        if (service === "github") {
            await database.updateUser(result.rawUser.id, {"connections.github": {pending: true, token}})

            return {
                status: 200,
                success: true,
                url: `https://github.com/login/oauth/authorize?scope=user:email&client_id=29cf7d66efaf02490073&state=${result.rawUser.id}.${token}&redirect_uri=${encodeURIComponent("https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=github")}`
            }
        } else if (service === "reddit") {
            await database.updateUser(result.rawUser.id, {"connections.reddit": {pending: true, token}})

            return {
                status: 200,
                success: true,
                url: `https://www.reddit.com/api/v1/authorize?client_id=eJcpyXFPMGbeCbFbhEFg0g&response_type=code&state=${result.rawUser.id}.${token}&redirect_uri=${encodeURIComponent("https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=reddit")}&duration=permanent&scope=identity`
            }
        } else if (service === "steam") {
            await database.updateUser(result.rawUser.id, {"connections.steam": {pending: true, token}})
            const steam = new SteamAuth({
                realm: "https://us-central1-wulfco-id.cloudfunctions.net",
                returnUrl: `https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=steam&state=${encodeURIComponent(result.rawUser.id + "." + token)}`,
                apiKey: process.env.STEAM_API_KEY
            })

            return {
                status: 200,
                success: true,
                url: await steam.getRedirectUrl()
            }
        } else if (service === "twitter") {
            await database.updateUser(result.rawUser.id, {"connections.twitter": {pending: true, token}})

            const oauth = new OAuth({
                consumer: {
                    key: process.env.TWITTER_CONSUMER_KEY,
                    secret: process.env.TWITTER_API_SECRET
                },
                signature_method: "HMAC-SHA1",
                hash_function: (baseString, key) => {
                    return crypto
                        .createHmac('sha1', key)
                        .update(baseString)
                        .digest('base64')
                }
            })

            const request_data = {
                url: "https://api.twitter.com/oauth/request_token?oauth_callback=" + encodeURIComponent("https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=twitter&user=" + result.rawUser.id + "." + token),
                method: "POST"
            }

            const response = await fetch(request_data.url, {
                method: request_data.method,
                headers: {
                    "Authorization": oauth.toHeader(oauth.authorize(request_data))["Authorization"]
                }
            }).then(res => res.text()).then(res => {
                if (res.startsWith("oauth_token=")) {
                    const oauthToken = res.split("&")[0].split("=")[1]
                    const oauthTokenSecret = res.split("&")[1].split("=")[1]

                    return {
                        success: true,
                        oauthToken,
                        oauthTokenSecret
                    }
                } else {
                    return {success: false, response: res}
                }
            })

            if (!response.success) {
                return {status: 500, success: false, message: "Failed to get request token", info: response.response}
            }

            return {
                status: 200,
                success: true,
                url: `https://api.twitter.com/oauth/authorize?oauth_token=${response.oauthToken}`
            }
        } else if (service === "youtube") {
            await database.updateUser(result.rawUser.id, {"connections.youtube": {pending: true, token}})

            return {
                status: 200,
                success: true,
                url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=775008964746-48oerujtollovas4tjhvo4328g9fu0du.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(`https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=youtube`)}&state=${result.rawUser.id + "." + token}&response_type=code&scope=profile+email+openid+https://www.googleapis.com/auth/youtube.readonly&prompt=consent&include_granted_scopes=true`
            }
        } else if (service === "twitch") {
            await database.updateUser(result.rawUser.id, {"connections.twitch": {pending: true, token}})

            return {
                status: 200,
                success: true,
                url: `https://id.twitch.tv/oauth2/authorize?client_id=vepu7tejuuiz1oglbmv8yrpco4hz0k&redirect_uri=${encodeURIComponent(`https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=twitch`)}&response_type=code&scope=openid&state=${result.rawUser.id + "." + token}`
            }
        } else if (service === "discord") {
            await database.updateUser(result.rawUser.id, {"connections.discord": {pending: true, token}})

            return {
                status: 200,
                success: true,
                url: `https://discord.com/api/oauth2/authorize?client_id=975161504703840258&redirect_uri=https%3A%2F%2Fus-central1-wulfco-id.cloudfunctions.net%2Fapi%2Fconnections%3Ffunction%3Dcallback%26service%3Ddiscord&response_type=code&scope=identify&state=${result.rawUser.id + "." + token}`
            }
        } else if (service === "spotify") {
            await database.updateUser(result.rawUser.id, {"connections.spotify": {pending: true, token}})

            return {
                status: 200,
                success: true,
                url: `https://accounts.spotify.com/authorize?client_id=3f67a21b4d7c4cbaa969ca88a400d579&response_type=code&redirect_uri=${encodeURIComponent(`https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=spotify`)}&state=${result.rawUser.id + "." + token}`
            }
        } else {
            return {status: 400, success: false, message: "Invalid service"}
        }
    }
}