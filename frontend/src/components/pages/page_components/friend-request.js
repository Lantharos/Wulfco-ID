import React from 'react'

import PropTypes from 'prop-types'

import './friend-request.css'
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";

const config = require('../../../config.json')
const api_url = config.api_url

const FriendRequest = (props) => {
    const acceptRequest = async () => {
        const message = toast.loading('Accepting request', {theme: 'dark', autoClose: false})
        await fetch(`${api_url}/friend-requests?id=${encodeURIComponent(cookies.load('id'))}`, {
            method: 'POST',
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
                    toast.update(message, {
                        render: 'Accepted request',
                        type: toast.TYPE.SUCCESS,
                        isLoading: false,
                        autoClose: 2000
                    })
                    props.updateUserData()
                } else {
                    toast.update(message, {
                        render: 'Failed to accept request',
                        type: toast.TYPE.ERROR,
                        isLoading: false,
                        autoClose: 2000
                    })
                }
            });
        }).catch(() => {
            toast.update(message, {
                render: 'Failed to accept request',
                type: toast.TYPE.ERROR,
                isLoading: false,
                autoClose: 2000
            })
        })
    }

    const declineRequest = async () => {
        const message = toast.loading('Declining request', {theme: 'dark', autoClose: false})
        await fetch(`${api_url}/friend-requests?id=${encodeURIComponent(cookies.load('id'))}`, {
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
                    toast.update(message, {
                        render: 'Declined request',
                        type: toast.TYPE.SUCCESS,
                        isLoading: false,
                        autoClose: 2000
                    })
                    props.updateUserData()
                } else {
                    toast.update(message, {
                        render: 'Failed to decline request',
                        type: toast.TYPE.ERROR,
                        isLoading: false,
                        autoClose: 2000
                    })
                }
            });
        }).catch(() => {
            toast.update(message, {
                render: 'Failed to decline request',
                type: toast.TYPE.ERROR,
                isLoading: false,
                autoClose: 2000
            })
        })
    }

    return (
        <div className="friend-request-container">
            <img
                alt="invite avatar"
                src={props.avatar}
                className="friend-request-image"
            />
            <button id="decline" className="friend-request-button button" onClick={declineRequest}>
                <svg
                    viewBox="0 0 804.5714285714286 1024"
                    className="friend-request-icon"
                >
                    <path d="M741.714 755.429c0 14.286-5.714 28.571-16 38.857l-77.714 77.714c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-168-168-168 168c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-77.714-77.714c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l168-168-168-168c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l77.714-77.714c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l168 168 168-168c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l77.714 77.714c10.286 10.286 16 24.571 16 38.857s-5.714 28.571-16 38.857l-168 168 168 168c10.286 10.286 16 24.571 16 38.857z"></path>
                </svg>
            </button>
            <button id="accept" className="friend-request-button1 button" onClick={acceptRequest}>
                <svg viewBox="0 0 1024 1024" className="friend-request-icon2">
                    <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                </svg>
            </button>
            <h1 className="friend-request-text">{props.username}#{props.discriminator}</h1>
        </div>
    )
}

FriendRequest.defaultProps = {
    username: 'john_doe#0001',
    avatar: 'https://play.teleporthq.io/static/svg/default-img.svg',
    discriminator: '0000',
    id: "0",
}

FriendRequest.propTypes = {
    username: PropTypes.string,
    avatar: PropTypes.string,
}

export default FriendRequest
