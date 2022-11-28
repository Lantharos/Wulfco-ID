import React from 'react'

import { Helmet } from 'react-helmet'

import './reset-password.css'

const ResetPassword = (props) => {
  return (
    <div className="reset-password-container">
      <Helmet>
        <title>Reset your password</title>
        <meta
          name="description"
          content="Forgot your password? No worries, just enter your email and we'll send a link to reset your password!"
        />
        <meta property="og:title" content="Reset your password" />
        <meta
          property="og:description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="reset-password-container1">
        <form
          id="form"
          name="login-form"
          action="/user/reset-password"
          method="POST"
          target="self"
          autoComplete="on"
          className="reset-password-form"
        >
          <h1 className="reset-password-text notselectable">
            Reset your Password
          </h1>
          <span className="reset-password-text1 notselectable">
            We see you&apos;re having issues logging in, please enter your email
            down below so we can send a link to reset your pass.
          </span>
          <div className="reset-password-container2">
            <span className="reset-password-text2 notselectable">Email</span>
            <input
              type="email"
              id="email"
              name="email"
              required="true"
              autoFocus="true"
              placeholder="johndoe@yourdomain.com"
              autoComplete="email"
              className="reset-password-textinput input"
            />
          </div>
          <div className="reset-password-container3">
            <span className="reset-password-text3 notselectable">
              Last (known) Password
            </span>
            <input
              type="password"
              id="lastpass"
              name="lastpass"
              required="true"
              autoFocus="true"
              maxlength="20"
              minlength="3"
              placeholder="••••••••••••••••"
              autoComplete="current-password"
              className="reset-password-textinput1 input"
            />
          </div>
          <button
            id="submit"
            type="button"
            onclick="this.classList.toggle('submit--loading')"
            className="reset-password-button button"
          >
            <span className="button__text reset-password-text4">Send Link</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
