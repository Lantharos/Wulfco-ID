import React from 'react'

import './name-security-key.css'
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
const config = require('../../config.json')
const api_url = config.api_url

const NameSecurityKey = (props) => {
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

    const saveKey = async() => {
        if ((await checkPassword()) === false) {
            console.log('Incorrect password')
            return
        }

        console.log("Saving key...")

        const notif = toast.loading('Registering security key...', { theme: "dark" })
        const attestationObject = props.securityKey.response.attestationObject
        const clientDataJSON = props.securityKey.response.clientDataJSON

        await fetch(`${api_url}/id/security-key?id=${encodeURIComponent(cookies.load("id"))}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            },
            body: JSON.stringify({
                id: props.securityKey.id,
                rawId: props.securityKey.rawId,
                response: {
                    attestationObject,
                    clientDataJSON
                },
                type: props.securityKey.type,
                name: document.getElementById('key_name').value,
            })
        }).then((res) => {
            res.json().then((data) => {
                if (data.success) {
                    toast.update(notif, { theme: "dark", render: 'Security key registered!', type: "success", isLoading: false, autoClose: 2000 })
                    props.updateUserData()
                    props.setSecurityKey({})
                } else {
                    toast.update(notif, { theme: "dark", render: 'Failed to register security key!', type: "error", isLoading: false, autoClose: 2000 })
                }
            })
        }).catch(() => {
            toast.update(notif, { theme: "dark", render: 'Failed to register security key!', type: "error", isLoading: false, autoClose: 2000 })
        })
    }

  return (
      <div>
          <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

          <motion.div className="name-security-key-container" animate={{height: '357px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
      <h1 className="name-security-key-text notselectable">
        Finish setting up
      </h1>
      <span className="name-security-key-text1 notselectable">
        Please enter a name for your key and your password.
      </span>
      <div className="name-security-key-container1">
        <span className="name-security-key-text2 notselectable">Key Name</span>
        <input
          type="text"
          id="key_name"
          name="key_name"
          required="true"
          autoComplete="username"
          className="name-security-key-textinput input"
        />
      </div>
      <div className="name-security-key-container2">
        <span className="name-security-key-text3 notselectable">Password</span>
        <input
          type="password"
          id="password"
          name="password"
          required="true"
          autoComplete="current-password"
          className="name-security-key-textinput1 input"
        />
      </div>
      <div className="name-security-key-container3">
        <button
          id="cancel_key"
          type="button"
          className="name-security-key-save button"
          onClick={() => props.setSecurityKey({})}
        >
          Cancel
        </button>
        <button
          id="confirm_key"
          type="button"
          className="name-security-key-save1 button"
          onClick={() => saveKey()}
        >
          Done
        </button>
      </div>
    </motion.div>
    </div>
  )
}

export default NameSecurityKey
