import React from 'react'

import PropTypes from 'prop-types'

import SecurityKey from './page_components/security-key'
import './security.css'
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from "framer-motion";
import NameSecurityKey from "../dialogs/name-security-key";
import EnterPassword from "../dialogs/enter-password";
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast} from "react-toastify";

const config = require('../../config.json')
const api_url = config.api_url

const Security = (props) => {
  const [ securityKey, setSecurityKey ] = React.useState({})
  const [ enterPassword, setEnterPassword ] = React.useState({})

  const mapSecurityKeys = () => {
    if (props.userData.account.security.security_keys) {
      const securityKeys = []
      for (let i = 0; i < props.userData.account.security.security_keys.length; i++) {
        securityKeys.push(
            <SecurityKey
                keyId={i}
                name={props.userData.account.security.security_keys[i].name}
                updateUserData={props.updateUserData}
                setEnterPassword={setEnterPassword}
            />
        )
      }

      return securityKeys
    } else {
      return null
    }
  }

  const registerSecurityKey = async() => {
    const challenge = new Uint8Array(16);
    window.crypto.getRandomValues(challenge);

    const publicKey = {
      challenge,
      rp: {
        id: "localhost",
        name: "Wulfco ID"
      },
      user: {
        id: new Uint8Array(16),
        name: props.userData.profile.username,
        displayName: props.userData.profile.username
      },
      pubKeyCredParams: [ { type: "public-key", alg: -7 } ],
      timeout: 60000,
      attestation: "direct"
    };

    const credential = await navigator.credentials.create({ publicKey });

    const base64Encoder = new TextEncoder();

    const attestationObject = base64Encoder.encode(credential.response.attestationObject).toString();
    const clientDataJSON = base64Encoder.encode(credential.response.clientDataJSON).toString();

    setSecurityKey({id: base64Encoder.encode(credential.id).toString(), rawId: base64Encoder.encode(credential.rawId).toString(), response: {attestationObject, clientDataJSON}, type: credential.type})
  }

  const savePreferences = async(b, w) => {
    if (w === "share_storage_data") {
      await fetch(`${api_url}/id/preferences?id=${encodeURIComponent(cookies.load("id"))}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
          'W-Session': cookies.load('session_id'),
          'W-Loggen': cookies.load('loggen')
        },
        body: JSON.stringify({
          share_storage_data: b
        })
      }).then((res) => {
        res.json().then((data) => {
          if (data.success) {
            toast.success("Successfully updated preferences", {theme: 'dark', autoClose: 2000 })
            props.updateUserData()
          } else {
            toast.error("Failed to update preferences", {theme: 'dark', autoClose: 2000 })
          }
        })
      }).catch((err) => {
        toast.error("Failed to update preferences", {theme: 'dark', autoClose: 2000 })
      })
    } else if (w === "share_analytics") {
      await fetch(`${api_url}/id/preferences?id=${encodeURIComponent(cookies.load("id"))}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
          'W-Session': cookies.load('session_id'),
          'W-Loggen': cookies.load('loggen')
        },
        body: JSON.stringify({
          share_analytics: b
        })
      }).then((res) => {
        res.json().then((data) => {
          if (data.success) {
            toast.success("Successfully updated preferences", {theme: 'dark', autoClose: 2000 })
            props.updateUserData()
          } else {
            toast.error("Failed to update preferences", {theme: 'dark', autoClose: 2000 })
          }
        })
      }).catch((err) => {
        toast.error("Failed to update preferences", {theme: 'dark', autoClose: 2000 })
      })
    }
  }

  return (
    <div className="security-content">
      <h1 className="security-text notselectable">Privacy & Security</h1>
      <div className="security-container notselectable">
        <span className="security-text01 notselectable">MULTI-FACTOR AUTHENTICATION</span>
        <div className="security-container01">
          <div className="security-container02">
            <AnimatePresence>
              {securityKey.id && <NameSecurityKey setSecurityKey={setSecurityKey} securityKey={securityKey} updateUserData={props.updateUserData} />}
              {enterPassword.after && <EnterPassword setEnterPassword={setEnterPassword} enterPassword={enterPassword} updateUserData={props.updateUserData} />}
            </AnimatePresence>
            <div className="security-container03">
              <div className="security-container04">

                <h1 className="security-text02 notselectable">
                  Security Keys
                </h1>
                <h1 className="security-text03 notselectable">
                  RECOMMENDED
                </h1>
              </div>
              <span className="security-text04 notselectable">
                <span>
                  Security Keys are the most secure form of authentication, we
                  also recommend adding a backup security key.
                </span>
              </span>
            </div>
            <button
              id="add_skey"
              type="button"
              onClick={registerSecurityKey}
              className="security-save button"
            >
              New Key
            </button>
          </div>
          <div id="current_keys" className="security-container05">
            {mapSecurityKeys()}
          </div>
        </div>
        <div className="security-authenticator-app">
          <div className="security-container06">
            <div className="security-container07">
              <div className="security-container08">
                <h1 className="security-text06 notselectable">
                  Authenticator App
                </h1>
              </div>
              <span className="security-text07 notselectable">
                <span>
                  Authenticator apps are the second best thing for
                  authentication, it is a lot better than email authentication.
                </span>
              </span>
            </div>
            <button
              id="setup_authapp"
              type="button"
              className="security-save1 button"
            >
              Setup
            </button>
          </div>
        </div>
        <div className="security-email-authentication">
          <div className="security-container09">
            <div className="security-container10">
              <div className="security-container11">
                <h1 className="security-text09 notselectable">
                  Email Authentication
                </h1>
                <h1 className="security-text10 notselectable">
                  LEAST SECURE
                </h1>
              </div>
              <span className="security-text11 notselectable">
                Receive a code in your email address to verify it's you trying to log in. This is the least secure option.
              </span>
            </div>
            <button
              id="setup_emailauth"
              type="button"
              className="security-save2 button"
            >
              Setup
            </button>
          </div>
        </div>
      </div>
      <div className="security-container12 notselectable">
        <span className="security-text12 notselectable">HOW WE USE YOUR DATA</span>
        <div className="security-container13">
          <div className="security-container14">
            <h1 className="security-text13 notselectable">Share my data with apps using Wulfco Storage</h1>
            <span className="security-text14">
              <span>
                This setting shares connections, 2fa methods etc... rather than
                just sharing the basic information (email, profile, dob). For
                example
              </span>
              <br></br>
              <span>
                Wulfie uses those to customize user experience, if you were to
                disable this setting you would have to manually enter data.
              </span>
            </span>
          </div>
          <label className="checkbox security-checkbox">
            <input type="checkbox" name="share_service_data" defaultChecked={props.userData.account.analytics.share_storage_data} onClick={(checked) => {savePreferences(!props.userData.account.analytics.share_storage_data, "share_storage_data")}}></input>
            <span className="checkbox">
              <span></span>
            </span>
          </label>
        </div>
        <div className="security-container15">
          <div className="security-container16">
            <h1 className="security-text18 notselectable">Use data to improve our services</h1>
            <span className="security-text19 notselectable">
              <span>
                This setting allows us to use and process the information about
                how you navigate and use our services for analytical purposes
              </span>
              <br></br>
              <span>
                For example, it allows us to include you in the new features we
                test.
              </span>
            </span>
          </div>
          <label className="checkbox security-checkbox">
            <input type="checkbox" name="share_analytics_data" defaultChecked={props.userData.account.analytics.share_analytics} onClick={(e) => {savePreferences(!props.userData.account.analytics.share_analytics, "share_analytics")}}></input>
            <span className="checkbox">
              <span></span>
            </span>
          </label>
        </div>
        <div className="security-container17">
          <div className="security-container18">
            <h1 className="security-text23 notselectable">Use data to make our services work</h1>
            <span className="security-text24 notselectable">
              <span>
                We need to store and process some data in order to provide you
                the basics of our services, such as your email, connections,
                etc...
              </span>
              <br></br>
              <span>
                By using Wulfco ID and our services you allow us to
                provide this basic service. You can stop this by deleting your
                account.
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="security-container19 notselectable">
        <span className="security-text28 notselectable">MY DATA</span>
        <span className="security-text29 notselectable">Download what we have stored in the database of you, in the downloaded package you will not receive the data from VikkiVuk Storage, to get the data from Storage you need to download it from each service separately.</span>
        <div className="security-container20">
          <button
            id="request_data"
            type="button"
            className="security-button button"
          >
            <span>Download my Data</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Security
