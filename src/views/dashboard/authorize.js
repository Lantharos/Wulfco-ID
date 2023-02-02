import React from 'react'

import { Helmet } from 'react-helmet'

import './authorize.css'

const Authorize = (props) => {
  return (
    <div className="authorize-container">
      <Helmet>
        <title>Authorize App Connection</title>
        <meta
          name="description"
          content="An app is asking for permission to read your account information, would you like to approve it?"
        />
        <meta property="og:title" content="Authorize App Connection" />
        <meta
          property="og:description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="authorize-container1">
        <form
          id="form"
          name="authorize-form"
          action="/authorize"
          method="POST"
          target="self"
          autoComplete="on"
          className="authorize-form"
        >
          <h1 className="authorize-text notselectable">
            <span>Before you authorize...</span>
          </h1>
          <h1 className="authorize-text02 notselectable">
            <span>An app wants access</span>
            <br></br>
            <span>to your account.</span>
          </h1>
          <span id="email" className="authorize-text06">
            johndoe@gmail.com
          </span>
          <div className="authorize-container2">
            <span className="authorize-text07 notselectable">Password</span>
            <input
              type="password"
              id="password"
              name="password"
              required="true"              
              maxlength="20"
              minlength="3"
              autoComplete="current-password"
              className="authorize-textinput input"
            />
          </div>
          <button
            id="submit"
            name="submit"
            type="button"
            className="authorize-button button"
          >
            <span className="button__text authorize-text08">Authorize</span>
          </button>
          <span className="authorize-text09 notselectable">
            <span>Make sure you trust this app and if</span>
            <br></br>
            <span>
              you wish to revoke access, you can
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <br></br>
            <span>
              do
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>so in your account settings.</span>
          </span>
        </form>
      </div>
    </div>
  )
}

export default Authorize
