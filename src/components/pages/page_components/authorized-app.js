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
        >
          {props.app_remove}
        </button>
        <button
          id="app_deauthorize"
          type="button"
          className="authorized-app-button1 button"
        >
          {props.app_remove1}
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
            {props.txt_aboutthisapp}
          </span>
          <span id="app_about" className="authorized-app-text2 notselectable">
            {props.app_about}
          </span>
        </div>
        <div className="authorized-app-container4">
          <span className="authorized-app-text3 notselectable">
            {props.txt_permissions}
          </span>
          <AuthorizedAppPermission
            permission="Access your username and avatar"
            rootClassName="authorized-app-permission-root-class-name"
            className=""
          ></AuthorizedAppPermission>
          <AuthorizedAppPermission
            permission="Access your email address"
            rootClassName="authorized-app-permission-root-class-name3"
            className=""
          ></AuthorizedAppPermission>
          <AuthorizedAppPermission
            permission="Access your third-party connections"
            rootClassName="authorized-app-permission-root-class-name2"
            className=""
          ></AuthorizedAppPermission>
          <AuthorizedAppPermission
            permission="See your friends"
            rootClassName="authorized-app-permission-root-class-name1"
            className=""
          ></AuthorizedAppPermission>
          <AuthorizedAppPermission
            permission="Use Cloud Storage"
            rootClassName="authorized-app-permission-root-class-name4"
            className=""
          ></AuthorizedAppPermission>
        </div>
      </div>
    </div>
  )
}

AuthorizedApp.defaultProps = {
  app_icon: 'https://play.teleporthq.io/static/svg/default-img.svg',
  txt_aboutthisapp: 'ABOUT THIS APP',
  app_remove1: 'Go to Storage',
  app_about:
    'App is an app that adds stuff and is used by people and does stuff',
  button: () => {},
  app_name: 'VikkiVuk ID',
  rootClassName: '',
  app_remove: 'Deauthorize',
  txt_permissions: 'PERMISSIONS',
}

AuthorizedApp.propTypes = {
  app_icon: PropTypes.string,
  txt_aboutthisapp: PropTypes.string,
  app_remove1: PropTypes.string,
  app_about: PropTypes.string,
  button: PropTypes.func,
  app_name: PropTypes.string,
  rootClassName: PropTypes.string,
  app_remove: PropTypes.string,
  txt_permissions: PropTypes.string,
}

export default AuthorizedApp
