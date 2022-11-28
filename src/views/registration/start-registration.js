import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './start-registration.css'

const StartRegistration = (props) => {
  return (
    <div className="start-registration-container">
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
      <div className="start-registration-container1">
        <form
          id="form"
          name="register-form"
          action="/user/register"
          method="POST"
          target="self"
          autoComplete="on"
          className="start-registration-form"
        >
          <h1 className="start-registration-text notselectable">
            Create an ID
          </h1>
          <div className="start-registration-container2">
            <span className="start-registration-text1 notselectable">
              Email
            </span>
            <input
              type="email"
              id="email"
              name="email"
              pattern=".+@gmail.com"
              required="true"
              autoFocus="true"
              minlength="5"
              placeholder="johndoe@yourdomain.com"
              autoComplete="email"
              className="start-registration-textinput input"
            />
          </div>
          <div className="start-registration-container3">
            <span className="start-registration-text2 notselectable">
              Password
            </span>
            <input
              type="password"
              id="password"
              name="password"
              pattern=".+@gmail.com"
              required="true"
              autoFocus="true"
              minlength="5"
              placeholder="••••••••••••••••••"
              autoComplete="email"
              className="start-registration-textinput1 input"
            />
          </div>
          <button
            type="button"
            onclick="this.classList.toggle('submit--loading')"
            className="start-registration-button button"
          >
            <span className="button__text start-registration-text3">
              Continue
            </span>
          </button>
          <div className="start-registration-container4">
            <span className="start-registration-text4 notselectable">
              Already have an ID?
            </span>
            <Link to="/login" className="start-registration-navlink">
              <span>Log in.</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StartRegistration
