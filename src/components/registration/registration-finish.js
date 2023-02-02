import React from 'react'

import PropTypes from 'prop-types'

import './registration-finish.css'
import cookies from 'react-cookies'
import { motion } from 'framer-motion'
let config = require('../../config.json')
let api_url = config.api_url

const RegistrationFinish = (props) => {
  console.log(props)
  console.log(props.firstname)
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)

    let obj = {}
    data.forEach((value, key) => {
      obj[key] = value
    })

    props.handler(1, obj)
  }

  return (
    <motion.div className={`registration-finish-container`} key={"finish"} initial={{ x: "-100vh", opacity: 0 }} animate={{ x: "0vh", opacity: 1, transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 500,
        damping: 25
      } }} exit={{ x: "100vh", opacity: 0 }}>
      <div className="registration-finish-container1">
        <span className="registration-finish-text notselectable">
          CONNECT YOUR ACCOUNTS
        </span>
        <div className="registration-finish-container2">
          <a
            href={`${api_url}/id/connections/facebook?redirect=https://id.wulfco.xyz&referrer=registration&rsession=${cookies.load('r-session')}&stage=2`}
            target="_self"
            className="registration-finish-link button"
          >
            <img
              alt="Facebook Connection"
              src={"assets/facebook.png"}
              loading="eager"
              className="registration-finish-image"
            />
          </a>
          <a
            href={`${api_url}/id/connections/github?redirect=https://id.wulfco.xyz&referrer=registration&rsession=${cookies.load('r-session')}&stage=2`}
            target="_self"
            className="registration-finish-link1 button"
          >
            <img
              alt="GitHub Connection"
              src={"assets/github.png"}
              className="registration-finish-image1"
            />
          </a>
          <a
              href={`${api_url}/id/connections/reddit?redirect=https://id.wulfco.xyz&referrer=registration&rsession=${cookies.load('r-session')}&stage=2`}
              target="_self"
              className="registration-finish-link3 button"
          >
            <img
                alt="Reddit Connection"
                src={"assets/reddit.png"}
                className="registration-finish-image3"
            />
          </a>
          <a
            href={`${api_url}/id/connections/steam?redirect=https://id.wulfco.xyz&referrer=registration&rsession=${cookies.load('r-session')}&stage=2`}
            target="_self"
            className="registration-finish-link2 button"
          >
            <img
              alt="Steam Connection"
              src={"assets/steam.png"}
              className="registration-finish-image2"
            />
          </a>

          <a
            href={`${api_url}/id/connections/youtube?redirect=https://id.wulfco.xyz&referrer=registration&rsession=${cookies.load('r-session')}&stage=2`}
            target="_self"
            className="registration-finish-link4 button"
          >
            <img
              alt="YouTube Connection"
              src={"assets/youtube.png"}
              className="registration-finish-image4"
            />
          </a>
          <a
            href={`${api_url}/id/connections/twitch?redirect=https://id.wulfco.xyz&referrer=registration&rsession=${cookies.load('r-session')}&stage=2`}
            target="_self"
            className="registration-finish-link5 button"
          >
            <img
              alt="Twitch Connection"
              src={"assets/twitch.png"}
              className="registration-finish-image5"
            />
          </a>
          <a
            href={`${api_url}/id/connections/discord?redirect=https://id.wulfco.xyz&referrer=registration&rsession=${cookies.load('r-session')}&stage=2`}
            target="_self"
            className="registration-finish-link6 button"
          >
            <img
              alt="Discord Connection"
              src={"assets/discord.png"}
              className="registration-finish-image6"
            />
          </a>
        </div>
      </div>
      <div className="registration-finish-container3">
        <form
          id="form"
          name="register-form"
          autoComplete="on"
          onSubmit={handleSubmit}
          className="registration-finish-form"
        >
          <h1 className="registration-finish-text1 notselectable">
            {`Hello, ${props.firstname}!`}
          </h1>
          <div className="registration-finish-container4">
            <span className="registration-finish-text2 notselectable">
              Username
            </span>
            <input
              type="username"
              id="username"
              name="username"
              required="true"
              autoFocus="true"
              placeholder="john_doe"
              autoComplete="username"
              className="registration-finish-textinput input"
            />
          </div>
          <button
            type="submit"
            className="registration-finish-button button"
          >
            <span className="button__text registration-finish-text3">
              Finish Registration
            </span>
          </button>
          <div className="registration-finish-container5">
            <button type="button" className="registration-finish-button1 button">
              <span className="registration-finish-text4"></span>
            </button>
            <img
              alt="Your Profile Picture"
              src={`https://api.dicebear.com/5.x/identicon/svg?seed=${props.firstname}`}
              className="registration-finish-image7"
            />
          </div>
        </form>
      </div>
      <div className="registration-finish-container6">
        <span className="registration-finish-text5 notselectable">
          2FA Protection
        </span>
        <span className="registration-finish-text6 notselectable">
          After you register, to enable 2FA (highly recommended), please go to the Privacy & Safety page, where you can enable 1 or multiple 2FA methods.
        </span>
      </div>
    </motion.div>
  )
}

export default RegistrationFinish
