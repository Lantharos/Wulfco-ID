import React from 'react'

import './confirmation-dialog.css'
import { motion } from 'framer-motion'

const ConfirmationDialog = (props) => {
    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div className="confirmation-dialog-container" animate={{height: '193px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
                <h1 className="confirmation-dialog-text notselectable">
                    {props.title}
                </h1>
                <span className="confirmation-dialog-text1 notselectable">
                    <span>{props.message}</span>
                </span>
                <div className="confirmation-dialog-container1">
                    <button
                        id="cancel"
                        type="button"
                        className="confirmation-dialog-save button"
                        onClick={() => props.setConfirmDeauthorize({})}
                    >
                        No
                    </button>
                    <button
                        id="confirm"
                        type="button"
                        className="confirmation-dialog-save1 button"
                        onClick={() => { props.confirmDeauthorize.after(); props.setConfirmDeauthorize({}) }}
                    >
                        Yes
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

const defaultProps = {
    title: 'DEAUTHORIZE APPLICATION',
    message: 'This will remove the link between your ID and the application.'
}

ConfirmationDialog.defaultProps = defaultProps

export default ConfirmationDialog
