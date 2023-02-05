import React from 'react'

import './edit-username.css'
import { motion } from 'framer-motion'

const EditUsername = (props) => {
    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="edit-username-container" animate={{height: '357px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
                <h1 className="edit-username-text notselectable">Change your username</h1>
                <span className="edit-username-text1 notselectable">Enter a new username and your existing password</span>
                <div className="edit-username-container1">
                    <span className="edit-username-text2 notselectable">Username</span>
                    <input
                        type="text"
                        id="username_new"
                        name="username_new"
                        required="true"
                        autoComplete="username"
                        className="edit-username-textinput input"
                    />
                </div>
                <div className="edit-username-container2">
                    <span className="edit-username-text3 notselectable">Password</span>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required="true"
                        autoComplete="current-password"
                        className="edit-username-textinput1 input"
                    />
                </div>
                <div className="edit-username-container3">
                    <button
                        id="cancel_username"
                        type="button"
                        className="edit-username-save button"
                        onClick={() => props.setShowEditUsername(false)}
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm_username"
                        type="button"
                        className="edit-username-save1 button"
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default EditUsername
