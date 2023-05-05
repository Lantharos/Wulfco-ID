import React from 'react'

import PropTypes from 'prop-types'

import './connected-app.css'

const ConnectedApp = (props) => {
  return (
    <div className={`connected-app-container`}>
      <div className="connected-app-container1">
        <button
          id="disconnect"
          type="button"
          className="connected-app-button button"
        >
          X
        </button>
        <img
          id="appicon"
          src={props.image_src}
          className="connected-app-image notselectable"
          alt={"App Icon"}
        />
        <span id="appname" className="connected-app-text notselectable">
          {props.appName}
        </span>
        <span id="appusername" className="connected-app-text1 notselectable">
          {props.username}
        </span>
      </div>
    </div>
  )
}

ConnectedApp.defaultProps = {
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  username: '{appusername}',
  appName: '{appname}'
}

ConnectedApp.propTypes = {
  image_src: PropTypes.string,
  username: PropTypes.string,
  appName: PropTypes.string
}

export default ConnectedApp
