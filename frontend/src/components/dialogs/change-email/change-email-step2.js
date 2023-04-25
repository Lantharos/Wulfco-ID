import React from 'react'

import './change-email-step2.css'
import {motion} from 'framer-motion'

const ChangeEmailStep2 = (props) => {
    const handleSubmit = () => {
        const code = document.getElementById("code").value

        props.handler(2, {code: code})
    }

    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="change-email-step2-container" key={"continue"} initial={{ x: "-100vh", opacity: 0 }} animate={{ x: "0vh", opacity: 1, transition: {
                    duration: 0.5,
                    type: "spring",
                    stiffness: 500,
                    damping: 25
                } }} exit={{ x: "100vh", opacity: 0 }}>
                <h1 className="change-email-step2-text notselectable">Enter code</h1>
                <span className="change-email-step2-text1 notselectable">
                <span>Check your email; we sent you a code. Enter it</span>
                <br></br>
                <span>to verify yourself.</span>
                <br></br>
            </span>
                <div className="change-email-step2-container1">
                    <button
                        id="cancel"
                        type="button"
                        className="change-email-step2-save button"
                        onClick={() => props.handler(0, {})}
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm"
                        type="button"
                        className="change-email-step2-save1 button"
                        onClick={() => handleSubmit()}
                    >
                        Confirm
                    </button>
                </div>
                <div className="change-email-step2-container2">
            <span className="change-email-step2-text6 notselectable">
              Verification Code
            </span>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        required="true"
                        autoComplete="off"
                        className="change-email-step2-textinput input"
                    />
                    <a
                        rel="noreferrer noopener"
                        className="change-email-step2-link"
                        style={{cursor: "pointer"}}
                        onClick={() => props.resendCode()}
                    >
                        Didn&apos;t receive a code? Resend it.
                    </a>
                </div>
            </motion.div>
        </div>
    )
}

export default ChangeEmailStep2
