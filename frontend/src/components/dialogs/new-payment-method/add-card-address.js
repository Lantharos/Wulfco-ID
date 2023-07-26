import React from 'react'

import './add-card-address.css'
import { motion } from 'framer-motion'

const AddCardAddress = (props) => {
    const submit = async () => {
        const country = document.getElementById('country')
        const address_line1 = document.getElementById('address_line1')
        const address_line2 = document.getElementById('address_line2')
        const city = document.getElementById('city')
        const region = document.getElementById('region')
        const zip_code = document.getElementById('zip_code')

        props.switchStage(4, { address: { country: country.value, line1: address_line1.value, line2: address_line2.value, city: city.value, state: region.value, postal_code: zip_code.value } })
    }
  return (
    <div>
        <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

        <motion.div animate={{height: '661px', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}} className="add-card-address-container">
            <h1 className="add-card-address-text notselectable">
                Add a new payment method
            </h1>
            <div className="add-card-address-container1">
                <span className="add-card-address-text1 notselectable">COUNTRY</span>
                <input
                    type="text"
                    id="country"
                    pattern="[A-Za-z ]*"
                    required="true"
                    autoFocus="true"
                    placeholder="United States"
                    autoComplete="country-name"
                    className="add-card-address-textinput input"
                />
            </div>
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
            <div className="add-card-address-container3">
                <span className="add-card-address-text2 notselectable">ADDRESS</span>
                <input
                    type="text"
                    id="address_line1"
                    required="true"
                    autoFocus="true"
                    placeholder="123 Park Valley"
                    autoComplete="address-line1"
                    className="add-card-address-textinput1 input"
                />
            </div>
            <div className="add-card-address-container4">
        <span className="add-card-address-text3 notselectable">
          ADDRESS 2 (OPTIONAL)
        </span>
                <input
                    type="text"
                    id="address_line2"
                    required="true"
                    autoFocus="true"
                    placeholder="Apt. Ste. Dimension."
                    autoComplete="address-line2"
                    className="add-card-address-textinput2 input"
                />
            </div>
            <div className="add-card-address-container5">
                <span className="add-card-address-text4 notselectable">CITY</span>
                <input
                    type="text"
                    id="city"
                    required="true"
                    autoFocus="true"
                    placeholder="Centreville"
                    autoComplete="address-level2"
                    className="add-card-address-textinput3 input"
                />
            </div>
            <div className="add-card-address-container6">
                <div className="add-card-address-container7">
          <span className="add-card-address-text5 notselectable">
            STATE/REGION
          </span>
                    <input
                        type="text"
                        id="region"
                        required="true"
                        autoFocus="true"
                        autoComplete="address-level1"
                        className="add-card-address-textinput4 input"
                    />
                </div>
                <div className="add-card-address-container8">
          <span className="add-card-address-text6 notselectable">
            POSTAL CODE
          </span>
                    <input
                        type="text"
                        id="zip_code"
                        required="true"
                        autoFocus="true"
                        autoComplete="postal-code"
                        className="add-card-address-textinput5 input"
                    />
                </div>
            </div>
        </motion.div>
    </div>
  )
}

export default AddCardAddress
