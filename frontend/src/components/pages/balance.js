import React from 'react'

import PropTypes from 'prop-types'

import './balance.css'

const Balance = (props) => {
  return (
    <div className="balance-content">
      <h1 className="balance-text notselectable">{props.heading}</h1>
      <div className="balance-container">
        <h1 id="profile-username" className="balance-text1 notselectable">
          {props.heading1}
        </h1>
        <h1 id="profile-username" className="balance-text2 notselectable">
          {props.balance}
        </h1>
      </div>
      <button id="add_balance" type="button" className="balance-save button">
        {props.Save}
      </button>
      <span className="balance-text3 notselectable">{props.text}</span>
    </div>
  )
}

Balance.defaultProps = {
  heading: 'Balance',
  Save: 'Buy Bluebux',
  text: 'All payments are final and non-refundable. You can only use Bluebux* on services supported by it.',
  balance: 'B$ 0',
  heading1: 'BALANCE',
}

Balance.propTypes = {
  heading: PropTypes.string,
  Save: PropTypes.string,
  text: PropTypes.string,
  balance: PropTypes.string,
  heading1: PropTypes.string,
}

export default Balance
