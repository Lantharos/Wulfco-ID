import React from 'react'

import PropTypes from 'prop-types'

import SecurityKey from './page_components/security-key'
import './security.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import cookies from 'react-cookies'
import hmac from 'crypto-js/hmac-sha256'

let config = require('../../config.json')
let api_url = config.api_url

const Security = (props) => {
  const mapSecurityKeys = () => {
    if (props.userData.account.security.security_keys) {
      for (let i = 0; i < props.userData.account.security.security_keys.length; i++) {
        console.log(i)
        return (
          <SecurityKey
            keyId={i}
            name={props.userData.account.security.security_keys[i].name}
            updateUserData={props.updateUserData}
          />
        )
      }
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

    // convert ArrayBuffers to base64-encoded strings
    const base64Encoder = new TextEncoder();
    const base64Decoder = new TextDecoder();

    const attestationObject = base64Encoder.encode(credential.response.attestationObject).toString();
    const clientDataJSON = base64Encoder.encode(credential.response.clientDataJSON).toString();

    await fetch(`${api_url}/id/security-key?id=` + encodeURIComponent(cookies.load("id")), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
            'W-Session': cookies.load('session_id'),
            'W-Loggen': cookies.load('loggen')
        },
        body: JSON.stringify({
          id: base64Encoder.encode(credential.id).toString(),
          rawId: base64Encoder.encode(credential.rawId).toString(),
          response: {
            attestationObject,
            clientDataJSON
          },
          type: credential.type,
          name: prompt("Enter a name for this security key")
        })
    }).then((res) => {
        res.json().then((data) => {
            if (data.success) {
                toast.success('Security key registered!', { theme: "dark" })
                props.updateUserData()
            } else {
                toast.error('Failed to register security key!', { theme: "dark" })
            }
        })
    }).catch((err) => {
        toast.error('Failed to register security key!', { theme: "dark" })
    })
  }

  return (
    <div className="security-content">
      <h1 className="security-text notselectable">Privacy & Security</h1>
      <div className="security-container notselectable">
        <span className="security-text01 notselectable">MULTI-FACTOR AUTHENTICATION</span>
        <div className="security-container01">
          <div className="security-container02">
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
                  {props.heading6}
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
              {props.Save1}
            </button>
          </div>
        </div>
        <div className="security-email-authentication">
          <div className="security-container09">
            <div className="security-container10">
              <div className="security-container11">
                <h1 className="security-text09 notselectable">
                  {props.heading7}
                </h1>
                <h1 className="security-text10 notselectable">
                  {props.heading8}
                </h1>
              </div>
              <span className="security-text11 notselectable">
                {props.text5}
              </span>
            </div>
            <button
              id="setup_emailauth"
              type="button"
              className="security-save2 button"
            >
              {props.Save2}
            </button>
          </div>
        </div>
      </div>
      <div className="security-container12 notselectable">
        <span className="security-text12 notselectable">{props.text1}</span>
        <div className="security-container13">
          <div className="security-container14">
            <h1 className="security-text13 notselectable">{props.heading1}</h1>
            <span className="security-text14">
              <span>
                This setting shares connections, 2fa methods etc... rather than
                just sharing the basic information (email, profile, dob). For
                example
              </span>
              <br></br>
              <span>
                Wolfie uses those to customize user experience, if you were to
                disable this setting you would have to manually enter data.
              </span>
            </span>
          </div>
          <input
            type="checkbox"
            id="usage_statistics_check"
            defaultChecked={true}
            className="security-checkbox"
          />
        </div>
        <div className="security-container15">
          <div className="security-container16">
            <h1 className="security-text18 notselectable">{props.heading2}</h1>
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
          <input
            type="checkbox"
            id="usage_statistics_check"
            defaultChecked={true}
            className="security-checkbox1"
          />
        </div>
        <div className="security-container17">
          <div className="security-container18">
            <h1 className="security-text23 notselectable">{props.heading3}</h1>
            <span className="security-text24 notselectable">
              <span>
                We need to store and process some data in order to provide you
                the basics of our services, such as your email, connections,
                etc...
              </span>
              <br></br>
              <span>
                By using VikkiVuk Accounts and our services you allow us to
                provide this basic service. You can stop this by deleting your
                account.
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="security-container19 notselectable">
        <span className="security-text28 notselectable">{props.text2}</span>
        <span className="security-text29 notselectable">{props.text3}</span>
        <div className="security-container20">
          <button
            id="request_data"
            type="button"
            className="security-button button"
          >
            <span>{props.text4}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

Security.defaultProps = {
  heading3: 'Use data to make our services work',
  Save: 'New Key',
  heading: '',
  text2: 'MY DATA',
  heading7: 'Email Authentication',
  heading4: '',
  Save1: 'Setup',
  text: '',
  Save2: 'Setup',
  heading5: '',
  heading1: 'Share my data with apps using VikkiVuk Storage',
  text4: 'Download my Data',
  heading2: 'Use data to improve our services',
  text3:
    'Download what we have stored in the database of you, in the downloaded package you will not receive the data from VikkiVuk Storage, to get the data from Storage you need to download it from each service separately.',
  heading6: 'Authenticator App',
  text1: 'HOW WE USE YOUR DATA',
  text5:
    "Receive a code in your email address to verify it's you trying to log in. This is the least secure option.",
  heading8: 'NOT SECURE',
}

Security.propTypes = {
  heading3: PropTypes.string,
  Save: PropTypes.string,
  heading: PropTypes.string,
  text2: PropTypes.string,
  heading7: PropTypes.string,
  heading4: PropTypes.string,
  Save1: PropTypes.string,
  text: PropTypes.string,
  Save2: PropTypes.string,
  heading5: PropTypes.string,
  heading1: PropTypes.string,
  text4: PropTypes.string,
  heading2: PropTypes.string,
  text3: PropTypes.string,
  heading6: PropTypes.string,
  text1: PropTypes.string,
  text5: PropTypes.string,
  heading8: PropTypes.string,
}

export default Security
