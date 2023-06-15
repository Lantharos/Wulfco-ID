import firebase from "firebase/compat/app";
import User from "./User";
import * as database from "../FirebaseHandler"
import 'firebase/compat/firestore';

export default class Friends {
    public static async addFriend(req: any) {
        const {username, discriminator} = req.body
        if (!username || !discriminator) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUserByUsername(username, parseInt(discriminator))
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        const incomingObject = {
            id: friend.id,
            username: friend.data().profile.username,
            discriminator: friend.data().profile.discriminator,
            avatar: friend.data().profile.avatar
        }

        const outgoingObject = {
            id: user.rawUser.id,
            username: user.user.profile.username,
            discriminator: user.user.profile.discriminator,
            avatar: user.user.profile.avatar
        }

        if (user.user.friends.friends) {if (user.user.friends.friends[friend.id]) { return {status: 400, success: false, message: "Already sent request"} }}
        if (user.user.friends.inbound) {if(user.user.friends.inbound[friend.id]) { return {status: 400, success: false, message: "Already sent request"} }}
        if (user.user.friends.outbound) {if (user.user.friends.outbound[friend.id]) { return {status: 400, success: false, message: "Already sent request"} }}

        await database.updateUser(user.rawUser.id, { [`friends.outbound.${friend.id}`]: incomingObject });
        await database.updateUser(friend.id, { [`friends.inbound.${user.rawUser.id}`]: outgoingObject })

        return {status: 200, success: true}
    }

    public static async cancelRequest(req: any) {
        const {friend_id} = req.body
        if (!friend_id) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUser(friend_id)
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        if (user.user.friends.outbound) { if (!user.user.friends.outbound[friend.id]) {return {status: 403, success: false, message: "Request not found"} } }

        await database.updateUser(user.rawUser.id, { [`friends.outbound.${friend.id}`]: firebase.firestore.FieldValue.delete() });
        await database.updateUser(friend.id, { [`friends.inbound.${user.rawUser.id}`]: firebase.firestore.FieldValue.delete() })

        return {status: 200, success: true}
    }

    public static async removeFriend(req: any) {
        const {friend_id} = req.body
        if (!friend_id) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUser(friend_id)
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        if (user.user.friends.friends) { if (!user.user.friends.friends[friend.id]) { return {status: 400, success: false, message: "Not friends"} } }

        await database.updateUser(user.rawUser.id, { [`friends.friends.${friend.id}`]: firebase.firestore.FieldValue.delete() });
        await database.updateUser(friend.id, { [`friends.friends.${user.rawUser.id}`]: firebase.firestore.FieldValue.delete() })

        return {status: 200, success: true}
    }

    public static async acceptFriend(req: any) {
        const {friend_id} = req.body
        if (!friend_id) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUser(friend_id)
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        const incomingObject = {
            id: friend.id,
            username: friend.data().profile.username,
            discriminator: friend.data().profile.discriminator,
            avatar: friend.data().profile.avatar
        }

        const outgoingObject = {
            id: user.rawUser.id,
            username: user.user.profile.username,
            discriminator: user.user.profile.discriminator,
            avatar: user.user.profile.avatar
        }

        if (user.user.friends.inbound) { if (!user.user.friends.inbound[friend.id]) { return {status: 400, success: false, message: "Not pending"} } }
        if (friend.data().friends.outbound) { if (!friend.data().friends.outbound[user.rawUser.id]) { return {status: 400, success: false, message: "Not pending"} } }

        await database.updateUser(user.rawUser.id, { [`friends.inbound.${friend.id}`]: firebase.firestore.FieldValue.delete() });
        await database.updateUser(friend.id, { [`friends.outbound.${user.rawUser.id}`]: firebase.firestore.FieldValue.delete() })
        await database.updateUser(user.rawUser.id, { [`friends.friends.${friend.id}`]: incomingObject });
        await database.updateUser(friend.id, { [`friends.friends.${user.rawUser.id}`]: outgoingObject })

        return {status: 200, success: true}
    }

    public static async declineFriend(req: any) {
        const {friend_id} = req.body
        if (!friend_id) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUser(friend_id)
        if (!friend) { return {status: 400, success: false, message: "Could not find friend"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find friend"} }

        if (user.user.friends.inbound) { if (!user.user.friends.inbound[friend.id]) { return {status: 400, success: false, message: "Not pending"} } }
        if (friend.data().friends.outbound) { if (!friend.data().friends.outbound[user.rawUser.id]) { return {status: 400, success: false, message: "Not pending"} } }

        await database.updateUser(user.rawUser.id, { [`friends.inbound.${friend.id}`]: firebase.firestore.FieldValue.delete() });
        await database.updateUser(friend.id, { [`friends.outbound.${user.rawUser.id}`]: firebase.firestore.FieldValue.delete() })

        return {status: 200, success: true}
    }

    public static async block(req: any) {
        const {username, discriminator} = req.body
        if (!username || !discriminator) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUserByUsername(username, parseInt(discriminator))
        if (!friend) { return {status: 400, success: false, message: "Could not find blocked user"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find blocked user"} }

        const blockObject = {
            id: friend.id,
            username: friend.data().profile.username,
            discriminator: friend.data().profile.discriminator,
            avatar: friend.data().profile.avatar
        }

        if (user.user.friends.blocked) { if (user.user.friends.blocked[friend.id]) { return {status: 400, success: false, message: "Already blocked"} } }

        await database.updateUser(user.rawUser.id, { [`friends.blocked.${friend.id}`]: blockObject });

        return {status: 200, success: true}
    }

    public static async unblock(req: any) {
        const {blocked_id} = req.body
        if (!blocked_id) { return {status: 400, success: false, message: "Missing fields"} }

        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const friend = await database.getUser(blocked_id)
        if (!friend) { return {status: 400, success: false, message: "Could not find blocked user"} }
        if (!friend.data().profile) { return {status: 400, success: false, message: "Could not find blocked user"} }

        if (user.user.friends.blocked) { if (!user.user.friends.blocked[friend.id]) { return {status: 400, success: false, message: "Not blocked"} } }

        await database.updateUser(user.rawUser.id, { [`friends.blocked.${friend.id}`]: firebase.firestore.FieldValue.delete() });

        return {status: 200, success: true}
    }
}