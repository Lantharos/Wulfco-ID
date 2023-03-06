import React from 'react'

import './enter-password.css'
import { motion } from 'framer-motion'
import {toast} from "react-toastify";
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";

const config = require('../../config.json')
const api_url = config.api_url

const EnterPassword = (props) => {
    const checkPassword = () => {
        const password = document.getElementById('password').value
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
                    props.enterPassword.after()
                    props.setEnterPassword({})
                } else {
                    toast.error('Incorrect password', { theme: 'dark', autoClose: 2000 })
                    document.getElementById('password').classList.add('error')
                    setTimeout(() => {
                        document.getElementById('password').classList.remove('error')
                    }, 2000)
                }
            })
        }).catch(() => {
            toast.error('Failed to check password', { theme: 'dark', autoClose: 2000 })
            document.getElementById('password').classList.add('error')
            setTimeout(() => {
                document.getElementById('password').classList.remove('error')
            }, 2000)
        })
    }
    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="enter-password-container" animate={{height: '250px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
                <h1 className="enter-password-text notselectable">Enter your password</h1>
                <div className="enter-password-container1">
                    <span className="enter-password-text1 notselectable">Password</span>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required="true"
                        autoComplete="current-password"
                        className="enter-password-textinput input"
                    />
                </div>
                <div className="enter-password-container2">
                    <button
                        type="button"
                        id="cancel_password"
                        onClick={() => props.setEnterPassword({})}
                        className="enter-password-save button"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        id="confirm_password"
                        className="enter-password-save1 button"
                        onClick={() => checkPassword()}
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default EnterPassword
