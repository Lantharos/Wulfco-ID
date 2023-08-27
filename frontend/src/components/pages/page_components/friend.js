import React from 'react'

import PropTypes from 'prop-types'

import './friend.css'
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";

const config = require('../../../config.json')
const api_url = config.api_url

const Friend = (props) => {
    const removeFriend = async () => {
        const message = toast.loading('Removing...', {theme: 'dark', autoClose: false})
        if (props.request === true) {
            await fetch(`${api_url}/friend-requests?id=${encodeURIComponent(cookies.load('id'))}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                    'W-Session': cookies.load('session_id'),
                    'W-Loggen': cookies.load('loggen')
                },
                body: JSON.stringify({
                    friend_id: props.id
                })
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success) {
                        toast.update(message, { render: 'Cancelled request', type: toast.TYPE.SUCCESS, isLoading: false, autoClose: 2000 })
                        props.updateUserData()
                    } else {
                        toast.update(message, { render: 'Failed to cancel request', type: toast.TYPE.ERROR, isLoading: false, autoClose: 2000 })
                    }
                });
            })
        } else if (props.blocked === true) {
            await fetch(`${api_url}/block?id=${encodeURIComponent(cookies.load('id'))}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                    'W-Session': cookies.load('session_id'),
                    'W-Loggen': cookies.load('loggen')
                },
                body: JSON.stringify({
                    blocked_id: props.id
                })
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success) {
                        toast.update(message, { render: 'Unblocked', type: toast.TYPE.SUCCESS, isLoading: false, autoClose: 2000 })
                        props.updateUserData()
                    } else {
                        toast.update(message, { render: 'Failed to unblock', type: toast.TYPE.ERROR, isLoading: false, autoClose: 2000 })
                    }
                });
            })
        } else {
            await fetch(`${api_url}/friends?id=${encodeURIComponent(cookies.load('id'))}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                    'W-Session': cookies.load('session_id'),
                    'W-Loggen': cookies.load('loggen')
                },
                body: JSON.stringify({
                    friend_id: props.id
                })
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success) {
                        toast.update(message, { render: 'Removed friend', type: toast.TYPE.SUCCESS, isLoading: false, autoClose: 2000 })
                        props.updateUserData()
                    } else {
                        toast.update(message, { render: 'Failed to remove friend', type: toast.TYPE.ERROR, isLoading: false, autoClose: 2000 })
                    }
                });
            })
        }
    }

    return (
        <div className={`friend-container`}>
            <img alt="invite avatar" loading={"eager"} src={props.avatar} className="friend-image" />
            <button id="decline" className="friend-button button" onClick={removeFriend}>
                <svg viewBox="0 0 804.5714285714286 1024" className="friend-icon">
                    <path
                        d="M741.714 755.429c0 14.286-5.714 28.571-16 38.857l-77.714 77.714c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-168-168-168 168c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-77.714-77.714c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l168-168-168-168c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l77.714-77.714c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l168 168 168-168c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l77.714 77.714c10.286 10.286 16 24.571 16 38.857s-5.714 28.571-16 38.857l-168 168 168 168c10.286 10.286 16 24.571 16 38.857z"
                        className=""
                    ></path>
                </svg>
            </button>
            <h1 className="friend-text">{props.username}#{props.discriminator}</h1>
        </div>
    )
}

Friend.defaultProps = {
    request: false,
    blocked: false,
    avatar: 'https://play.teleporthq.io/static/svg/default-img.svg',
    username: 'john_doe',
    discriminator: '0000',
    id: "0",
}

Friend.propTypes = {
    request: PropTypes.bool,
    blocked: PropTypes.bool,
    avatar: PropTypes.string,
    username: PropTypes.string,
    id: PropTypes.string,
    discriminator: PropTypes.string,
}

export default Friend
