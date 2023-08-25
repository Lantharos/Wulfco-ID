import React from 'react'

import PropTypes from 'prop-types'

import PaymentMethod from './page_components/payment-method'
import Transaction from './page_components/transaction'
import './billing.css'
import {AnimatePresence} from 'framer-motion'
import {toast} from "react-toastify";
import cookies from 'react-cookies'
import hmac from 'crypto-js/hmac-sha256'
import AddPaymentMethod from "../dialogs/new-payment-method/add-payment-method";
import AddCard from "../dialogs/new-payment-method/add-card";
import AddPaypal from "../dialogs/new-payment-method/add-paypal";
import AddCardAddress from "../dialogs/new-payment-method/add-card-address";

const config = require('../../config.json')
const api_url = config.api_url

const Billing = (props) => {
    const [paymentMethodStage, setPaymentMethodStage] = React.useState(0)

    function toTitleCase( str )
    {
        return str.split(/\s+/).map( s => s.charAt( 0 ).toUpperCase() + s.substring(1).toLowerCase() ).join( " " );
    }

    const mapCards = () => {
        const cards = props.userData.account.billing ? props.userData.account.billing.cards : []

        if (cards.length === 0) return <h1 className="notselectable" style={{color: "#a2a2a2", fontSize: "20px", marginLeft: "4%"}}>No payment methods added</h1>

        return cards.map((card, index) => {
            const monthAbbreviation = new Date(`${card.card.exp_month}/1/${card.card.exp_year}`).toLocaleString('default', { month: 'short' });

            const formattedDate = `${monthAbbreviation} ${card.card.exp_year}`;

            return <PaymentMethod key={card.id} logo={"assets/" + card.card.brand.toLowerCase() + ".png"} name={toTitleCase(card.card.brand) + " ending in " + card.card.last4} details={"Expires " + formattedDate}></PaymentMethod>
        })
    }

    const mapTransactions = () => {
        const transactions = props.userData.account.billing ? props.userData.account.billing.transactions : []

        if (transactions.length === 0) return <h1 className="notselectable" style={{color: "#a2a2a2", fontSize: "20px", marginBottom: "2%"}}>No transactions</h1>

        return transactions.map((transaction, index) => {
            const date = new Date(transaction.created * 1000)
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

            return <Transaction key={index} date={formattedDate} name={transaction.description} amount={(transaction.amount / 100) + transaction.currency.toUpperCase()}></Transaction>
        })
    }

    const switchStage = async (nextStage, newData) => {
        if (nextStage === 0) return setPaymentMethodStage(0)

        if (paymentMethodStage === 1) {
            sessionStorage.setItem("registration_payment_handler", newData.handler)
            setPaymentMethodStage(nextStage)
        } else if (paymentMethodStage === 2) {
            sessionStorage.setItem("registration_payment_card", newData)
            setPaymentMethodStage(nextStage)
        } else if (paymentMethodStage === 3) {
            const messqge = toast.loading('Adding card...', {theme: 'dark'})
            const cardToken = sessionStorage.getItem("registration_payment_card")
            const addressElement = newData

            if (!cardToken || !addressElement) return toast.update(messqge, {type: 'error', render: 'Error adding card!', theme: 'dark', isLoading: false, autoClose: 5000})

                fetch(`${api_url}/payment-methods?id=${encodeURIComponent(cookies.load('id'))}&type=stripe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                        'W-Session': cookies.load('session_id'),
                        'W-Loggen': cookies.load('loggen'),
                    },
                    body: JSON.stringify({
                        cardToken: cardToken,
                        address: {
                            line1: addressElement.address.line1,
                            line2: addressElement.address.line2,
                            city: addressElement.address.city,
                            state: addressElement.address.state,
                            postal_code: addressElement.address.postal_code,
                            country: addressElement.address.country
                        }
                    })
                }).then(async (response) => {
                    if (response.status === 200) {
                        const responseJson = await response.json()
                        if (responseJson.success === false) {
                            toast.update(messqge, {type: 'info', render: 'Card is being processed. Check in later.', theme: 'dark', isLoading: false, autoClose: 5000})
                            setPaymentMethodStage(0)
                            await props.updateUserData()
                        } else {
                            toast.update(messqge, {type: 'success', render: 'Card added!', theme: 'dark', isLoading: false, autoClose: 5000})
                            setPaymentMethodStage(0)
                            await props.updateUserData()
                        }
                    } else if (response.status === 300) {
                        const responseJson = await response.json()
                        if (responseJson.requires_action.type === "redirect_to_url") {
                            toast.update(messqge, {type: 'info', render: 'Redirecting...', theme: 'dark', isLoading: false, autoClose: 5000})
                            window.location.href = responseJson.requires_action.redirect_to_url.url
                        } else {
                            toast.update(messqge, {type: 'info', render: 'Unknown action required, contact support.', theme: 'dark', isLoading: false, autoClose: 5000})
                        }
                    } else {
                        toast.update(messqge, {type: 'error', render: 'Error adding card!', theme: 'dark', isLoading: false,autoClose:5000})
                    }
                })
        }
    }

    return (
        <div className="billing-content">
            <div className="billing-container">
                <AnimatePresence initial exitBeforeEnter>
                    {paymentMethodStage === 1 && <AddPaymentMethod switchStage={switchStage}/> }
                    {paymentMethodStage === 2 && sessionStorage.getItem('registration_payment_handler') === 'stripe' && <AddCard switchStage={switchStage}/>}
                    {paymentMethodStage === 2 && sessionStorage.getItem('registration_payment_handler') === 'paypal' && <AddPaypal switchStage={switchStage}/>}
                    {paymentMethodStage === 3 && <AddCardAddress switchStage={switchStage}/> }
                </AnimatePresence>
                <div id={"card-element"}></div>
                <svg viewBox="0 0 1024 1024" className="billing-icon">
                    <path d="M725.333 426.667h-42.667v-85.333c0-94.080-76.544-170.667-170.667-170.667s-170.667 76.587-170.667 170.667v85.333h-42.667c-47.061 0-85.333 38.229-85.333 85.333v298.667c0 47.104 38.272 85.333 85.333 85.333h426.667c47.061 0 85.333-38.229 85.333-85.333v-298.667c0-47.104-38.272-85.333-85.333-85.333zM512 780.757c-30.677 0-55.467-24.747-55.467-55.424s24.789-55.509 55.467-55.509 55.467 24.832 55.467 55.509-24.789 55.424-55.467 55.424zM597.333 469.333h-170.667v-128c0-47.104 38.272-85.333 85.333-85.333s85.333 38.229 85.333 85.333v128z"></path>
                </svg>
                <h1 className="billing-text notselectable">
                    <span>Payment Methods</span>
                    <br></br>
                </h1>
            </div>
            <div className="billing-container1">
                {mapCards()}
                <button
                    id="add_payment_method"
                    type="button"
                    className="billing-add button"
                    onClick={() => setPaymentMethodStage(1)}
                >
                    Add Payment Method
                </button>
            </div>
            <h1 className="billing-text03 notselectable">
                <span>Transaction History</span>
                <br></br>
            </h1>
            <div className="billing-container2">
                <div className="billing-container3">
                    <h1 className="billing-text06">Date</h1>
                    <h1 className="billing-text07">Description</h1>
                    <h1 className="billing-text08">Amount</h1>
                </div>
                {mapTransactions()}
            </div>
            <span className="billing-text09">
                Your payment details, including card numbers, cardholder names,
                expiration dates, CVCs, and addresses, are not stored by Wulfco. All
                payments are securely outsourced to Stripe for processing and storage,
                ensuring the highest level of data protection.
            </span>
        </div>
    )
}

Billing.defaultProps = {
    rootClassName: '',
}

Billing.propTypes = {
    rootClassName: PropTypes.string,
}

export default Billing