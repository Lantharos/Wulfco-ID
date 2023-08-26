import React from 'react'
import { Link } from 'react-router-dom'

import './home.css'

const Home = () => {
  return (
    <div className="home-container">
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
          <span className="home-text1">Everything you need, </span>
          <span className="home-text2">all in one place.</span>
        </h1>
        <h1 className="home-text3">
          With a Wulfco ID, you can use any service and api you wish to use.
        </h1>
        <Link to="/create-id" className="home-navlink4 button">
          Create an ID
        </Link>
        <div className="home-links">
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noreferrer noopener"
            className="home-link button"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            target="_blank"
            rel="noreferrer noopener"
            className="home-link1 button"
          >
            Terms of Service
          </a>
        </div>
      </div>
      <button className="home-button button" type="button">↓</button>
    </div>
  )
}

export default Home
