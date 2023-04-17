import React from 'react'

import './edit-username.css'
import { motion } from 'framer-motion'
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";
const config = require('../../config.json')
const api_url = config.api_url

const EditUsername = (props) => {
    const checkPassword = async() => {
        let toReturn = true;
        return new Promise((resolve) => {
            const password = document.getElementById('password').value;
            fetch(`${api_url}/id/verify-password?id=${encodeURIComponent(cookies.load('id'))}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                    'W-Session': cookies.load('session_id'),
                    'W-Loggen': cookies.load('loggen')
                },
                body: JSON.stringify({
                    password
                })
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success) {
                        toReturn = true;
                    } else {
                        toReturn = false;
                        toast.error('Incorrect password', { theme: 'dark', autoClose: 2000 });
                        document.getElementById('password').classList.add('error');
                        setTimeout(() => {
                            document.getElementById('password').classList.remove('error');
                        }, 2000);
                    }
                    resolve(toReturn);
                });
            }).catch(() => {
                toReturn = false;
                toast.error('Failed to check password', { theme: 'dark', autoClose: 2000 });
                document.getElementById('password').classList.add('error');
                setTimeout(() => {
                    document.getElementById('password').classList.remove('error');
                }, 2000);
                resolve(toReturn);
            });
        });
    };

    const updateUsername = async() => {
        if ((await checkPassword()) === false) {
            return
        }

        const username = document.getElementById('username_new').value;
        fetch(`${api_url}/id/account?id=${encodeURIComponent(cookies.load('id'))}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            },
            body: JSON.stringify({
                username,
                email: props.userData.email
            })
        }).then((res) => {
            res.json().then((data) => {
                if (data.success) {
                    toast.success('Username updated', { theme: 'dark', autoClose: 2000 });
                    props.setShowEditUsername(false);
                    props.updateUserData()
                } else {
                    toast.error('Failed to update username', { theme: 'dark', autoClose: 2000 });
                }
            });
        }).catch(() => {
            toast.error('Failed to update username', { theme: 'dark', autoClose: 2000 });
        });
    }

    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="edit-username-container" animate={{height: '357px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
                <h1 className="edit-username-text notselectable">Change your username</h1>
                <span className="edit-username-text1 notselectable">Enter a new username and your existing password</span>
                <div className="edit-username-container1">
                    <span className="edit-username-text2 notselectable">Username</span>
                    <input
                        type="text"
                        id="username_new"
                        name="username_new"
                        required="true"
                        autoComplete="username"
                        className="edit-username-textinput input"
                    />
                </div>
                <div className="edit-username-container2">
                    <span className="edit-username-text3 notselectable">Password</span>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required="true"
                        autoComplete="current-password"
                        className="edit-username-textinput1 input"
                    />
                </div>
                <div className="edit-username-container3">
                    <button
                        id="cancel_username"
                        type="button"
                        className="edit-username-save button"
                        onClick={() => props.setShowEditUsername(false)}
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm_username"
                        type="button"
                        className="edit-username-save1 button"
                        onClick={() => updateUsername()}
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default EditUsername
