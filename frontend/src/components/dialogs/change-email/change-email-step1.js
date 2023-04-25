import React from 'react'

import './change-email-step1.css'
import {motion} from 'framer-motion'

const ChangeEmailStep1 = (props) => {
    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="change-email-step1-container" key={"start"} initial={{ x: "-100vh", opacity: 0 }} animate={{ x: "0vh", opacity: 1, transition: {
                    duration: 0.5,
                    type: "spring",
                    stiffness: 500,
                    damping: 25
                } }} exit={{ x: "100vh", opacity: 0 }}>
                <h1 className="change-email-step1-text notselectable">
                    Verify email address
                </h1>
                <span className="change-email-step1-text01 notselectable">
                <span>We&apos;ll need to verify your old email address,</span>
                <br></br>
                <span style={{fontWeight: 600}}>
                  {props.oldEmail}
                </span>
                <br></br>
                <span>in order to change it.</span>
                <br></br>
                <br></br>
                <span>Lost access to your email? Please contact</span>
                <br></br>
                <span>your email provider to regain access.</span>
                <br></br>
              </span>
                <button
                    id="confirm_username"
                    type="button"
                    className="change-email-step1-save button"
                    onClick={() => { props.handler(1, {}) } }
                >
                    Send Verification Code
                </button>
                <button
                    id="cancel_username"
                    type="button"
                    className="change-email-step1-save1 button"
                    onClick={() => { props.handler(0, {}) } }
                >
                    Cancel
                </button>
            </motion.div>
        </div>
    )
}

export default ChangeEmailStep1
