import React from 'react'

import PropTypes from 'prop-types'

import './connected-app.css'

const ConnectedApp = (props) => {
  return (
    <div className={`connected-app-container ${props.rootClassName} `}>
      <div className="connected-app-container1">
        <button
          id="disconnect"
          type="button"
          className="connected-app-button button"
        >
          {props.button}
        </button>
        <img
          id="appicon"
          src={props.image_src}
          className="connected-app-image notselectable"
        />
        <span id="appname" className="connected-app-text notselectable">
          {props.text}
        </span>
        <span id="appusername" className="connected-app-text1 notselectable">
          {props.text1}
        </span>
      </div>
    </div>
  )
}

ConnectedApp.defaultProps = {
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  rootClassName: '',
  text1: '{appusername}',
  text: '{appname}',
  button: 'X',
}

ConnectedApp.propTypes = {
  image_src: PropTypes.string,
  rootClassName: PropTypes.string,
  text1: PropTypes.string,
  text: PropTypes.string,
  button: PropTypes.string,
}

export default ConnectedApp
