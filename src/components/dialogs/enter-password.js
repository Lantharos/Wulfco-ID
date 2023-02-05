import React from 'react'

import './enter-password.css'
import { motion } from 'framer-motion'

const EnterPassword = (props) => {
    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="enter-password-container" animate={{height: '250px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
                <h1 className="enter-password-text notselectable">Enter your password</h1>
                <div className="enter-password-container1">
                    <span className="enter-password-text1 notselectable">Password</span>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required="true"
                        autoFocus="true"
                        autoComplete="current-password"
                        className="enter-password-textinput input"
                    />
                </div>
                <div className="enter-password-container2">
                    <button
                        type="button"
                        id="cancel_password"
                        onClick={() => props.setEnterPassword({})}
                        className="enter-password-save button"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        id="confirm_password"
                        className="enter-password-save1 button"
                        onClick={() => {
                            props.setEnterPassword({})
                            props.enterPassword.after()
                        }}
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default EnterPassword
