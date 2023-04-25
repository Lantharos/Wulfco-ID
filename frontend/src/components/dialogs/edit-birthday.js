import React from 'react'

import './edit-birthday.css'
import { motion } from 'framer-motion'
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";
const config = require('../../config.json')
const api_url = config.api_url

const EditBirthday = (props) => {
    const checkPassword = async() => {
        let toReturn = true;
        return new Promise((resolve) => {
            const password = document.getElementById('password').value;
            fetch(`${api_url}/verify-password?id=${encodeURIComponent(cookies.load('id'))}`, {
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

    const updateBirthday = async() => {
        if ((await checkPassword()) === false) {
            return
        }

        const birthday = document.getElementById('birthday_new').value;
        const message = toast.loading('Updating birthday...', { theme: 'dark', autoClose: false })
        fetch(`${api_url}/account?id=${encodeURIComponent(cookies.load('id'))}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            },
            body: JSON.stringify({
                username: props.userData.profile.username,
                email: props.userData.email,
                birthday
            })
        }).then((res) => {
            res.json().then((data) => {
                if (data.success) {
                    toast.update(message, { render: 'Updated birthday', type: 'success', theme: 'dark', isLoading: false, autoClose: 2000 });
                    props.setShowEditUsername(false);
                    props.updateUserData()
                } else {
                    toast.update(message, { render: 'Failed to update birthday', type: 'error', theme: 'dark', isLoading: false, autoClose: 2000 });
                }
            });
        }).catch(() => {
            toast.update(message, { render: 'Failed to update birthday', type: 'error', theme: 'dark', isLoading: false, autoClose: 2000 });
        });
    }

    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="edit-birthday-container" animate={{height: '357px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
                <h1 className="edit-birthday-text notselectable">Change your birthday</h1>
                <span className="edit-birthday-text1 notselectable">
                    Enter a new birthday and your existing password
                </span>
                <div className="edit-birthday-container1">
                    <span className="edit-birthday-text2 notselectable">
                      <span>Birthday</span>
                      <br></br>
                    </span>
                    <input
                        type="date"
                        id="birthday_new"
                        name="birthday_new"
                        required="true"
                        autoComplete="bday"
                        className="edit-birthday-textinput input"
                    />
                </div>
                <div className="edit-birthday-container2">
                    <span className="edit-birthday-text5 notselectable">Password</span>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required="true"
                        autoFocus="true"
                        maxlength="20"
                        minlength="3"
                        autoComplete="current-password"
                        className="edit-birthday-textinput1 input"
                    />
                </div>
                <div className="edit-birthday-container3">
                    <button
                        id="cancel_edit"
                        type="button"
                        className="edit-birthday-save button"
                        onClick={() => props.setShowEditBirthday(false)}
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm_username"
                        type="button"
                        className="edit-birthday-save1 button"
                        onClick={() => updateBirthday()}
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default EditBirthday
