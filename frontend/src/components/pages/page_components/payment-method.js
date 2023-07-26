import React from 'react'

import PropTypes from 'prop-types'

import './payment-method.css'

const PaymentMethod = (props) => {
  return (
    <div className="payment-method-container">
      <img alt="image" src={props.logo} className="payment-method-image" />
      <div className="payment-method-container1">
        <h1 className="payment-method-text">{props.name}</h1>
        <span>{props.details}</span>
      </div>
      <button type="button" className="payment-method-button button">
        Edit
      </button>
    </div>
  )
}

PaymentMethod.defaultProps = {
  name: 'Visa ending in 2978',
  logo: 'https://play.teleporthq.io/static/svg/default-img.svg',
  details: 'Expires Oct 2023',
}

PaymentMethod.propTypes = {
  name: PropTypes.string,
  logo: PropTypes.string,
  details: PropTypes.string,
}

export default PaymentMethod
