import React from 'react'

import PropTypes from 'prop-types'

import Device from './page_components/device'
import './devices.css'

const Devices = (props) => {
  return (
    <div className="devices-content">
      <h1 className="devices-text notselectable">{props.heading}</h1>
      <span className="devices-text01 notselectable">
        <span>
          Here are all the devices currently logged in with your VikkiVuk ID.
          You can log out of each one individually or all the other devices.
        </span>
        <br></br>
        <br></br>
        <br></br>
        <span>
          If you see an entry you don&apos;t recognize, log out of that device
          and change your VikkiVuk ID password immediately.
        </span>
        <br></br>
      </span>
      <div className="devices-container">
        <span className="devices-text08 notselectable">{props.text}</span>
        <Device rootClassName="device-root-class-name"></Device>
      </div>
      <div className="devices-container1">
        <span className="devices-text09 notselectable">{props.text1}</span>
        <Device
          device_type="ANDROID • VIKKIVUK ANDROID"
          rootClassName="device-root-class-name1"
        ></Device>
      </div>
      <div className="devices-container2 notselectable">
        <span className="devices-text10 notselectable">{props.text2}</span>
        <span className="devices-text11 notselectable">{props.text3}</span>
        <button
          id="delete_sessions"
          type="button"
          onclick="this.classList.toggle('submit--loading')"
          className="devices-button button"
        >
          <span>{props.text4}</span>
        </button>
      </div>
    </div>
  )
}

Devices.defaultProps = {
  text1: 'OTHER DEVICES',
  text2: 'LOG OUT OF ALL KNOWN DEVICES',
  text3: "You'll have to log back in on all logged out devices.",
  text: 'CURRENT DEVICE',
  text4: 'Log out of all sessions',
  heading: 'Devices',
}

Devices.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text: PropTypes.string,
  text4: PropTypes.string,
  heading: PropTypes.string,
}

export default Devices
