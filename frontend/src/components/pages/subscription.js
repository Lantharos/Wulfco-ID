import React from 'react'

import PropTypes from 'prop-types'

import './subscription.css'

const Subscription = (props) => {
  return (
    <div className="subscription-container">
      <img alt="image" src={props.image_src} className="subscription-image" />
      <div className="subscription-container1">
        <h1 className="subscription-text notselectable">
          <span>Wulfco Hyper</span>
          <br></br>
        </h1>
        <span className="subscription-text3 notselectable">
          <span>Improve your experience with Wulfco at a very low price!</span>
          <br></br>
        </span>
      </div>
      <button id="cancel" type="button" className="subscription-save button">
        Cancel
      </button>
    </div>
  )
}

Subscription.defaultProps = {
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
}

Subscription.propTypes = {
  image_src: PropTypes.string,
}

export default Subscription
