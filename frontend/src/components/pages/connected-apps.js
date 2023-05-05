import React from 'react'

import ConnectionButton from './page_components/connection-button'
import './connected-apps.css'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import cookies from 'react-cookies'
import hmac from 'crypto-js/hmac-sha256'
import ConnectedApp from "./page_components/connected-app";

const config = require('../../config.json')
const api_url = config.api_url

const ConnectedApps = (props) => {
  const redirectToLink = async(platform) => {
    const message = toast.loading('Generating URL...', { theme: 'dark' })

    await fetch(`${api_url}/connections?function=get&service=${platform}&id=${encodeURIComponent(cookies.load("id"))}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
        'W-Session': cookies.load('session_id'),
        'W-Loggen': cookies.load('loggen')
      }
    }).then((response) => response.json()).then((data) => {
      if (data.success) {
        toast.update(message, { type: 'success', render: 'URL generated successfully', theme: 'dark', isLoading: false, autoClose: 2000 })
        window.location.href = data.url
      } else {
        toast.update(message, { type: 'error', render: 'Failed to generate URL', theme: 'dark', isLoading: false, autoClose: 2000 })
      }
    }).catch(() => { toast.update(message, { type: 'error', render: 'Failed to generate URL', theme: 'dark', isLoading: false, autoClose: 2000 }) })
  }

  const mapConnections = () => {
    if (props.userData.connections) {
      const connections = []
      for (let key in props.userData.connections) {
        const connection = props.userData.connections[key]
        if (!(key === "oauth") && !connection.pending) {
          const appName = key.charAt(0).toUpperCase() + key.slice(1)
          connections.push(
              <ConnectedApp
                  image_src={"assets/" + key + ".png"}
                  appName={appName}
                  username={connection.username}
              />
          )
        }
      }

      return connections
    } else {
      return null
    }
  }

  return (
      <div className="connected-apps-content">
        <h1 className="connected-apps-text notselectable">Connections</h1>
        <div className="connected-apps-container">
          <div className="connected-apps-container1">
            <h1 className="connected-apps-text1 notselectable">
              Add accounts to your profile
            </h1>
            <span className="connected-apps-text2 notselectable">
            This information will not be shared outside of Wulfco without your permission, and is used in accordance with Wulfco's
          </span>
            <a
                href={"/privacy-policy"}
                rel="noreferrer noopener"
                className="connected-apps-link"
            >
              Privacy Policy
            </a>
          </div>
          <div className="connected-apps-container2">
            <ConnectionButton genURL={redirectToLink} platform="github" image_src={"assets/github.png"} image_alt={"GitHub"}></ConnectionButton>
            <ConnectionButton genURL={redirectToLink} platform="reddit" image_src={"assets/reddit.png"} image_alt={"Reddit"}></ConnectionButton>
            <ConnectionButton genURL={redirectToLink} platform="steam" image_src={"assets/steam.png"} image_alt={"Steam"}></ConnectionButton>
            <ConnectionButton genURL={redirectToLink} platform="twitter" image_src={"assets/twitter.png"} image_alt={"Twitter"}></ConnectionButton>
            <ConnectionButton genURL={redirectToLink} platform="youtube" image_src={"assets/youtube.png"} image_alt={"YouTube"}></ConnectionButton>
            <ConnectionButton genURL={redirectToLink} platform="twitch" image_src={"assets/twitch.png"} image_alt={"Twitch"}></ConnectionButton>
            <ConnectionButton genURL={redirectToLink} platform="discord" image_src={"assets/discord.png"} image_alt={"Discord"}></ConnectionButton>
            <ConnectionButton genURL={redirectToLink} platform="spotify" image_src={"assets/spotify.png"} image_alt={"Spotify"}></ConnectionButton>
            {/*<ConnectionButton genURL={redirectToLink} platform="epic_games" image_src={"assets/epic_games.png"} image_alt={"Epic Games"}></ConnectionButton>*/}
            {/*<ConnectionButton genURL={redirectToLink} platform="xbox" image_src={"assets/xbox.png"} image_alt={"Xbox"}></ConnectionButton>*/}
          </div>
        </div>
        <div className="connected-apps-container3">
          <div className="connected-apps-container4">
          <span className="connected-apps-text3 notselectable">
            IMPORT
          </span>
            <span className="connected-apps-text4 notselectable">
            You can also import your connections from Discord!
          </span>
          </div>
          <a
              href={"https://discord.com/api/oauth2/authorize?client_id=975161504703840258&redirect_uri=https%3A%2F%2Fus-central1-wulfco-id.cloudfunctions.net%2Fapi%2Fconnections%3Ffunction%3Dimport%26service%3Ddiscord&response_type=code&scope=identify%20connections"}
              id="import"
              className="connected-apps-save button"
          >
            Import my connections from Discord
          </a>
        </div>
        {mapConnections()}
      </div>
  )
}

export default ConnectedApps
