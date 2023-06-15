import React from 'react'

import './add--friend.css'
import Friend from "./page_components/friend";
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";

const config = require('../../config.json')
const api_url = config.api_url

const Blocked = (props) => {
    const mapBlocked = () => {
        const blocked = props.userData.friends.blocked || {}
        const blockedList = []

        for (const friendId in blocked) {
            blockedList.push(<Friend updateUserData={props.updateUserData} blocked={true} id={blocked[friendId].id} avatar={blocked[friendId].avatar} username={blocked[friendId].username} discriminator={blocked[friendId].discriminator} />)
        }

        return blockedList.length !== 0 ? blockedList : <span className="add--friend-text07 notselectable">You have no one blocked :)</span>
    }

    const block = () => {
        const message = toast.loading('Blocking...', { theme: 'dark', autoClose: false })
        const usernameVal = document.getElementById('username').value.split('#')
        if (usernameVal.length !== 2) {
            toast.update(message, { render: 'Invalid username', type: 'error', isLoading: false, theme: 'dark', autoClose: 2000 })
            return
        }

        const username = usernameVal[0]
        const discriminator = usernameVal[1]

        fetch(`${api_url}/block?id=${encodeURIComponent(cookies.load('id'))}`, {
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
                    toast.update(message, { render: 'Blocked!', type: 'success', theme: 'dark', isLoading: false, autoClose: 2000 })
                    props.updateUserData()
                } else {
                    toast.update(message, { render: data.error, type: 'error', theme: 'dark',isLoading: false,  autoClose: 2000 })
                }
            });
        }).catch(() => {
            toast.update(message, { render: 'Failed to block.', type: 'error', theme: 'dark', isLoading: false, autoClose: 2000 })
        })
    }

    return (
        <div className={`add--friend-content`}>
            <h1 className="add--friend-text notselectable">Blocked</h1>
            <span className="add--friend-text01 notselectable">
                <span className="">Block someone or see everyone who's blocked.</span>
                <br className=""></br>
            </span>
            <div className="add--friend-container">
                <span className="add--friend-text04 notselectable">BLOCK</span>
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
                        onClick={block}
                        className="add--friend-add button"
                    >
                        <span className="button__text add--friend-text05">Block</span>
                    </button>
                </div>
            </div>
            <div className="add--friend-container3">
                <span className="add--friend-text10 notselectable">
                  ALREADY BLOCKED
                </span>
                <div id="received_invites" className="add--friend-received-invites">
                    {mapBlocked()}
                </div>
            </div>
        </div>
    )
}

export default Blocked
