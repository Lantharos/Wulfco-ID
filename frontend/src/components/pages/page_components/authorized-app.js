import React from 'react'

import PropTypes from 'prop-types'

import AuthorizedAppPermission from './authorized-app-permission'
import './authorized-app.css'

const AuthorizedApp = (props) => {
  return (
    <div className={`authorized-app-container ${props.rootClassName} `}>
      <div className="authorized-app-container1">
        <button
          id="app_deauthorize"
          type="button"
          className="authorized-app-button button"
          onClick={() => props.deauthorize(props.app_id)}
        >
          Deauthorize
        </button>
        <button
          id="storage"
          type="button"
          className="authorized-app-button1 hidden button"
        >
          Go to Storage
        </button>
        <div className="authorized-app-container2">
          <img
            id="appicon"
            src={props.app_icon}
            className="authorized-app-image notselectable"
            alt={"App Icon"}
          />
          <span id="app_name" className="authorized-app-text notselectable">
            {props.app_name}
          </span>
        </div>
        <div className="authorized-app-container3">
          <span className="authorized-app-text1 notselectable">
            ABOUT THIS APP
          </span>
          <span id="app_about" className="authorized-app-text2 notselectable">
            {props.app_about}
          </span>
        </div>
        <div className="authorized-app-container4">
          <span className="authorized-app-text3 notselectable">
            PERMISSIONS
          </span>
          {props.app_permissions.map((permission) => {return (<AuthorizedAppPermission  permission={permission} />)})}
        </div>
      </div>
    </div>
  )
}

AuthorizedApp.defaultProps = {
  app_icon: 'assets/cloud.png',
  app_about: 'App is an app that adds stuff and is used by people and does stuff',
  app_name: 'VikkiVuk ID',
  app_permissions: [
    "Read your profile"
  ]
}

export default AuthorizedApp
