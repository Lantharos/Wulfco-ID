import React from 'react'

import './add-paypal.css'
import { motion } from 'framer-motion'
import {toast} from "react-toastify";
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";

const config = require('../../../config.json')
const api_url = config.api_url

const AddPaypal = (props) => {
    const getSetup = async () => {
        const message = toast.loading("Generating url...", {theme: 'dark'})
        await fetch(`${api_url}/payment-methods?type=paypal&id=${encodeURIComponent(cookies.load('id'))}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen'),
            }
        }).then(res => res.json()).then(data => {
            if (data.status === 300) {
                if (data.requires_action.type === "redirect_to_url") {
                    toast.update(message, {type: 'info', render: 'Redirecting...', theme: 'dark', isLoading: false, autoClose: 5000})
                    window.location.href = data.requires_action.url
                } else {
                    toast.update(message, {type: 'info', render: 'Unknown action required, contact support.', theme: 'dark', isLoading: false, autoClose: 5000})
                }
            } else { toast.update(message, {type: 'error', render: 'Error generating url!', theme: 'dark', isLoading: false, autoClose: 5000}) }
        })
    }

  return (
    <div>
        <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

        <motion.div animate={{height: '269px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}} className="add-paypal-container">
            <h1 className="add-paypal-text notselectable">
                Add a new payment method
            </h1>
            <div className="add-paypal-container1">
                <button
                    id="cancel_username"
                    type="button"
                    onClick={() => { props.switchStage(0) }}
                    className="add-paypal-save button"
                >
                    Cancel
                </button>
                <button
                    id="open_paypal"
                    type="button"
                    className="add-paypal-save1 button"
                    onClick={getSetup}
                >
                    Connect to PayPal
                </button>
            </div>
            <div className="add-paypal-container2">
                <span className="add-paypal-text1 notselectable">PAYPAL ACCOUNT</span>
                <div className="add-paypal-container3">
                    <svg
                        viewBox="0 0 1316.5714285714284 1024"
                        className="add-paypal-icon"
                    >
                        <path d="M425.714 517.714c0 28-22.286 49.143-50.286 49.143-21.143 0-36.571-12-36.571-34.286 0-28 21.714-50.286 49.714-50.286 21.143 0 37.143 13.143 37.143 35.429zM874.286 432.571c0 34.286-20.571 41.143-50.286 41.143l-18.286 0.571 9.714-61.143c0.571-4 3.429-6.286 7.429-6.286h10.286c19.429 0 41.143 1.143 41.143 25.714zM1074.857 517.714c0 28-22.286 49.143-49.714 49.143-21.143 0-37.143-12-37.143-34.286 0-28 21.714-50.286 49.714-50.286 21.143 0 37.143 13.143 37.143 35.429zM293.143 420c0-48-37.143-64-79.429-64h-91.429c-5.714 0-11.429 4.571-12 10.857l-37.143 233.143c-0.571 4.571 2.857 9.143 7.429 9.143h43.429c6.286 0 12-4.571 12.571-10.857l10.286-62.857c2.286-16.571 30.286-10.857 41.143-10.857 65.143 0 105.143-38.857 105.143-104.571zM469.714 598.286l23.429-149.143c0.571-4.571-2.857-9.143-7.429-9.143h-43.429c-8.571 0-9.143 12.571-9.714 18.857-13.143-19.429-32.571-22.857-54.286-22.857-56 0-98.857 49.143-98.857 103.429 0 44.571 28 73.714 72.571 73.714 20.571 0 46.286-9.143 60.571-25.143-1.143 3.429-2.286 8.571-2.286 12 0 5.143 2.286 9.143 7.429 9.143h39.429c6.286 0 11.429-4.571 12.571-10.857zM725.143 448c0-4-3.429-8-7.429-8h-44c-4 0-8 2.286-10.286 5.714l-60.571 89.143-25.143-85.714c-1.714-5.143-6.857-9.143-12.571-9.143h-42.857c-4 0-7.429 4-7.429 8 0 2.857 44.571 132 48.571 144-6.286 8.571-46.857 61.714-46.857 68.571 0 4 3.429 7.429 7.429 7.429h44c4 0 8-2.286 10.286-5.714l145.714-210.286c1.143-1.143 1.143-2.286 1.143-4zM942.286 420c0-48-37.143-64-79.429-64h-90.857c-6.286 0-12 4.571-12.571 10.857l-37.143 233.143c-0.571 4.571 2.857 9.143 7.429 9.143h46.857c4.571 0 8-3.429 9.143-7.429l10.286-66.286c2.286-16.571 30.286-10.857 41.143-10.857 65.143 0 105.143-38.857 105.143-104.571zM1118.857 598.286l23.429-149.143c0.571-4.571-2.857-9.143-7.429-9.143h-43.429c-8.571 0-9.143 12.571-9.714 18.857-12.571-19.429-32-22.857-54.286-22.857-56 0-98.857 49.143-98.857 103.429 0 44.571 28 73.714 72.571 73.714 21.143 0 46.857-9.143 60.571-25.143-0.571 3.429-2.286 8.571-2.286 12 0 5.143 2.286 9.143 7.429 9.143h39.429c6.286 0 11.429-4.571 12.571-10.857zM1243.429 364.571v-0.571c0-4.571-3.429-8-7.429-8h-42.286c-3.429 0-6.857 2.857-7.429 6.286l-37.143 237.714-0.571 1.143c0 4 3.429 8 8 8h37.714c5.714 0 11.429-4.571 12-10.857zM224 441.143c-4.571 29.143-24 32.571-49.143 32.571l-18.857 0.571 9.714-61.143c0.571-4 4-6.286 7.429-6.286h10.857c25.714 0 45.143 3.429 40 34.286zM1316.571 146.286v731.429c0 40-33.143 73.143-73.143 73.143h-1170.286c-40 0-73.143-33.143-73.143-73.143v-731.429c0-40 33.143-73.143 73.143-73.143h1170.286c40 0 73.143 33.143 73.143 73.143z"></path>
                    </svg>
                    <span className="add-paypal-text2 notselectable">
            Confirm PayPal details in your browser!
          </span>
                </div>
            </div>
        </motion.div>
    </div>
  )
}

export default AddPaypal
