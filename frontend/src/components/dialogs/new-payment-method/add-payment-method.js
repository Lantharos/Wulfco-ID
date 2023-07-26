import React from 'react'

import './add-payment-method.css'
import { motion } from 'framer-motion'

const AddPaymentMethod = (props) => {
  return (
    <div>
        <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

        <motion.div animate={{height: '197px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}} className="add-payment-method-container">
            <h1 className="add-payment-method-text notselectable">
                Add a new payment method
            </h1>
            <span className="add-payment-method-text1 notselectable">
                SELECT PAYMENT TYPE
            </span>
            <div className="add-payment-method-container1">
                <button
                    id="card"
                    type="button"
                    className="add-payment-method-save button"
                    onClick={() => { props.switchStage(2, {handler: 'stripe'}) }}
                >
                    <svg viewBox="0 0 1024 1024" className="add-payment-method-icon">
                        <path d="M128 128c-35.328 0-67.413 14.379-90.496 37.504s-37.504 55.168-37.504 90.496v512c0 35.328 14.379 67.413 37.504 90.496s55.168 37.504 90.496 37.504h768c35.328 0 67.413-14.379 90.496-37.504s37.504-55.168 37.504-90.496v-512c0-35.328-14.379-67.413-37.504-90.496s-55.168-37.504-90.496-37.504zM938.667 384h-853.333v-128c0-11.776 4.736-22.4 12.501-30.165s18.389-12.501 30.165-12.501h768c11.776 0 22.4 4.736 30.165 12.501s12.501 18.389 12.501 30.165zM85.333 469.333h853.333v298.667c0 11.776-4.736 22.4-12.501 30.165s-18.389 12.501-30.165 12.501h-768c-11.776 0-22.4-4.736-30.165-12.501s-12.501-18.389-12.501-30.165z"></path>
                    </svg>
                    <span className="add-payment-method-text2">Card</span>
                </button>
                <button
                    id="paypal"
                    type="button"
                    className="add-payment-method-save1 button"
                    onClick={() => { props.switchStage(2, {handler: 'paypal'}) }}
                >
                    <svg
                        viewBox="0 0 878.2994285714285 1024"
                        className="add-payment-method-icon2"
                    >
                        <path d="M868 369.143v0c7.429 34.286 5.714 73.714-2.286 116.571-37.143 188.571-162.286 253.714-322.857 253.714h-25.143c-19.429 0-35.429 14.286-38.857 33.714l-2.286 10.857-31.429 197.714-1.143 8.571c-4 19.429-20 33.714-39.429 33.714h-143.429c-16 0-26.286-13.143-24-29.143 10.286-64 20-128 30.286-192s20.571-127.429 30.857-191.429c1.714-13.714 10.857-21.143 24.571-21.143 22.857 0 45.714-0.571 74.857 0 41.143 0.571 88.571-1.714 134.857-12 61.714-13.714 117.714-38.857 164-82.286 41.714-38.857 69.714-86.857 88.571-140.571 8.571-25.143 15.429-50.286 20-76 1.143-6.857 2.857-5.714 6.857-2.857 31.429 23.429 49.143 54.857 56 92.571zM769.714 208c0 46.857-10.857 91.429-26.286 134.857-29.714 86.286-85.714 148-172.571 180-46.286 16.571-94.857 23.429-144 24-34.286 0.571-68.571 0-102.857 0-37.143 0-60.571 18.286-67.429 54.857-8 43.429-39.429 245.714-48.571 302.857-0.571 4-2.286 5.714-6.857 5.714h-168.571c-17.143 0-29.714-14.857-27.429-31.429l132.571-840.571c3.429-21.714 22.857-38.286 45.143-38.286h341.714c24.571 0 81.143 10.857 119.429 25.714 81.143 31.429 125.714 95.429 125.714 182.286z"></path>
                    </svg>
                    <span className="add-payment-method-text3">PayPal</span>
                </button>
            </div>
            <button
                id="close"
                type="button"
                className="add-payment-method-button button"
                onClick={() => { props.switchStage(0) } }
            >
                X
            </button>
        </motion.div>
    </div>
  )
}

export default AddPaymentMethod
