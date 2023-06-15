import React from 'react'

import './add--friend.css'
import FriendRequest from './page_components/friend-request'
import Friend from "./page_components/friend";
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";

const config = require('../../config.json')
const api_url = config.api_url

const AddAFriend = (props) => {
    const mapInboundRequests = () => {
        const inboundRequests = props.userData.friends.inbound || {}
        const inboundRequestList = []

        for (const friendId in inboundRequests) {
            inboundRequestList.push(<FriendRequest updateUserData={props.updateUserData} id={inboundRequests[friendId].id} avatar={inboundRequests[friendId].avatar} username={inboundRequests[friendId].username} discriminator={inboundRequests[friendId].discriminator} />)
        }

        return inboundRequestList.length !== 0 ? inboundRequestList : <span className="add--friend-text07 notselectable">You have no inbound requests</span>
    }

    const mapOutboundRequests = () => {
        const outboundRequests = props.userData.friends.outbound || {}
        const outboundRequestList = []

        for (const friendId in outboundRequests) {
            outboundRequestList.push(<Friend request={true} updateUserData={props.updateUserData} id={outboundRequests[friendId].id} avatar={outboundRequests[friendId].avatar} username={outboundRequests[friendId].username} discriminator={outboundRequests[friendId].discriminator} />)
        }

        return outboundRequestList.length !== 0 ? outboundRequestList : <span className="add--friend-text07 notselectable">You have no outbound requests</span>
    }

    const sendFriendRequest = () => {
        const message = toast.loading('Sending friend request...', { theme: 'dark', autoClose: false })
        const usernameVal = document.getElementById('username').value.split('#')
        if (usernameVal.length !== 2) {
            toast.update(message, { render: 'Invalid username', type: 'error', isLoading: false, theme: 'dark', autoClose: 2000 })
            return
        }

        const username = usernameVal[0]
        const discriminator = usernameVal[1]

        fetch(`${api_url}/friends?id=${encodeURIComponent(cookies.load('id'))}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            },
            body: JSON.stringify({
                username,
                discriminator
            })
        }).then((res) => {
            res.json().then((data) => {
                if (data.success) {
                    toast.update(message, { render: 'Friend request sent!', type: 'success', theme: 'dark', isLoading: false, autoClose: 2000 })
                    props.updateUserData()
                } else {
                    toast.update(message, { render: data.error, type: 'error', theme: 'dark',isLoading: false,  autoClose: 2000 })
                }
            });
        }).catch(() => {
            toast.update(message, { render: 'Failed to send friend request.', type: 'error', theme: 'dark', isLoading: false, autoClose: 2000 })
        })
    }

    return (
        <div className={`add--friend-content`}>
            <h1 className="add--friend-text notselectable">Add a Friend</h1>
            <span className="add--friend-text01 notselectable">
                <span className="">Add a friend or accept pending invites</span>
                <br className=""></br>
            </span>
            <div className="add--friend-container">
                <span className="add--friend-text04 notselectable">ADD FRIEND</span>
                <div className="add--friend-container1">
                    <input
                        type="text"
                        id="username"
                        required="true"
                        maxLength="37"
                        placeholder="john_doe#0001"
                        className="add--friend-textinput input"
                    />
                    <button
                        id="submit"
                        type="button"
                        onClick={sendFriendRequest}
                        className="add--friend-add button"
                    >
                        <span className="button__text add--friend-text05">Add Friend</span>
                    </button>
                </div>
            </div>
            <div className="add--friend-container2">
                <span className="add--friend-text06 notselectable">SENT INVITES</span>
                <div id="sent_invites" className="add--friend-sent-invites">
                    {mapOutboundRequests()}
                </div>
            </div>
            <div className="add--friend-container3">
                <span className="add--friend-text10 notselectable">
                  RECEIVED INVITES
                </span>
                <div id="received_invites" className="add--friend-received-invites">
                    {mapInboundRequests()}
                </div>
            </div>
        </div>
    )
}

export default AddAFriend
