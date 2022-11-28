import React from 'react'

import { Helmet } from 'react-helmet'

import './continue-registration2.css'

const ContinueRegistration2 = (props) => {
  return (
    <div className="continue-registration2-container">
      <Helmet>
        <title>Create an Account</title>
        <meta
          name="description"
          content="Don't have an account? No worries! Just create one, today, for free."
        />
        <meta property="og:title" content="Create an Account" />
        <meta
          property="og:description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="continue-registration2-container1">
        <div className="continue-registration2-container2">
          <span className="continue-registration2-text notselectable">
            CONNECT YOUR ACCOUNTS
          </span>
          <div className="continue-registration2-container3">
            <a
              href="https://id.vikkivuk.xyz/personalization/connections/facebook/connect?cr=account_signup&amp;redirect=true"
              target="_blank"
              rel="noreferrer noopener"
              className="continue-registration2-link button"
            >
              <img
                alt="image"
                src="https://www.socialmediabutterflyblog.com/wp-content/uploads/sites/567/2021/01/Facebook-logo-500x350-1.png"
                loading="eager"
                className="continue-registration2-image"
              />
            </a>
            <a
              href="https://id.vikkivuk.xyz/personalization/connections/github/connect?cr=account_signup&amp;redirect=true"
              target="_blank"
              rel="noreferrer noopener"
              className="continue-registration2-link1 button"
            >
              <img
                alt="image"
                src="https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/github.png?v=1652550848213"
                className="continue-registration2-image1"
              />
            </a>
            <a
              href="https://id.vikkivuk.xyz/personalization/connections/reddit/connect?cr=account_signup&amp;redirect=true"
              target="_blank"
              rel="noreferrer noopener"
              className="continue-registration2-link2 button"
            >
              <img
                alt="image"
                src="https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png"
                className="continue-registration2-image2"
              />
            </a>
            <a
              href="https://id.vikkivuk.xyz/personalization/connections/steam/connect?cr=account_signup&amp;redirect=true"
              target="_blank"
              rel="noreferrer noopener"
              className="continue-registration2-link3 button"
            >
              <img
                alt="image"
                src="https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/steam.png?v=1652550856148"
                className="continue-registration2-image3"
              />
            </a>
            <a
              href="https://id.vikkivuk.xyz/personalization/connections/youtube/connect?cr=account_signup&amp;redirect=true"
              target="_blank"
              rel="noreferrer noopener"
              className="continue-registration2-link4 button"
            >
              <img
                alt="image"
                src="https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/youtube.png?v=1652550860224"
                className="continue-registration2-image4"
              />
            </a>
            <a
              href="https://id.vikkivuk.xyz/personalization/connections/twitch/connect?cr=account_signup&amp;redirect=true"
              target="_blank"
              rel="noreferrer noopener"
              className="continue-registration2-link5 button"
            >
              <img
                alt="image"
                src="https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/twitch.png?v=1652550942504"
                className="continue-registration2-image5"
              />
            </a>
            <a
              href="https://id.vikkivuk.xyz/personalization/connections/discord/connect?cr=account_signup&amp;redirect=true"
              target="_blank"
              rel="noreferrer noopener"
              className="continue-registration2-link6 button"
            >
              <img
                alt="image"
                src="https://cdn.glitch.global/ff3fc2c0-c60a-47f0-a6a1-d1932dbc2a03/discord.png?v=1652550843864"
                className="continue-registration2-image6"
              />
            </a>
          </div>
        </div>
        <div className="continue-registration2-container4">
          <form
            id="form"
            name="register-form"
            action="/user/register"
            method="POST"
            target="self"
            autoComplete="on"
            className="continue-registration2-form"
          >
            <h1 className="continue-registration2-text1 notselectable">
              Hello, John Doe!
            </h1>
            <div className="continue-registration2-container5">
              <span className="continue-registration2-text2 notselectable">
                Username
              </span>
              <input
                type="email"
                id="email"
                name="email"
                required="true"
                autoFocus="true"
                placeholder="john_doe"
                autoComplete="name"
                className="continue-registration2-textinput input"
              />
            </div>
            <button
              type="button"
              onclick="this.classList.toggle('submit--loading')"
              className="continue-registration2-button button"
            >
              <span className="button__text continue-registration2-text3">
                Finish Registration
              </span>
            </button>
            <div className="continue-registration2-container6">
              <button className="continue-registration2-button1 button">
                <span className="continue-registration2-text4"> </span>
              </button>
              <img
                alt="image"
                src="https://play.teleporthq.io/static/svg/default-img.svg"
                className="continue-registration2-image7"
              />
            </div>
          </form>
        </div>
        <div className="continue-registration2-container7">
          <span className="continue-registration2-text5 notselectable">
            2FA Protection
          </span>
          <span className="continue-registration2-text6 notselectable">
            After you register, to enable 2FA (highly recommended), please go to
            the Privacy &amp; Safety page, where you can enable 1 or multiple
            2FA methods.
          </span>
        </div>
      </div>
    </div>
  )
}

export default ContinueRegistration2
