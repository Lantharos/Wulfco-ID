import React from 'react'

import { Helmet } from 'react-helmet'

import './verify-email.css'

const VerifyEmail = (props) => {
  return (
    <div className="verify-email-container">
      <Helmet>
        <title>One Code</title>
        <meta
          name="description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC."
        />
        <meta property="og:title" content="One Code" />
        <meta
          property="og:description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="verify-email-container1">
        <form
          id="form"
          name="login-form"
          action="/user/onecode"
          method="POST"
          target="self"
          autoComplete="on"
          className="verify-email-form"
        >
          <h1 className="verify-email-text notselectable">
            Email Verification
          </h1>
          <span className="verify-email-text1 notselectable">
            To verify you own this email, we have sent a one-time code to your
            email address.
          </span>
          <div className="verify-email-container2">
            <span className="verify-email-text2 notselectable">Code</span>
            <input
              type="number"
              id="code"
              max="6"
              min="6"
              name="code"
              step="0"
              required="true"
              autoFocus="true"
              placeholder="000000"
              autoComplete="off"
              className="verify-email-textinput input"
            />
          </div>
          <button
            id="submit"
            type="button"
            onClick="this.classList.toggle('submit--loading')"
            className="verify-email-button button"
          >
            <span className="button__text verify-email-text3">Verify</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default VerifyEmail
