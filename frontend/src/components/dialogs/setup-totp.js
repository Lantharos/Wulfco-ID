import React from 'react'

import './setup-totp.css'
import QRCodeStyling from "qr-code-styling";
import {motion} from 'framer-motion'
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";

const config = require('../../config.json')
const api_url = config.api_url

const SetupTOTP = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState({});
    const qrRef = React.useRef(null);

    const setQR = (qrData) => {
        const qr = new QRCodeStyling({
            width: 148,
            height: 148,
            data: qrData,
            margin: 4,
            qrOptions: {typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q"},
            imageOptions: {hideBackgroundDots: true, imageSize: 0.5, margin: 0},
            dotsOptions: {
                type: "extra-rounded",
                gradient: {type: "linear", colorStops: [ {offset: 0, color: "#000000"}, {offset: 1, color: "#000000"} ], rotation: 0}
            },
            backgroundOptions: {
                color: "#FFFFFF"
            },
            image: "assets/strike.png",
            cornersSquareOptions: {
                type: "extra-rounded",
                gradient: {type: "linear", rotation: 0, colorStops: [ {offset: 0, color: "#ff4444"}, {offset: 1, color: "#ff2344"} ]}
            },
            cornersDotOptions: {
                type: "dot",
                gradient: {type: "linear", rotation: 0, colorStops: [ {offset: 0, color: "#ff4444"}, {offset: 1, color: "#ff2344"} ]}
            }
        });

        qr.append(qrRef.current);
    }

    const enableTOTP = async() => {
        const code = document.getElementById('code').value;
        if (code.length !== 6) { return; }
        const loadingToast = toast.loading('Enabling TOTP...', { theme: 'dark', autoClose: false });

        await fetch(`${api_url}/totp?id=${encodeURIComponent(cookies.load('id'))}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            },
            body: JSON.stringify({ token: code })
        }).then(async (res) => {
            if (res.status === 200) {
                toast.update(loadingToast, { render: 'TOTP enabled successfully!', type: 'success', isLoading: false, autoClose: 3000, theme: 'dark' });
                props.updateUserData();
                props.setShowTOTPSetup(false);
            } else {
                toast.update(loadingToast, { render: 'An error occurred while trying to enable TOTP. Please try again later.', type: 'error', isLoading: false, autoClose: 3000, theme: 'dark' });
            }
        }).catch((err) => {
            toast.update(loadingToast, { render: 'An error occurred while trying to enable TOTP. Please try again later.', type: 'error', isLoading: false, autoClose: 3000, theme: 'dark' });
        })
    }

    React.useEffect(() => {
        fetch(`${api_url}/totp?id=${encodeURIComponent(cookies.load('id'))}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                'W-Session': cookies.load('session_id'),
                'W-Loggen': cookies.load('loggen')
            },
        }).then(async (res) => {
            if (res.status === 200) {
                setLoading(false);

                const data = await res.json();
                setData(data);
                setQR(data.qr);
            } else {
                toast.error("An error occurred while trying to get your TOTP Secret. Please try again later.");
                setLoading(false);
            }
        }).catch((err) => {
            toast.error("An error occurred while trying to get your TOTP Secret. Please try again later.");
            setLoading(false);
        })
    }, [])

    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="setup-totp-container" animate={{height: '652px', width: '683px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
                {loading ? <div>
                    <motion.a animate={{opacity: [1, 0.5, 0], scale: [3, 3.2, 3],}} transition={{ duration: 0.6, repeat: Infinity }} style={{ color: "#ffffff", fontFamily: "Roboto", display: "inline-flex", marginRight: "0.5em", fontSize: "24px", cursor: "default", userSelect: "none" }}>.</motion.a>
                    <motion.a animate={{opacity: [0, 1, 0.5], scale: [3, 3, 3.2],}} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} style={{ color: "#ffffff", fontFamily: "Roboto", display: "inline-flex", marginRight: "0.5em", fontSize: "24px", cursor: "default", userSelect: "none" }}>.</motion.a>
                    <motion.a animate={{opacity: [0.5, 0, 1], scale: [3.2, 3, 3],}} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} style={{ color: "#ffffff", fontFamily: "Roboto", display: "inline-flex", marginRight: "0.5em", fontSize: "24px", cursor: "default", userSelect: "none" }}>.</motion.a>
                </div> : <div className="setup-totp-container01">
                    <h1 className="setup-totp-text notselectable">Enable TOTP</h1>
                    <span className="setup-totp-text01">
                      Make your account safer in these 3 easy steps.
                    </span>
                    <div className="setup-totp-container02">
                        <img
                            src="/assets/authenticator.png"
                            alt="image"
                            className="setup-totp-image"
                        />
                        <div className="setup-totp-container03">
                            <h1 className="setup-totp-text02 notselectable">
                                DOWNLOAD AN AUTHENTICATOR APP
                            </h1>
                            <span className="setup-totp-text03">
                              Download and install Wulfco Authenticator or Google Authenticator
                              for your phone or tablet.
                            </span>
                        </div>
                    </div>
                    <div className="setup-totp-container04">
                        <div ref={qrRef} className={"setup-totp-image1"} />
                        <div className="setup-totp-container05">
                            <div className="setup-totp-container06">
                                <h1 className="setup-totp-text04 notselectable">
                                    SCAN THE QR CODE
                                </h1>
                                <span className="setup-totp-text05">
                                    Open the Authenticator app and scan the image on the left using
                                    your phone&apos;s camera.
                                </span>
                            </div>
                            <div className="setup-totp-container07">
                                <h1 className="setup-totp-text06 notselectable">
                                    2FA KEY (MANUAL ENTRY)
                                </h1>
                                <span className="setup-totp-text07">{data.secret}</span>
                            </div>
                        </div>
                    </div>
                    <div className="setup-totp-container08">
                        <div className="setup-totp-container09">
                            <img
                                src="/assets/phone.png"
                                alt="image"
                                className="setup-totp-image2"
                            />
                        </div>
                        <div className="setup-totp-container10">
                            <div className="setup-totp-container11">
                                <h1 className="setup-totp-text08 notselectable">
                                    LOG IN WITH YOUR CODE
                                </h1>
                                <span className="setup-totp-text09">
                                    Enter the 6-digit code generated.
                                </span>
                            </div>
                            <div className="setup-totp-container12">
                                <input
                                    type="number"
                                    id="code"
                                    required="true"
                                    autoFocus="true"
                                    placeholder="000 000"
                                    autoComplete="one-time-code"
                                    className="setup-totp-textinput input"
                                />
                                <button
                                    id="confirm_code"
                                    type="button"
                                    className="setup-totp-save button"
                                    onClick={enableTOTP}
                                >
                                    Activate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
            </motion.div>
        </div>
    )
}

export default SetupTOTP
