import React from 'react'

import PropTypes from 'prop-types'

import './transaction.css'

const Transaction = (props) => {
  return (
    <div className="transaction-container">
      <span className="transaction-text">{props.date}</span>
      <img alt="image" src={props.image} className="transaction-image" />
      <h1 className="transaction-text1">{props.name}</h1>
      <span className="transaction-text2">{props.amount}</span>
    </div>
  )
}

Transaction.defaultProps = {
  date: '06/07/2023',
  amount: '$9.99',
  image: 'https://play.teleporthq.io/static/svg/default-img.svg',
  name: 'Hyper Monthly',
}

Transaction.propTypes = {
  date: PropTypes.string,
  amount: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
}

export default Transaction
