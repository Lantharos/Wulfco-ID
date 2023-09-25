import React from 'react'

import PropTypes from 'prop-types'

import './gifts.css'

const Gifts = (props) => {
  return (
    <div className="gifts-content">
      <h1 className="gifts-text notselectable">
        <span>Redeem Codes</span>
        <br></br>
      </h1>
      <div className="gifts-container">
        <span className="gifts-text03 notselectable">
          RECEIVED A GIFT? THAT&apos;S EXCITING! ENTER IT BELOW:
        </span>
        <div className="gifts-container1">
          <input
            type="text"
            id="gift_code"
            required="true"
            autoFocus="true"
            placeholder="WULF-XXXX-AAAA-BBBB-CCCC"
            autoComplete="off"
            className="gifts-textinput input"
          />
          <button id="confirm" type="button" className="gifts-save button">
            Redeem
          </button>
        </div>
      </div>
      <h1 className="gifts-text04 notselectable">
        <span>Gifts you purchased</span>
        <br></br>
      </h1>
      <span className="gifts-text07 notselectable">
        <span>You haven&apos;t bought any gifts yet :(</span>
        <br></br>
      </span>
    </div>
  )
}

Gifts.defaultProps = {
  rootClassName: '',
}

Gifts.propTypes = {
  rootClassName: PropTypes.string,
}

export default Gifts
