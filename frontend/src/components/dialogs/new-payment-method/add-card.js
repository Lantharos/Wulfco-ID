import React from 'react'

import './add-card.css'
import { motion } from 'framer-motion'
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

const config = require('../../../config.json')

const AddCardForm = (switchStage) => {
    const stripe = useStripe();
    const elements = useElements();

    const submit = async () => {
        if (!stripe || !elements) return;
        const {token, error} = await stripe.createToken(elements.getElement(CardNumberElement), {name: document.getElementById("cardholder_name").value});

        if (error) { console.log(error); return; } else {
            switchStage.switchStage(3, token.id)
        }
    };

    return (
        <div style={{ width: "95%", height: "95%"}}>
            <div className="add-card-container1">
                <span className="add-card-text1 notselectable">CARD NUMBER</span>
                <CardNumberElement
                    options={{
                        placeholder: '4242 4242 4242 4242',
                        classes: { base: 'add-card-textinput input' },
                        style: {
                            base: { color: "#ffffff", fontSize: '17px', iconColor: '#ffffff' },
                            invalid: { color: "#ff3f3f", iconColor: '#ff3f3f' }
                        },
                        showIcon: true
                    }}
                />
            </div>
            <div className="add-card-container2">
                <div className="add-card-container3">
                    <span className="add-card-text2 notselectable">EXPIRATION DATE</span>
                    <CardExpiryElement
                        options={{
                            placeholder: 'MM/YY',
                            classes: { base: 'add-card-textinput1 input' },
                            style: {
                                base: { color: "#ffffff", fontSize: '17px' },
                                invalid: { color: "#ff3f3f", iconColor: '#ff3f3f' }
                            },
                        }}
                    />
                </div>
                <div className="add-card-container4">
                    <span className="add-card-text3 notselectable">CSC</span>
                    <CardCvcElement
                        options={{
                            placeholder: '123',
                            classes: { base: 'add-card-textinput2 input' },
                            style: {
                                base: { color: "#ffffff", fontSize: '17px' },
                                invalid: { color: "#ff3f3f", iconColor: '#ff3f3f' }
                            },
                        }}
                    />
                </div>
            </div>
            <div className="add-card-container5">
                <button id="cancel" onClick={() => { switchStage.switchStage(0) }} type="button" className="add-card-save button">
                    Cancel
                </button>
                <button id="confirm" type="button" className="add-card-save1 button" onClick={submit}>
                    Next
                </button>
            </div>
            <div className="add-card-container6">
                <span className="add-card-text4 notselectable">NAME ON THE CARD</span>
                <input
                    type="text"
                    id="cardholder_name"
                    required="true"
                    autoFocus="true"
                    placeholder="John Doe"
                    autoComplete="cc-name"
                    className="add-card-textinput3 input"
                />
            </div>
        </div>
    );

}

const AddCard = (props) => {
  const stripePromise = loadStripe(config.stripe_key)

  return (
    <div>
        <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

        <motion.div animate={{height: '458px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}} className="add-card-container">
            <h1 className="add-card-text notselectable">Add a new payment method</h1>
            <Elements stripe={stripePromise} options={{mode: 'setup', currency: 'eur'}}>
                <AddCardForm switchStage={props.switchStage}></AddCardForm>
            </Elements>
        </motion.div>
    </div>
  )
}

export default AddCard
