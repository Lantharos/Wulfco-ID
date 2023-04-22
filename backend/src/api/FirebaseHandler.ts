import {initializeApp} from "firebase/app";

import {addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

const firebaseApp = initializeApp({
    apiKey: process.env.APPFIREBASE_AKEY,
    authDomain: "wulfco-id.firebaseapp.com",
    projectId: "wulfco-id",
    storageBucket: "wulfco-id.appspot.com",
    messagingSenderId: process.env.APPFIREBASE_SENDER_ID,
    appId: process.env.APPFIREBASE_APP_ID,
    measurementId: process.env.APPFIREBASE_MEASUREMENT_ID
});

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const users = collection(db, "users");
const oauth_apps = collection(db, "oauth_apps");

// Users
export const getUser = async (id: string) => {
    try {
        return await getDoc(doc(users, id))
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            return querySnapshot.docs[0]
        } else {
            return null;
        }
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const updateUser = async (id: string, data: any) => {
    try {
        await updateDoc(doc(users, id), data);
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}

export const createUser = async (data: any) => {
    try {
        const docRef= await addDoc(users, data)
        return docRef.id;
    } catch (e) {
        console.log(e)
        return null;
    }
}

export const uploadAvatar = async (id: string, file: any) => {
    try {
        const parsedFile = JSON.parse(file)
        const buffer = Buffer.from(parsedFile.data, 'base64');

        const storageRef = ref(storage, `avatars/${id}/${parsedFile.fileName}`);
        await uploadBytes(storageRef, buffer);

        const avatarURL = await getDownloadURL(storageRef)

        await updateDoc(doc(users, id), {"profile.avatar": avatarURL});

        return true;
    } catch(e) {
        console.log(e)
        return false;
    }
}

// OAuth Apps
export const getOAuthApp = async (id: string) => {
    try {
        return await getDoc(doc(oauth_apps, id))
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const updateOAuthApp = async (id: string, data: any) => {
    try {
        await updateDoc(doc(oauth_apps, id), data);
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}

export const createOAuthApp = async (data: any) => {
    try {
        const docRef = await addDoc(oauth_apps, data)
        const app = await getDoc(docRef)
        return {appId: docRef.id, data: app.data()};
    } catch (e) {
        console.log(e)
        return null;
    }
}