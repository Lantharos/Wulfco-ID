import React from 'react'

import './add-card.css'
import { motion } from 'framer-motion'
import {toast} from "react-toastify";

const AddCard = (props) => {
    const submit = async () => {
        const card_number = document.getElementById('card_number')
        const exp_date = document.getElementById('exp_date')
        const csc = document.getElementById('csc')
        const name = document.getElementById('name')

        if (window.Stripe.validateCardNumber(card_number.value) !== true) return toast.error('Invalid card number!')
        if (window.Stripe.validateExpiry(exp_date.value.split('/')[0], exp_date.value.split('/')[1]) !== true) return toast.error('Invalid expiration date!')
        if (window.Stripe.validateCVC(csc.value) !== true) return toast.error('Invalid CVC!')

        await props.switchStage(3, { card: { number: card_number.value, exp_month: exp_date.value.split('/')[0], exp_year: exp_date.value.split('/')[1], cvc: csc.value, cardholderName: name.value } })
    }

  return (
    <div>
        <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

        <motion.div animate={{height: '458px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}} className="add-card-container">
            <h1 className="add-card-text notselectable">Add a new payment method</h1>
            <div className="add-card-container1">
                <span className="add-card-text1 notselectable">CARD NUMBER</span>
                <input
                    type="text"
                    id="card_number"
                    required="true"
                    autoFocus="true"
                    placeholder="4242 4242 4242 4242"
                    autoComplete="cc-number"
                    className="add-card-textinput input"
                />
            </div>
            <div className="add-card-container2">
                <div className="add-card-container3">
                    <span className="add-card-text2 notselectable">EXPIRATION DATE</span>
                    <input
                        type="text"
                        id="exp_date"
                        pattern="\\d&#123;2&#125;/\\d&#123;4&#125;"
                        required="true"
                        autoFocus="true"
                        placeholder="MM/YYYY"
                        autoComplete="cc-exp"
                        className="add-card-textinput1 input"
                    />
                </div>
                <div className="add-card-container4">
                    <span className="add-card-text3 notselectable">CSC</span>
                    <input
                        type="text"
                        id="csc"
                        required="true"
                        autoFocus="true"
                        placeholder="123"
                        autoComplete="cc-csc"
                        className="add-card-textinput2 input"
                    />
                </div>
            </div>
            <div className="add-card-container5">
                <button
                    id="cancel_username"
                    onClick={() => { props.switchStage(0) }}
                    type="button"
                    className="add-card-save button"
                >
                    Cancel
                </button>
                <button
                    id="confirm_username"
                    type="button"
                    className="add-card-save1 button"
                    onClick={submit}
                >
                    Next
                </button>
            </div>
            <div className="add-card-container6">
                <span className="add-card-text4 notselectable">NAME ON THE CARD</span>
                <input
                    type="text"
                    id="name"
                    required="true"
                    autoFocus="true"
                    placeholder="John Doe"
                    autoComplete="cc-name"
                    className="add-card-textinput3 input"
                />
            </div>
        </motion.div>
    </div>
  )
}

export default AddCard
