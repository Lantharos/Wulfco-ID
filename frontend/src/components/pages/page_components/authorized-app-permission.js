import React from 'react'

import PropTypes from 'prop-types'

import './authorized-app-permission.css'

const AuthorizedAppPermission = (props) => {
  return (
    <div
      className={`authorized-app-permission-container ${props.rootClassName} `}
    >
      <div className="authorized-app-permission-container1">
        <svg viewBox="0 0 1024 1024" className="authorized-app-permission-icon">
          <path
            d="M864 128l-480 480-224-224-160 160 384 384 640-640z"
            className=""
          ></path>
        </svg>
        <span
          id="app_permissions"
          className="authorized-app-permission-text notselectable"
        >
          {props.permission}
        </span>
      </div>
    </div>
  )
}

AuthorizedAppPermission.defaultProps = {
  rootClassName: '',
  permission: 'Access your third-party connections',
}

AuthorizedAppPermission.propTypes = {
  rootClassName: PropTypes.string,
  permission: PropTypes.string,
}

export default AuthorizedAppPermission
