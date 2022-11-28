import React from 'react'

import PropTypes from 'prop-types'

import AuthorizedApp from './page_components/authorized-app'
import './authorized-apps.css'

const AuthorizedApps = (props) => {
  return (
    <div className="authorized-apps-content">
      <h1 className="authorized-apps-text notselectable">{props.heading}</h1>
      <div className="authorized-apps-container">
        <span className="authorized-apps-text1 notselectable">
          {props.text}
        </span>
        <span className="authorized-apps-text2 notselectable">
          {props.text1}
        </span>
      </div>
      <AuthorizedApp rootClassName="authorized-app-root-class-name1"></AuthorizedApp>
    </div>
  )
}

AuthorizedApps.defaultProps = {
  text1:
    "Here's all the apps that are doing cool stuff behind the scenes to make your experience better, if anything gets too chilly you can remove them at any time.",
  text: 'APPLICATIONS & CONNECTIONS',
  heading: 'Authorized Apps',
}

AuthorizedApps.propTypes = {
  text1: PropTypes.string,
  text: PropTypes.string,
  heading: PropTypes.string,
}

export default AuthorizedApps
