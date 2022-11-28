import React from 'react'

import { Helmet } from 'react-helmet'

import './continue-registration1.css'

const ContinueRegistration1 = (props) => {
  return (
    <div className="continue-registration1-container">
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
      <div className="continue-registration1-container1">
        <form
          id="form"
          name="register-form"
          action="/user/register"
          method="POST"
          target="self"
          autoComplete="on"
          className="continue-registration1-form"
        >
          <h1 className="continue-registration1-text notselectable">
            What should we call you?
          </h1>
          <div className="continue-registration1-container2">
            <div className="continue-registration1-container3">
              <span className="continue-registration1-text1 notselectable">
                Name
              </span>
              <input
                type="email"
                id="email"
                name="email"
                required="true"
                autoFocus="true"
                placeholder="John Doe"
                autoComplete="name"
                className="continue-registration1-textinput input"
              />
            </div>
            <div className="continue-registration1-container4">
              <span className="continue-registration1-text2 notselectable">
                Gender
              </span>
              <input
                type="email"
                id="email"
                name="email"
                required="true"
                autoFocus="true"
                placeholder="Male/Female/Other"
                autoComplete="name"
                className="continue-registration1-textinput1 input"
              />
            </div>
          </div>
          <button
            type="button"
            onclick="this.classList.toggle('submit--loading')"
            className="continue-registration1-button button"
          >
            <span className="button__text continue-registration1-text3">
              Continue
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContinueRegistration1
