import React from 'react'

import PropTypes from 'prop-types'

import './device.css'

const Device = (props) => {
  return (
    <div className={`device-container ${props.rootClassName} `}>
      <div className="device-container1">
        <svg viewBox="0 0 1024 1024" className="device-icon">
          <path
            d="M0 64v640h1024v-640h-1024zM960 640h-896v-512h896v512zM672 768h-320l-32 128-64 64h512l-64-64z"
            className=""
          ></path>
        </svg>
      </div>
      <div className="device-container2">
        <span className="device-text notselectable">{props.device_type}</span>
        <span className="device-text1 notselectable">
          {props.device_location}
        </span>
      </div>
    </div>
  )
}

Device.defaultProps = {
  device_type: 'WINDOWS •  CHROME',
  device_location: 'Belgrade, Belgrade, Serbia',
  rootClassName: '',
}

Device.propTypes = {
  device_type: PropTypes.string,
  device_location: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default Device
