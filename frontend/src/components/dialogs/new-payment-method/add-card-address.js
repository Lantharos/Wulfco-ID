import React from 'react'

import './add-card-address.css'
import { motion } from 'framer-motion'
import {toast} from "react-toastify";
import {Elements, useStripe, useElements, AddressElement} from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

const AddCardAddressForm = (props) => {
    const stripe = useStripe()
    const elements = useElements()

    const submit = async () => {
        if (!stripe || !elements) return;
        const element = await elements.getElement(AddressElement).getValue().then((result) => {
            console.log(result)
            return result
        })

        if (element === null) return toast.error("Please fill in all fields", {theme: 'dark'})
        if (element.complete === false) return toast.error("Please check all fields", {theme: 'dark'})

        props.switchStage(4, element.value)
    }

    return (
        <div>
            <AddressElement options={{
                mode: 'billing',
                blockPoBox: true
            }}/>
            <div className="add-card-address-container2">
                <button
                    id="cancel_username"
                    type="button"
                    className="add-card-address-save button"
                    onClick={() => { props.switchStage(0) }}
                >
                    Cancel
                </button>
                <button
                    id="confirm_username"
                    type="button"
                    className="add-card-address-save1 button"
                    onClick={submit}
                >
                    Done
                </button>
            </div>
        </div>
    )
}

const AddCardAddress = (props) => {
    const stripePromise = loadStripe("pk_test_51NU6p5D4hW6MEhWIoHlqqIB6qu8jj7BIb74wkXvdtYajmwFxvZWajzEM1HRJbnxXsLTwTKnSeNHi4zjrHomCMntx00LdyxmXvi")

    return (
        <div>
            <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

            <motion.div animate={{height: '730px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}} className="add-card-address-container">
                <h1 className="add-card-address-text notselectable">
                    Add a new payment method
                </h1>

                <div style={{height: "auto", width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", marginTop: "5%"}}>
                    <Elements stripe={stripePromise} options={{
                        fonts: [{cssSrc: "https://fonts.googleapis.com/css2?family=Roboto"}],
                        appearance: {
                            variables: {
                                colorText: "#ffffff",
                                fontFamily: "Roboto", fontSize2Xs: "14px", fontSizeXs: "16px", fontSizeSm: "18px", fontSizeLg: "22px", fontSizeXl: "24px", fontSize3Xs: "12px", fontWeightBold: "700", fontWeightNormal: "400", fontWeightLight: "300",
                                borderRadius: "8px",
                                colorDanger: "#ff3f3f",
                                colorPrimary: "#ff4444",
                                colorBackground: "#4c4c4c"
                            }
                        }
                    }}>
                        <AddCardAddressForm switchStage={props.switchStage}/>
                    </Elements>
                </div>
            </motion.div>
        </div>
    )
}

export default AddCardAddress
