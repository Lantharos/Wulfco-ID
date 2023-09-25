import React from 'react'

import PropTypes from 'prop-types'

import Subscription from './subscription'
import './subscriptions.css'

const Subscriptions = (props) => {
  return (
    <div className="subscriptions-content">
      <h1 className="subscriptions-text notselectable">
        <span>Your Subscriptions</span>
        <br></br>
      </h1>
      <span className="subscriptions-text03 notselectable">
        <span>
          These are your current subscriptions. You can update any subscription
          at any time.
        </span>
        <br></br>
      </span>
      <div className="subscriptions-container">
          <h1 className="subscriptions-text12 notselectable">
              <span>You have no active subscriptions</span>
              <br></br>
          </h1>
      </div>
      <h1 className="subscriptions-text06 notselectable">
        <span>Subscription Credit</span>
        <br></br>
      </h1>
      <span className="subscriptions-text09 notselectable">
        <span>
          When you redeem a gift while you have a running subscription, or
          accept a gift that differs from your current subscriptions, it will
          appear here as credit.
        </span>
        <br></br>
      </span>
      <h1 className="subscriptions-text12 notselectable">
        <span>You have no unused credits</span>
        <br></br>
      </h1>
    </div>
  )
}

Subscriptions.defaultProps = {
  rootClassName: '',
  image_src1: 'https://play.teleporthq.io/static/svg/default-img.svg',
}

Subscriptions.propTypes = {
  rootClassName: PropTypes.string,
  image_src1: PropTypes.string,
}

export default Subscriptions
