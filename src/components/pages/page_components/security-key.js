import React from 'react'

import './security-key.css'
import cookies from 'react-cookies'
import hmac from 'crypto-js/hmac-sha256'
import { toast } from 'react-toastify';

const config = require('../../../config.json')
const api_url = config.api_url

const SecurityKey = (props) => {
    const removeKey = async() => {
        const message = toast.loading('Removing...', { theme: "dark" })

        await fetch(`${api_url}/id/security-key?id=${encodeURIComponent(cookies.load("id"))}&key=${encodeURIComponent(props.keyId)}}`, {
            method: "DELETE",
            headers: {
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            }
        }).then((res) => {
            res.json().then((data) => {
                if (data.success) {
                    toast.update(message, { render: 'Removed!', type: 'success', autoClose: 2000, isLoading: false })
                    props.updateUserData()
                } else {
                    toast.update(message, { render: 'Failed to remove!', type: 'error', autoClose: 2000, isLoading: false })
                }
            })
        }).catch(() => {
            toast.update(message, { render: 'Failed to remove!', type: 'error', autoClose: 2000, isLoading: false })
        })
    }

    return (
        <div className={`security-key-container`}>
            <div className="security-key-container1">
                <h1 className="security-key-text">{props.name}</h1>
                <button
                    id="remove_key"
                    type="button"
                    className="security-key-button button"
                    onClick={removeKey}
                >
                    Remove
                </button>
            </div>
        </div>
    )
}

export default SecurityKey
