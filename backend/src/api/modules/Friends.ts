import firebase from "firebase/compat/app";
import User from "./User";
import * as database from "../FirebaseHandler"

export default class Friends {
    public static async addFriend(req: any) {
        const user_id = req.body.id
        if (!user_id) { return {status: 400, success: false, message: "Missing fields"} }

        const friend_username = req.body.friend_name
        if (!friend_username) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUserByUsername(friend_username)
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        if (user.user.friends.includes(friend.id)) { return {status: 400, success: false, message: "Already friends"} }

        const friendObject = {
            id: friend.id,
            username: friend.data().profile.username,
            discriminator: friend.data().profile.discriminator,
            avatar: friend.data().profile.avatar
        }

        await database.updateUser(user_id, { [`friends.pending.outbound.${friend.id}`]: friendObject });
        await database.updateUser(friend.id, { [`friends.pending.inbound.${friend.id}`]: friendObject })

        return {status: 200, success: true}
    }

    public static async removeFriend(req: any) {
        const user_id = req.body.id
        if (!user_id) { return {status: 400, success: false, message: "Missing fields"} }

        const friend_username = req.body.friend_name
        if (!friend_username) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUserByUsername(friend_username)
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        if (!user.user.friends.includes(friend.id)) { return {status: 400, success: false, message: "Not friends"} }

        await database.updateUser(user_id, { [`friends.friends.${friend.id}`]: firebase.firestore.FieldValue.delete() });
        await database.updateUser(friend.id, { [`friends.friends.${user_id}`]: firebase.firestore.FieldValue.delete() })

        return {status: 200, success: true}
    }

    public static async acceptFriend(req: any) {
        const user_id = req.body.id
        if (!user_id) { return {status: 400, success: false, message: "Missing fields"} }

        const friend_username = req.body.friend_name
        if (!friend_username) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUserByUsername(friend_username)
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        if (!user.user.friends.includes(friend.id)) { return {status: 400, success: false, message: "Not friends"} }

        const friendObject = {
            id: friend.id,
            username: friend.data().profile.username,
            discriminator: friend.data().profile.discriminator,
            avatar: friend.data().profile.avatar
        }

        await database.updateUser(user_id, { [`friends.pending.inbound.${friend.id}`]: firebase.firestore.FieldValue.delete() });
        await database.updateUser(friend.id, { [`friends.pending.outbound.${user_id}`]: firebase.firestore.FieldValue.delete() })
        await database.updateUser(user_id, { [`friends.friends.${friend.id}`]: friendObject });
        await database.updateUser(friend.id, { [`friends.friends.${user_id}`]: friendObject })

        return {status: 200, success: true}
    }

    public static async declineFriend(req: any) {
        const user_id = req.body.id
        if (!user_id) { return {status: 400, success: false, message: "Missing fields"} }

        const friend_username = req.body.friend_name
        if (!friend_username) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUserByUsername(friend_username)
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        if (!user.user.friends.includes(friend.id)) { return {status: 400, success: false, message: "Not friends"} }

        const friendObject = {
            id: friend.id,
            username: friend.data().profile.username,
            discriminator: friend.data().profile.discriminator,
            avatar: friend.data().profile.avatar
        }

        await database.updateUser(user_id, { [`friends.pending.inbound.${friend.id}`]: firebase.firestore.FieldValue.delete() });
        await database.updateUser(friend.id, { [`friends.pending.outbound.${user_id}`]: firebase.firestore.FieldValue.delete() })

        return {status: 200, success: true}
    }

    public static async block(req: any) {
        const user_id = req.body.id
        if (!user_id) { return {status: 400, success: false, message: "Missing fields"} }

        const friend_username = req.body.friend_name
        if (!friend_username) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUserByUsername(friend_username)
        if (!friend) { return {status: 400, success: false, message: "Could not find blocked user"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find blocked user"} }

        if (user.user.friends.includes(friend.id)) { return {status: 400, success: false, message: "Already blocked"} }

        const blockObject = {
            id: friend.id,
            username: friend.data().profile.username,
            discriminator: friend.data().profile.discriminator,
            avatar: friend.data().profile.avatar
        }

        await database.updateUser(user_id, { [`friends.blocked.${friend.id}`]: blockObject });

        return {status: 200, success: true}
    }

    public static async unblock(req: any) {
        const user_id = req.body.id
        if (!user_id) { return {status: 400, success: false, message: "Missing fields"} }

        const friend_username = req.body.friend_name
        if (!friend_username) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUserByUsername(friend_username)
        if (!friend) { return {status: 400, success: false, message: "Could not find blocked user"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find blocked user"} }

        if (!user.user.friends.includes(friend.id)) { return {status: 400, success: false, message: "Not blocked"} }

        const blockObject = {
            id: friend.id,
            username: friend.data().profile.username,
            discriminator: friend.data().profile.discriminator,
            avatar: friend.data().profile.avatar
        }

        await database.updateUser(user_id, { [`friends.blocked.${friend.id}`]: firebase.firestore.FieldValue.delete() });

        return {status: 200, success: true}
    }
}