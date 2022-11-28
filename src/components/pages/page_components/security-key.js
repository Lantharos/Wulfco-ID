import React from 'react'

import PropTypes from 'prop-types'

import './security-key.css'

const SecurityKey = (props) => {
  return (
    <div className={`security-key-container ${props.rootClassName} `}>
      <div className="security-key-container1">
        <h1 className="security-key-text">{props.heading}</h1>
        <button
          id="deauthorize"
          type="button"
          className="security-key-button button"
        >
          {props.button}
        </button>
      </div>
    </div>
  )
}

SecurityKey.defaultProps = {
  rootClassName: '',
  button: 'Remove',
  heading: 'A security key',
}

SecurityKey.propTypes = {
  rootClassName: PropTypes.string,
  button: PropTypes.string,
  heading: PropTypes.string,
}

export default SecurityKey
