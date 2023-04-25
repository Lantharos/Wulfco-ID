import React from 'react'

import './change-email-step3.css'
import {motion} from 'framer-motion'

const ChangeEmailStep3 = (props) => {
    const handleSubmit = () => {
        const email = document.getElementById("email_new").value
        const password = document.getElementById("password").value

        props.handler(3, {email: email, password: password})
    }

    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="change-email-step3-container" key={"finish"} initial={{ x: "-100vh", opacity: 0 }} animate={{ x: "0vh", opacity: 1, transition: {
                    duration: 0.5,
                    type: "spring",
                    stiffness: 500,
                    damping: 25
                } }} exit={{ x: "100vh", opacity: 0 }}>
                <h1 className="change-email-step3-text notselectable">
                    Enter an email address
                </h1>
                <span className="change-email-step3-text1 notselectable">
                <span>Enter a new email address and your password.</span>
                <br></br>
                </span>
                <div className="change-email-step3-container1">
                    <button
                        id="cancel"
                        type="button"
                        className="change-email-step3-save button"
                        onClick={() => props.handler(0, {})}
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm"
                        type="button"
                        className="change-email-step3-save1 button"
                        onClick={() => handleSubmit()}
                    >
                        Confirm
                    </button>
                </div>
                <div className="change-email-step3-container2">
                    <span className="change-email-step3-text4 notselectable">Email</span>
                    <input
                        type="text"
                        id="email_new"
                        name="email_new"
                        required="true"
                        autoComplete="email"
                        className="change-email-step3-textinput input"
                    />
                </div>
                <div className="change-email-step3-container3">
                <span className="change-email-step3-text5 notselectable">
                  Current Password
                </span>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        minLength={10}
                        maxLength={20}
                        passwordrules="minlength: 10; maxlength: 20; required: lower; required: upper; required: digit; required: [!,@];"
                        required
                        placeholder={"••••••••••••••••••"}
                        autoComplete="current-password"
                        className="change-email-step3-textinput1 input"
                    />
                </div>
            </motion.div>
        </div>
    )
}

export default ChangeEmailStep3
