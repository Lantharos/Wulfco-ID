import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './summary.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import cookies from 'react-cookies'
import hmac from 'crypto-js/hmac-sha256'
import {AnimatePresence} from "framer-motion";
import Loading from "../../components/pages/page_components/loading";

const config = require('../../config.json')
const api_url = config.api_url

const Summary = () => {
    const [ userData, setUserData ] = React.useState({
        profile: { avatar: "", username: "John Doe" },
        account: { security: { protected: false } }
    })

    const [loading, setLoading] = React.useState(true);

    function logout() {
        const message = toast.loading('Logging out...', { theme: 'dark', autoClose: false })
        fetch(`${api_url}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Reason': 'logout'
            },
            body: JSON.stringify({
                uuid: cookies.load('id'),
                session: cookies.load('session_id'),
                loggen: cookies.load('loggen')
            })
        }).then((res) => {
            if (res.status === 200) {
                toast.dismiss(message)
                cookies.remove('token')
                cookies.remove('id')
                cookies.remove('secret')
                cookies.remove('loggen')
                cookies.remove('session_id')

                window.location.href = '/login'
            } else {
                toast.error("Something went wrong, please try again later", { theme: "dark" })
            }
        }).catch(() => {
            toast.error("Something went wrong, please try again later", { theme: "dark" })
        })
    }

    const loadUserData = async () => {
        fetch(`${api_url}/get?id=${encodeURIComponent(cookies.load("id"))}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            }
        }).then((res) => {
            res.json().then((data) => {
                if (data.success) {
                    setUserData(data.user)
                    setLoading(false)
                } else {
                    toast.error("Something went wrong, please try again later", { theme: "dark" })
                }
            })
        })
    }

    const is2FAEnabled = () => {
        if (userData.account.security) {
            return userData.account.security.protected;
        } else {
            return false
        }
    }

    React.useEffect(() => {
        loadUserData();
    }, []);

    return (
        <div>
            <AnimatePresence>
                {loading && (<Loading />)}
            </AnimatePresence>
            <div className="summary-container">
                <ToastContainer />
                <Helmet>
                    <title>Summary</title>
                    <meta
                        name="description"
                        content="Wulfco ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC."
                    />
                    <meta property="og:title" content="Summary - VikkiVuk ID" />
                    <meta
                        property="og:description"
                        content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
                    />
                    <meta
                        property="og:image"
                        content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
                    />
                </Helmet>

                <div className="summary-container1">
                    <img
                        id="pfp"
                        alt={"Avatar"}
                        src={userData.profile.avatar}
                        className="summary-image"
                    />
                    <div className="summary-name">
                        <span className="summary-text">Hello there,</span>
                        <h1 className="summary-text01">{userData.profile.username}</h1>
                    </div>
                    <Link to="/account-settings" className="summary-navlink button">
                        <svg viewBox="0 0 1024 1024" className="summary-icon">
                            <path d="M512 662q62 0 106-44t44-106-44-106-106-44-106 44-44 106 44 106 106 44zM830 554l90 70q14 10 4 28l-86 148q-8 14-26 8l-106-42q-42 30-72 42l-16 112q-4 18-20 18h-172q-16 0-20-18l-16-112q-38-16-72-42l-106 42q-18 6-26-8l-86-148q-10-18 4-28l90-70q-2-14-2-42t2-42l-90-70q-14-10-4-28l86-148q8-14 26-8l106 42q42-30 72-42l16-112q4-18 20-18h172q16 0 20 18l16 112q38 16 72 42l106-42q18-6 26 8l86 148q10 18-4 28l-90 70q2 14 2 42t-2 42z"></path>
                        </svg>
                    </Link>
                </div>
                <div className="summary-container2">
                    <div className="summary-container3">
                        <svg viewBox="0 0 1024 1024" className="summary-icon2" fill={(is2FAEnabled()) ? "#32A94C" : "#E14747"}>
                            <path d="M512 42l384 172v256q0 178-110 325t-274 187q-164-40-274-187t-110-325v-256zM512 512v382q118-38 200-143t98-239h-298zM512 512v-376l-298 132v244h298z"></path>
                        </svg>
                        <div className="summary-name1">
                            <h1 className="summary-text02">Security</h1>
                            <span className="summary-text03">
                            <span>Your account {(is2FAEnabled()) ? "is" : "is NOT"} protected by 2FA.</span>
                        </span>
                        </div>
                    </div>
                    <div className="summary-container4">
                        <svg viewBox="0 0 1024 1024" className="summary-icon4">
                            <path d="M768 682l86 86v42h-684v-42l86-86v-212q0-100 51-174t141-96v-30q0-26 18-45t46-19 46 19 18 45v30q90 22 141 96t51 174v212zM512 938q-36 0-61-24t-25-60h172q0 34-26 59t-60 25z"></path>
                        </svg>
                        <div className="summary-name2">
                            <h1 className="summary-text09">Alerts</h1>
                            <span className="summary-text10">See what&apos;s up.</span>
                        </div>
                        <button className="summary-logout button" onClick={() => { toast.info("This feature is not available yet.", { theme: 'dark' }) }}>
                            -&gt;
                        </button>
                    </div>
                </div>
                <div className="summary-container5">
                    <div className="summary-name3">
                        <h1 className="summary-text11">Looking for Help?</h1>
                        <span className="summary-text12">
                        <span>If you got lost or need help please contact us</span>
                        <br></br>
                        <span>on our support site.</span>
                    </span>
                    </div>
                    <button className="summary-logout1 button" onClick={() => { toast.info("This feature is not available yet.", { theme: 'dark' }) }}>
                        -&gt;
                    </button>
                </div>

                <button
                    className="summary-logout2 button"
                    onClick={() => { logout() }}
                >
                    &lt;- Log out
                </button>
                <div className="summary-screen-sizew">
                    <h1 className="summary-text20 notselectable">
                        <span className="summary-text21">Sorry but...</span>
                    </h1>
                    <h1 className="summary-text22">
                      <span>
                        So sorry, but currently we only support Desktop or any Desktop Sized
                        Screen,
                      </span>
                      <br></br>
                      <span>
                        this is due to overflow and rendering issues, this might be removed
                        in the future.
                      </span>
                    </h1>
                    <a
                        href="/"
                        target="_self"
                        rel="noreferrer noopener"
                        className="summary-link button"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Summary
