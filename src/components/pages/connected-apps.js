import React from 'react'

import PropTypes from 'prop-types'

import './connected-apps.css'

const ConnectedApps = (props) => {
  return (
    <div className="connected-apps-content">
      <h1 className="connected-apps-text notselectable">{props.heading}</h1>
      <div className="connected-apps-container">
        <div className="connected-apps-container1">
          <h1 className="connected-apps-text1 notselectable">
            {props.heading1}
          </h1>
          <span className="connected-apps-text2 notselectable">
            {props.text}
          </span>
          <a
            href={props.link_text}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link"
          >
            {props.text1}
          </a>
        </div>
        <div className="connected-apps-container2">
          <a
            href={props.link_button}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link01 button"
          >
            <img
              alt={props.image_alt}
              src={props.image_src}
              loading="eager"
              className="connected-apps-image"
            />
          </a>
          <a
            href={props.link_button1}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link02 button"
          >
            <img
              alt={props.image_alt1}
              src={props.image_src1}
              className="connected-apps-image01"
            />
          </a>
          <a
            href={props.link_button2}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link03 button"
          >
            <img
              alt={props.image_alt2}
              src={props.image_src2}
              className="connected-apps-image02"
            />
          </a>
          <a
            href={props.link_button3}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link04 button"
          >
            <img
              alt={props.image_alt3}
              src={props.image_src3}
              className="connected-apps-image03"
            />
          </a>
          <a
            href={props.link_button4}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link05 button"
          >
            <img
              alt={props.image_alt4}
              src={props.image_src4}
              className="connected-apps-image04"
            />
          </a>
          <a
            href={props.link_button5}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link06 button"
          >
            <img
              alt={props.image_alt5}
              src={props.image_src5}
              className="connected-apps-image05"
            />
          </a>
          <a
            href={props.link_button6}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link07 button"
          >
            <img
              alt={props.image_alt6}
              src={props.image_src6}
              className="connected-apps-image06"
            />
          </a>
          <a
            href={props.link_button7}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link08 button"
          >
            <img
              alt={props.image_alt7}
              src={props.image_src7}
              className="connected-apps-image07"
            />
          </a>
          <a
            href={props.link_button8}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link09 button"
          >
            <img
              alt={props.image_alt8}
              src={props.image_src8}
              className="connected-apps-image08"
            />
          </a>
          <a
            href={props.link_button9}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link10 button"
          >
            <img
              alt={props.image_alt9}
              src={props.image_src9}
              className="connected-apps-image09"
            />
          </a>
          <a
            href={props.link_button10}
            target="_blank"
            rel="noreferrer noopener"
            className="connected-apps-link11 button"
          >
            <img
              alt={props.image_alt10}
              src={props.image_src10}
              className="connected-apps-image10"
            />
          </a>
        </div>
      </div>
      <div className="connected-apps-container3">
        <div className="connected-apps-container4">
          <span className="connected-apps-text3 notselectable">
            {props.text2}
          </span>
          <span className="connected-apps-text4 notselectable">
            {props.text3}
          </span>
        </div>
        <a
          href={props.link_Save}
          id="add_balance"
          className="connected-apps-save button"
        >
          {props.Save}
        </a>
      </div>
    </div>
  )
}

ConnectedApps.defaultProps = {
  link_button10: 'https://id.vikkivuk.xyz/connections/xbox/connect',
  link_button5: 'https://id.vikkivuk.xyz/connections/youtube/connect',
  link_button7: 'https://id.vikkivuk.xyz/connections/discord/connect',
  heading: 'Connections',
  image_src2:
    'https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png',
  text3: 'You can also import your connections from Discord!',
  link_button4: 'https://id.vikkivuk.xyz/connections/twitter/connect',
  text: "This information will not be shared outside of Wulfco without your permission, and is used in accordance with Wulfco's",
  image_alt1: 'image',
  link_button1: 'https://id.vikkivuk.xyz/connections/github/connect',
  link_button8: 'https://id.vikkivuk.xyz/connections/spotify/connect',
  image_src6:
    'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/twitch.png?v=1652550942504',
  image_src5:
    'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/youtube.png?v=1652550860224',
  link_button: 'https://id.vikkivuk.xyz/connections/facebook/connect',
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
  image_src:
    'https://www.socialmediabutterflyblog.com/wp-content/uploads/sites/567/2021/01/Facebook-logo-500x350-1.png',
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
  Save: 'Import my connections from Discord',
  image_src3:
    'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/steam.png?v=1652550856148',
  image_alt: 'image',
  link_button2: 'https://id.vikkivuk.xyz/connections/reddit/connect',
  heading1: 'Add accounts to your profile',
  image_alt6: 'image',
  image_src1:
    'https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/github.png?v=1652550848213',
  text2: 'IMPORT',
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
  link_button: PropTypes.string,
  text1: PropTypes.string,
  link_button9: PropTypes.string,
  image_src8: PropTypes.string,
  image_alt7: PropTypes.string,
  image_alt10: PropTypes.string,
  image_alt5: PropTypes.string,
  image_alt9: PropTypes.string,
  link_button6: PropTypes.string,
  image_src9: PropTypes.string,
  image_src: PropTypes.string,
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
  image_alt: PropTypes.string,
  link_button2: PropTypes.string,
  heading1: PropTypes.string,
  image_alt6: PropTypes.string,
  image_src1: PropTypes.string,
  text2: PropTypes.string,
  image_src7: PropTypes.string,
}

export default ConnectedApps
