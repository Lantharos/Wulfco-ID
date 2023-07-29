import React from 'react'
import { Link } from 'react-router-dom'

import './my-id.css'
import 'react-toastify/dist/ReactToastify.css';
import EditUsername from "../dialogs/edit-username";
import EditBirthday from "../dialogs/edit-birthday";
import {AnimatePresence} from 'framer-motion'
import {toast} from "react-toastify";
import ChangeEmailStep1 from "../dialogs/change-email/change-email-step1";
import ChangeEmailStep2 from "../dialogs/change-email/change-email-step2";
import ChangeEmailStep3 from "../dialogs/change-email/change-email-step3";
import cookies from 'react-cookies'
import hmac from 'crypto-js/hmac-sha256'
import EditName from "../dialogs/edit-name";

const config = require('../../config.json')
const api_url = config.api_url

const MyId = (props) => {
    const [ showEditUsername, setShowEditUsername ] = React.useState(false)
    const [ showEditBirthday, setShowEditBirthday ] = React.useState(false)
    const [ showEditName, setShowEditName ] = React.useState(false)
    const [ editEmail, setEditEmail ] = React.useState({stage: 0})

    const verifyIdentity = async() => {
        const message = toast.loading('Creating session...', { theme: 'dark', autoClose: false })
        await fetch((`${api_url}/verify-identity?id=${encodeURIComponent(cookies.load('id'))}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            }
        }).then((res) => {
            res.json().then((data) => {
                if (data.success) {
                    toast.update(message, {render: 'Session created', type: 'success', theme: 'dark', autoClose: 2000, isLoading: false});
                    window.location.href = data.url
                } else {
                    if (data.error === "too_many_attempts") {
                        toast.update(message, {render: 'Too many attempts. Please check your email.', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
                        props.updateUserData()
                        return;
                    }

                    toast.update(message, {render: 'Failed to create session', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false})
                }
            });
        })
    }

    const editEmailHandler = async(stage, data) => {
        if (stage === 0) {
            setEditEmail({stage: 0})
        } else if (stage === 1) {
            const message = toast.loading('Sending code...', { theme: 'dark', autoClose: false })
            await fetch((`${api_url}/email?stage=1&id=${encodeURIComponent(cookies.load('id'))}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                    'W-Session': cookies.load('session_id'),
                    'W-Loggen': cookies.load('loggen')
                }
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success) {
                        setEditEmail({stage: 2})
                        toast.update(message, {render: 'Code sent', type: 'success', theme: 'dark', autoClose: 2000, isLoading: false});
                    } else {
                        toast.update(message, {render: 'Failed to send code', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
                    }
                });
            }).catch(() => {
                toast.update(message, {render: 'Failed to send code', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
            });
        } else if (stage === 2) {
            const message = toast.loading('Verifying code...', { theme: 'dark', autoClose: false })
            await fetch((`${api_url}/email?stage=2&id=${encodeURIComponent(cookies.load('id'))}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                    'W-Session': cookies.load('session_id'),
                    'W-Loggen': cookies.load('loggen')
                },
                body: JSON.stringify({
                    code: data.code
                })
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success) {
                        setEditEmail({stage: 3})
                        toast.update(message, {render: 'Code verified', type: 'success', theme: 'dark', autoClose: 2000, isLoading: false});
                    } else {
                        toast.update(message, {render: 'Failed to verify code', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
                    }
                });
            }).catch(() => {
                toast.update(message, {render: 'Failed to verify code', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
            });
        } else if (stage === 3) {
            const message = toast.loading('Changing email...', { theme: 'dark', autoClose: false })
            await fetch((`${api_url}/email?stage=3&id=${encodeURIComponent(cookies.load('id'))}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                    'W-Session': cookies.load('session_id'),
                    'W-Loggen': cookies.load('loggen')
                },
                body: JSON.stringify({
                    email: btoa(data.email),
                    password: btoa(data.password)
                })
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success) {
                        toast.update(message, {render: 'Email changed', type: 'success', theme: 'dark', autoClose: 2000, isLoading: false});
                        setEditEmail({stage: 0})
                        props.updateUserData()
                    } else {
                        toast.update(message, {render: 'Failed to change email', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
                    }
                });
            }).catch(() => {
                toast.update(message, {render: 'Failed to change email', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
            });
        }
    }

    const resendEmail = async() => {
        const message = toast.loading('Sending code...', { theme: 'dark', autoClose: false })
        await fetch((`${api_url}/email?stage=1&id=${encodeURIComponent(cookies.load('id'))}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            }
        }).then((res) => {
            res.json().then((data) => {
                if (data.success) {
                    toast.update(message, {render: 'Code sent', type: 'success', theme: 'dark', autoClose: 2000, isLoading: false});
                } else {
                    toast.update(message, {render: 'Failed to send code', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
                }
            });
        }).catch(() => {
            toast.update(message, {render: 'Failed to send code', type: 'error', theme: 'dark', autoClose: 2000, isLoading: false});
        });
    }

    return (
        <div className={`my-id-content`}>
            <h1 className="my-id-text notselectable">My ID</h1>
            <div className="my-id-user-profile">
                <AnimatePresence>
                    {showEditUsername && <EditUsername setShowEditUsername={setShowEditUsername} userData={props.userData} updateUserData={props.updateUserData} />}
                    {showEditBirthday && <EditBirthday setShowEditBirthday={setShowEditBirthday} userData={props.userData} updateUserData={props.updateUserData} />}
                    {showEditName && <EditName setShowEditName={setShowEditName} userData={props.userData} updateUserData={props.updateUserData} />}
                    {(editEmail.stage === 1) && <ChangeEmailStep1 oldEmail={props.userData.email} handler={editEmailHandler}/>}
                    {(editEmail.stage === 2) && <ChangeEmailStep2 oldEmail={props.userData.email} resendCode={resendEmail} handler={editEmailHandler}/>}
                    {(editEmail.stage === 3) && <ChangeEmailStep3 oldEmail={props.userData.email} handler={editEmailHandler}/>}
                </AnimatePresence>
                <div id="background" className="my-id-background" style={{ backgroundColor: (props.userData.profile.profile_color) ? props.userData.profile.profile_color : "#1a63b9" }}></div>
                <div className="my-id-content1">
                    <div className="my-id-wrapper">
                        <div className="my-id-username-wrapper">
                            <span className="my-id-pointer notselectable">NAME</span>
                            <div className="my-id-container">
                                <h1
                                    id="name_profile"
                                    className="my-id-current-username notselectable"
                                >
                                    {props.userData.profile.full_name}
                                </h1>
                                <button
                                    id="verify_identity"
                                    type="button"
                                    className={`my-id-verify-age button ${props.userData.account.identity_verification ? (props.userData.account.identity_verification.status === "verified" ? "hidden" : "") : ""}`}
                                    onClick={verifyIdentity}
                                    hidden={props.userData.account.identity_verification ? (props.userData.account.identity_verification.status === "verified") : false}
                                    disabled={props.userData.account.identity_verification ? (props.userData.account.identity_verification.reason === "too_many_attempts") : false}
                                >
                                    <span className="button__text my-id-text04">Verify Identity</span>
                                </button>
                                <button
                                    id="edit_name"
                                    type="button"
                                    className="my-id-edit button"
                                    onClick={() => setShowEditName(true)}
                                >
                                    <span className="button__text my-id-text01">Edit</span>
                                </button>
                            </div>
                        </div>
                        <div className="my-id-username-wrapper1">
                            <span className="my-id-pointer1 notselectable">USERNAME</span>
                            <div className="my-id-container1">
                                <div className="my-id-container2">
                                    <h1
                                        id="username_profile"
                                        className="my-id-current-username1 notselectable"
                                    >
                                        {props.userData.profile.username}
                                    </h1>
                                    <h1
                                        id="discriminator_profile"
                                        className="my-id-current-discriminator notselectable"
                                    >
                                        #{props.userData.profile.discriminator}
                                    </h1>
                                </div>
                                <button
                                    id="edit_username"
                                    type="button"
                                    className="my-id-edit1 button"
                                    onClick={() => setShowEditUsername(true)}
                                >
                                    <span className="button__text my-id-text02">Edit</span>
                                </button>
                            </div>
                        </div>
                        <div className="my-id-email-wrapper">
                            <span className="my-id-pointer2 notselectable">EMAIL</span>
                            <div className="my-id-container3">
                                <h1
                                    id="email_profile"
                                    className="my-id-current-email notselectable"
                                >
                                    {props.userData.email}
                                </h1>
                                <button
                                    id="edit_email"
                                    type="button"
                                    className="my-id-edit2 button"
                                    onClick={() => setEditEmail({stage: 1})}
                                >
                                    <span className="button__text my-id-text03">Edit</span>
                                </button>
                            </div>
                        </div>
                        <div className="my-id-birthday-wrapper">
                            <span className="my-id-pointer3 notselectable">BIRTHDAY</span>
                            <div className="my-id-container4">
                                <h1
                                    id="birthday_profile"
                                    className="my-id-current-birthday notselectable"
                                >
                                    {props.userData.account.birthday ? `${new Date(props.userData.account.birthday).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : "Not set"}
                                </h1>
                                <button
                                    id="edit_bday"
                                    type="button"
                                    className="my-id-edit3 button"
                                    onClick={() => setShowEditBirthday(true)}
                                >
                                    <span className="button__text my-id-text04">Edit</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-id-info">
                    <div className="my-id-info1">
                        <img
                            id="pfp"
                            alt="image"
                            src={props.userData.profile.avatar}
                            className="my-id-image"
                        />
                        <h1 id="username_main" className="my-id-text06 notselectable">
                            {props.userData.profile.username}
                        </h1>
                        <h1 id="username_main" className="my-id-text07 notselectable">
                            <span>#{props.userData.profile.discriminator}</span>
                            <br></br>
                        </h1>
                    </div>
                </div>
            </div>
            <div className="my-id-reset-password-wrapper notselectable">
                <span className="my-id-pointer4 notselectable">PASSWORD</span>
                <Link
                    to="/reset-password"
                    className="my-id-reset-password button"
                >
                    <span>Reset Password</span>
                </Link>
            </div>
            <div className="my-id-i-removal-wrapper notselectable">
                <span className="my-id-pointer5 notselectable">ID REMOVAL</span>
                <span className="my-id-notice notselectable">Deleting your ID means deleting all of the data we have of you, AND the data in Wulfco Storage. If you delete your ID, you will lose everything you have on apps using Wulfco Storage. You cannot delete your account if you have a balance in your wallet.</span>
                <button
                    id="delete_data"
                    type="button"
                    className="my-id-delete-id button"
                    onClick={() => toast.info("This feature is not yet implemented", {theme: "dark"})}
                >
                    <span>Delete my Data</span>
                </button>
            </div>
        </div>
    )
}

export default MyId
