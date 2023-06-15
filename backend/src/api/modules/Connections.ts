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
        } else if (service === "roblox") {
            await database.updateUser(result.rawUser.id, {"connections.roblox": {pending: true, token}})

            return {
                status: 200,
                success: true,
                url: `https://authorize.roblox.com/?client_id=1207216280771106226&redirect_uri=${encodeURIComponent(`https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=roblox`)}&scope=openid profile&response_type=code&state=${result.rawUser.id + "." + token}`
            }
        } else {
            return {status: 400, success: false, message: "Invalid service"}
        }
    }

    public static async callback(req: any) {
        const service = req.query.service
        const code = req.query.code
        const state = req.query.state || req.query.user

        if (!service || !code && service != "steam" && service != "twitter") {return {status: 400, success: false, message: "Missing parameters"}}

        const user = await database.getUser(state.split(".")[0])
        const token = state.split(".")[1]

        if (!user || !token) {return {status: 404, success: false, message: "User not found"}}

        if (service === "github") {
            if (user.data().connections.github.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            await fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    client_id: "29cf7d66efaf02490073",
                    client_secret: process.env.GITHUB_SECRET,
                    code: code,
                }),
            }).then(async (res) => {
                let callbackRes = await res.json()

                await fetch("https://api.github.com/user", {
                    method: "GET",
                    headers: { Authorization: "token " + callbackRes.access_token },
                }).then(async (res) => {
                    let github = await res.json()

                    await database.updateUser(user.id, { "connections.github": { pending: false, username: github.login, id: github.id } })
                })
            });

            return {status: 200, success: true, message: "Successfully connected to GitHub"}
        } else if (service === "reddit") {
            if (user.data().connections.reddit.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            await fetch("https://www.reddit.com/api/v1/access_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${btoa(unescape(encodeURIComponent("eJcpyXFPMGbeCbFbhEFg0g" + ":" + process.env.REDDIT_SECRET)))}`,
                },
                body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent("https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=reddit")}`,
            }).then(async (res) => {
                const callbackRes = await res.json();

                await fetch("https://oauth.reddit.com/api/v1/me", {
                    method: "GET",
                    headers: { Authorization: "bearer " + callbackRes.access_token },
                }).then(async (res) => {
                    const reddit = await res.json();

                    await database.updateUser(user.id, { "connections.reddit": { pending: false, username: reddit.name, id: reddit.id } })
                })
            })

            return {status: 200, success: true, message: "Successfully connected to Reddit"}
        } else if (service === "steam") {
            if (user.data().connections.steam.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            const steam = new SteamAuth({
                realm: "https://us-central1-wulfco-id.cloudfunctions.net",
                returnUrl: `https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=steam&state=${encodeURIComponent(user.id + "." + token)}`,
                apiKey: process.env.STEAM_API_KEY
            })

            const steamUser = await steam.authenticate(req);

            await database.updateUser(user.id, { "connections.steam": { pending: false, username: steamUser.username, id: steamUser.steamid } })

            return {status: 200, success: true, message: "Successfully connected to Steam"}
        } else if (service === "twitter") {
            if (user.data().connections.twitter.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            const oauthToken = req.query.oauth_token
            const oauthVerifier = req.query.oauth_verifier

            if (!oauthToken || !oauthVerifier) {return {status: 400, success: false, message: "Missing parameters"}}

            return await fetch(`https://api.twitter.com/oauth/access_token?oauth_token=${encodeURIComponent(oauthToken)}&oauth_verifier=${encodeURIComponent(oauthVerifier)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }).then(async (res) => {
                const callbackRes = await res.text()

                if (!callbackRes.split("&")) {
                    return {status: 400, success: false, message: "Invalid parameters", info: callbackRes}
                }

                const userId = callbackRes.split("&")[2].split("=")[1]
                const username = callbackRes.split("&")[3].split("=")[1]

                await database.updateUser(user.id, {
                    "connections.twitter": {
                        pending: false,
                        username,
                        id: userId
                    }
                })

                return {status: 200, success: true, message: "Successfully connected to Twitter"}
            })
        } else if (service === "youtube") {
            if (user.data().connections.youtube.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `code=${code}&client_id=775008964746-48oerujtollovas4tjhvo4328g9fu0du.apps.googleusercontent.com&client_secret=${process.env.YOUTUBE_SECRET}&redirect_uri=${encodeURIComponent("https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=youtube")}&grant_type=authorization_code`,
            }).then(async (res) => {
                const callbackRes = await res.json()

                await fetch("https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2CbrandingSettings&mine=true", {
                    method: "GET",
                    headers: { Authorization: "Bearer " + callbackRes.access_token },
                }).then(async (res) => {
                    const youtube = await res.json()

                    await database.updateUser(user.id, { "connections.youtube": { pending: false, username: youtube["items"][0]["snippet"]["title"], id: youtube["items"][0]["id"] } })
                }).catch((err) => {
                    console.log(err)
                    return {status: 500, success: false, message: "Internal server error"}
                })
            }).catch((err) => {
                console.log(err)
                return {status: 500, success: false, message: "Internal server error"}
            })

            return {status: 200, success: true, message: "Successfully connected to YouTube"}
        } else if (service === "twitch") {
            if (user.data().connections.twitch.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            await fetch("https://id.twitch.tv/oauth2/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `client_id=vepu7tejuuiz1oglbmv8yrpco4hz0k&client_secret=${process.env.TWITCH_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent("https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=twitch")}`,
            }).then(async (res) => {
                const callbackRes = await res.json()

                await fetch("https://api.twitch.tv/helix/users", {
                    method: "GET",
                    headers: { Authorization: "Bearer " + callbackRes.access_token, "Client-Id": "vepu7tejuuiz1oglbmv8yrpco4hz0k" },
                }).then(async (res) => {
                    const twitch = await res.json()

                    await database.updateUser(user.id, { "connections.twitch": { pending: false, username: twitch["data"][0]["display_name"], id: twitch["data"][0]["id"] } })
                }).catch((err) => {
                    console.log(err)
                    return {status: 500, success: false, message: "Internal server error"}
                })
            }).catch((err) => {
                console.log(err)
                return {status: 500, success: false, message: "Internal server error"}
            })

            return {status: 200, success: true, message: "Successfully connected to Twitch"}
        } else if (service === "discord") {
            if (user.data().connections.discord.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `client_id=975161504703840258&client_secret=${process.env.DISCORD_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent("https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=discord")}`,
            }).then(async (res) => {
                const callbackRes = await res.json()

                await fetch("https://discord.com/api/users/@me", {
                    method: "GET",
                    headers: { Authorization: "Bearer " + callbackRes.access_token },
                }).then(async (res) => {
                    const discord = await res.json()

                    await database.updateUser(user.id, { "connections.discord": { pending: false, username: discord["username"] + "#" + discord["discriminator"], id: discord["id"] } })
                }).catch((err) => {
                    console.log(err)
                    return {status: 500, success: false, message: "Internal server error"}
                })
            }).catch((err) => {
                console.log(err)
                return {status: 500, success: false, message: "Internal server error"}
            })

            return {status: 200, success: true, message: "Successfully connected to Discord"}
        } else if (service === "spotify") {
            if (user.data().connections.spotify.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `client_id=3f67a21b4d7c4cbaa969ca88a400d579&client_secret=${process.env.SPOTIFY_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent("https://us-central1-wulfco-id.cloudfunctions.net/api/connections?function=callback&service=spotify")}`,
            }).then(async (res) => {
                const callbackRes = await res.json()

                await fetch("https://api.spotify.com/v1/me", {
                    method: "GET",
                    headers: { Authorization: "Bearer " + callbackRes.access_token },
                }).then(async (res) => {
                    const spotify = await res.json()

                    await database.updateUser(user.id, { "connections.spotify": { pending: false, username: spotify["display_name"], id: spotify["id"] } })
                }).catch((err) => {
                    console.log(err)
                    return {status: 500, success: false, message: "Internal server error"}
                })
            }).catch((err) => {
                console.log(err)
                return {status: 500, success: false, message: "Internal server error"}
            })

            return {status: 200, success: true, message: "Successfully connected to Spotify"}
        } else if (service === "roblox") {
            if (user.data().connections.roblox.token !== token) {return {status: 401, success: false, message: "Invalid token"}}

            await fetch("https://apis.roblox.com/oauth/v1/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `client_id=1207216280771106226&client_secret=${process.env.ROBLOX_SECRET}&code=${code}&grant_type=authorization_code`,
            }).then(async (res) => {
                const callbackRes = await res.json()

                await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
                    method: "GET",
                    headers: { Authorization: "Bearer " + callbackRes.access_token },
                }).then(async (res) => {
                    const roblox = await res.json()

                    await database.updateUser(user.id, { "connections.roblox": { pending: false, username: roblox["preferred_username"], display_name: roblox["name"], id: roblox["sub"] } })
                }).catch((err) => {
                    console.log(err)
                    return {status: 500, success: false, message: "Internal server error"}
                })
            }).catch((err) => {
                console.log(err)
                return {status: 500, success: false, message: "Internal server error"}
            })

            return {status: 200, success: true, message: "Successfully connected to Roblox"}
        } else {
            return { status: 400, success: false, message: "Invalid service" }
        }
    }
}