import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './home.css'

const Home = (props) => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Wulfco ID</title>
        <meta
          name="description"
          content="Welcome to Wulfco ID, in order to use any service Wulfco LLC provides, you will need to have an ID."
        />
        <meta property="og:title" content="Wulfco ID" />
        <meta
          property="og:description"
          content="Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco. This enhances your user experience drastically by limiting the amount of accounts you need to remember and manage."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/8e5ef9b8-3400-45ee-b161-2b80820e5f5e?org_if_sml=1"
        />
      </Helmet>
      <div className="home-container01">
        <div className="home-container02">
          <Link to="/" className="home-navlink button">
            ABOUT
          </Link>
          <div className="home-container03"></div>
        </div>
        <div className="home-container04">
          <Link to="/login" className="home-navlink1 button">
            LOGIN
          </Link>
          <div className="home-container05"></div>
        </div>
        <div className="home-container06">
          <Link to="/coming-soon" className="home-navlink2 button">
            DEVS
          </Link>
          <div className="home-container07"></div>
        </div>
        <div className="home-container08">
          <Link to="/coming-soon" className="home-navlink3 button">
            FAQ
          </Link>
          <div className="home-container09"></div>
        </div>
      </div>
      <div className="home-container10">
        <h1 className="home-text">
          <span className="home-text1">
            Everything you need,
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="home-text2">all in one place.</span>
        </h1>
        <h1 className="home-text3">
          With a Wulfco ID, you can use any service and api you wish to use.
        </h1>
        <Link to="/start-registration" className="home-navlink4 button">
          Create an ID
        </Link>
        <div className="home-links">
          <a
            href="/legal/privacy-policy"
            target="_blank"
            rel="noreferrer noopener"
            className="home-link button"
          >
            Privacy Policy
          </a>
          <a
            href="/legal/terms-of-service"
            target="_blank"
            rel="noreferrer noopener"
            className="home-link1 button"
          >
            Terms of Service
          </a>
        </div>
      </div>
      <button className="home-button button">↓</button>
    </div>
  )
}

export default Home
