import React from 'react'

import PropTypes from 'prop-types'

import ConnectionButton from './page_components/connection-button'
import './connected-apps.css'

const ConnectedApps = (props) => {
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
            <ConnectionButton image_src={"assets/facebook.png"} image_alt={"Facebook"}></ConnectionButton>
            <ConnectionButton image_src={"assets/github.png"} image_alt={"GitHub"}></ConnectionButton>
            <ConnectionButton image_src={"assets/reddit.png"} image_alt={"Reddit"}></ConnectionButton>
            <ConnectionButton image_src={"assets/steam.png"} image_alt={"Steam"}></ConnectionButton>
            <ConnectionButton image_src={"assets/twitter.png"} image_alt={"Twitter"}></ConnectionButton>
            <ConnectionButton image_src={"assets/youtube.png"} image_alt={"YouTube"}></ConnectionButton>
            <ConnectionButton image_src={"assets/twitch.png"} image_alt={"Twitch"}></ConnectionButton>
            <ConnectionButton image_src={"assets/discord.png"} image_alt={"Discord"}></ConnectionButton>
            <ConnectionButton image_src={"assets/spotify.png"} image_alt={"Spotify"}></ConnectionButton>
            <ConnectionButton image_src={"assets/epic_games.png"} image_alt={"Epic Games"}></ConnectionButton>
            <ConnectionButton image_src={"assets/xbox.png"} image_alt={"Xbox"}></ConnectionButton>
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
              href={"https://discord.com/api/oauth2/authorize?client_id=975161504703840258&redirect_uri=https%3A%2F%2Flocalhost%3A5000%2Fid%2Fconnections%2Fdiscord%2Fimport&response_type=code&scope=identify%20connections"}
              id="import"
              className="connected-apps-save button"
          >
            Import my connections from Discord
          </a>
        </div>
      </div>
  )
}

ConnectedApps.defaultProps = {
  heading: '',
  image_src2:
      'https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png',
  text3: '',
  link_button4: 'https://id.vikkivuk.xyz/connections/twitter/connect',
  text: "",
  image_alt1: 'image',
  link_button1: 'https://id.vikkivuk.xyz/connections/github/connect',
  link_button8: 'https://id.vikkivuk.xyz/connections/spotify/connect',
  image_src6:
      'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/twitch.png?v=1652550942504',
  image_src5:
      'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/youtube.png?v=1652550860224',
  text1: 'Privacy Policy',
  link_button9: 'https://id.vikkivuk.xyz/connections/epic_games/connect',
  image_src8:
      'https://play-lh.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM',
  image_alt7: 'image',
  image_alt10: 'image',
  image_alt5: 'image',
  image_alt9: 'image',
  link_button6: 'https://id.vikkivuk.xyz/connections/twitch/connect',
  image_src9:
      'https://cdn2.unrealengine.com/Unreal+Engine%2Feg-logo-filled-1255x1272-0eb9d144a0f981d1cbaaa1eb957de7a3207b31bb.png',
  image_alt4: 'image',
  image_alt2: 'image',
  image_src10:
      'https://cdn.glitch.global/2b94abd5-b0ec-4484-9e8d-e694b540a14c/xbox.png?v=1665225144728',
  link_Save: 'https://id.vikkivuk.xyz/connections/discord/import',
  image_src4:
      'https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png',
  link_button3: 'https://id.vikkivuk.xyz/connections/steam/connect',
  link_text: 'https://id.vikkivuk.xyz/legal/privacy-policy.html',
  image_alt3: 'image',
  image_alt8: 'image',
  Save: '',
  image_src3:
      'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/steam.png?v=1652550856148',
  link_button2: 'https://id.vikkivuk.xyz/connections/reddit/connect',
  heading1: '',
  image_alt6: 'image',
  image_src1:
      'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/github.png?v=1652550848213',
  text2: '',
  image_src7:
      'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/discord.png?v=1652550843864',
}

ConnectedApps.propTypes = {
  link_button10: PropTypes.string,
  link_button5: PropTypes.string,
  link_button7: PropTypes.string,
  heading: PropTypes.string,
  image_src2: PropTypes.string,
  text3: PropTypes.string,
  link_button4: PropTypes.string,
  text: PropTypes.string,
  image_alt1: PropTypes.string,
  link_button1: PropTypes.string,
  link_button8: PropTypes.string,
  image_src6: PropTypes.string,
  image_src5: PropTypes.string,
  text1: PropTypes.string,
  link_button9: PropTypes.string,
  image_src8: PropTypes.string,
  image_alt7: PropTypes.string,
  image_alt10: PropTypes.string,
  image_alt5: PropTypes.string,
  image_alt9: PropTypes.string,
  link_button6: PropTypes.string,
  image_src9: PropTypes.string,
  image_alt4: PropTypes.string,
  image_alt2: PropTypes.string,
  image_src10: PropTypes.string,
  link_Save: PropTypes.string,
  image_src4: PropTypes.string,
  link_button3: PropTypes.string,
  link_text: PropTypes.string,
  image_alt3: PropTypes.string,
  image_alt8: PropTypes.string,
  Save: PropTypes.string,
  image_src3: PropTypes.string,
  link_button2: PropTypes.string,
  heading1: PropTypes.string,
  image_alt6: PropTypes.string,
  image_src1: PropTypes.string,
  text2: PropTypes.string,
  image_src7: PropTypes.string,
}

export default ConnectedApps
