import React from 'react'

import { Helmet } from 'react-helmet'

import './change-password.css'

const ChangePassword = (props) => {
  return (
    <div className="change-password-container">
      <Helmet>
        <title>Reset Password LS</title>
        <meta name="description" content="Continue resetting your password." />
        <meta property="og:title" content="Reset Password LS" />
        <meta
          property="og:description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="change-password-container1">
        <form
          id="form"
          name="login-form"
          action="/user/change-password"
          method="POST"
          target="self"
          autoComplete="on"
          className="change-password-form"
        >
          <h1 className="change-password-text notselectable">Last Step!</h1>
          <span className="change-password-text1 notselectable">
            Now that you verified your email, just enter your new password.
          </span>
          <div className="change-password-container2">
            <span className="change-password-text2 notselectable">
              New Password
            </span>
            <input
              type="password"
              id="password"
              name="password"
              required="true"
              maxLength="20"
              minLength="3"
              placeholder="• • • • • • • • • "
              autoComplete="new-password"
              className="change-password-textinput input"
            />
          </div>
          <div className="change-password-container3">
            <span className="change-password-text3 notselectable">
              Confirm Password
            </span>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              required="true"              
              maxLength="20"
              minLength="3"
              placeholder="••••••••••••••••"
              autoComplete="new-password"
              className="change-password-textinput1 input"
            />
          </div>
          <button
            id="submit"
            type="button"
            onClick="this.classList.toggle('submit--loading')"
            className="change-password-button button"
          >
            <span className="button__text change-password-text4">
              Change Password
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
