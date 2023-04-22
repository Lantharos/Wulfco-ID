import React from 'react'

import Device from './page_components/device'
import './devices.css'
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";
import {AnimatePresence} from "framer-motion";
const config = require('../../config.json')
const api_url = config.api_url
import * as platform from 'platform'
import EnterPassword from "../dialogs/enter-password";

const Devices = (props) => {
    const [ enterPassword, setEnterPassword ] = React.useState({})

    const parseSessions = () => {
        const sessions = props.userData.account.sessions
        const currentSession = sessions.find((session) => session.session_id === cookies.load('session_id'))
        const otherSessions = sessions.filter((session) => session.session_id !== cookies.load('session_id'))
        return {currentSession, otherSessions}
    }

    const mapCurrentSession = () => {
        const parsedSessions = parseSessions();
        const sessionDetails = platform.parse(parsedSessions.currentSession.user_agent);

        return (
            <Device
                device_type={sessionDetails.os.family.toUpperCase() + ' • ' + sessionDetails.name.toUpperCase()}
                device_location={`${parsedSessions.currentSession.location.city}, ${parsedSessions.currentSession.location.regionName}, ${parsedSessions.currentSession.location.country}`}
            ></Device>
        );
    };

    const mapOtherSessions = () => {
        const parsedSessions = parseSessions()

        if (parsedSessions.otherSessions.length === 0) {
            return (
                <span className="devices-text11 notselectable">No other devices logged in</span>
            )
        } else {
            return parsedSessions.otherSessions.map((session) => {
                const sessionDetails = platform.parse(session.user_agent)
                return (
                    <Device
                        device_type={sessionDetails.os.family.toUpperCase() + ' • ' + sessionDetails.name.toUpperCase()}
                        device_location={`${session.location.city}, ${session.location.regionName}, ${session.location.country}`}
                    ></Device>
                )
            })
        }
    }

    const deleteSessions = async () => {
        setEnterPassword({after: async() => {
            const notif = toast.loading('Logging out of all sessions...', {theme: 'dark'})

            await fetch(`${api_url}/logout_all`).then(async(res) => {
                const data = await res.json()

                if (data.status === 'success') {
                    toast.update(notif, {
                        render: 'Logged out of all sessions',
                        type: 'success',
                        isLoading: false,
                        theme: 'dark',
                        autoClose: 5000
                    })
                } else {
                    toast.update(notif, {
                        render: 'An error occurred',
                        type: 'error',
                        isLoading: false,
                        theme: 'dark',
                        autoClose: 5000
                    })
                }
            }).catch(() => {
                toast.update(notif, {
                    render: 'An error occurred',
                    type: 'error',
                    isLoading: false,
                    theme: 'dark',
                    autoClose: 5000
                })
            })
        }})
    }
  return (
    <div className="devices-content">
      <h1 className="devices-text notselectable">Devices</h1>
        <AnimatePresence>
            {enterPassword.after && <EnterPassword setEnterPassword={setEnterPassword} enterPassword={enterPassword} updateUserData={props.updateUserData} />}
        </AnimatePresence>
      <span className="devices-text01 notselectable">
        <span>
          Here are all the devices currently logged in to your Wulfco ID.
          You can log out of each one individually or all the other devices.
        </span>
        <br></br>
        <br></br>
        <br></br>
        <span>
          If you see an entry you don't recognize, log out of that device
          and change your Wulfco ID password immediately.
        </span>
        <br></br>
      </span>
      <div className="devices-container">
        <span className="devices-text08 notselectable">CURRENT DEVICE</span>
        {mapCurrentSession()}
      </div>
      <div className="devices-container1">
        <span className="devices-text09 notselectable">OTHER DEVICES</span>
        {mapOtherSessions()}
      </div>
      <div className="devices-container2 notselectable">
        <span className="devices-text10 notselectable">LOG OUT OF ALL KNOWN DEVICES</span>
        <span className="devices-text11 notselectable">You'll have to log back in on all logged out devices.</span>
        <button
          id="delete_sessions"
          type="button"
          className="devices-button button"
          onClick={deleteSessions}
        >
          <span>Log out of all sessions</span>
        </button>
      </div>
    </div>
  )
}

export default Devices
