import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './premium.css'

const Premium = () => {
  return (
    <div className="premium-container">
      <Helmet>
        <title>Premium - VikkiVuk ID</title>
        <meta
          name="description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC."
        />
        <meta property="og:title" content="Premium - VikkiVuk ID" />
        <meta
          property="og:description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="premium-container1">
        <div className="premium-container2">
          <h1 className="premium-text">👑 Most Popular</h1>
          <h1 className="premium-text01">MVP Plan</h1>
          <span className="premium-text02">
            <span>
              With this you get stuff from base plan and:
            </span>
            <br></br>
            <span>Lower Ratelimit (1000req/s)</span>
            <br></br>
            <span>Priority Feedback</span>
            <br></br>
            <span>...prob some stuff i forgot to name</span>
          </span>
          <button className="premium-button button" type="button">
            <span className="premium-text10">Subscribe ($4.99)</span>
          </button>
        </div>
        <div className="premium-container3">
          <h1 className="premium-text11">👑 Best Value</h1>
          <h1 className="premium-text12">Elite Plan</h1>
          <span className="premium-text13">
            <span>
              With this you get stuff from the plans and:
            </span>
            <br></br>
            <span></span>
            <span>Access to unreleased content</span>
            <br></br>
            <span>Be the first to see unreleased stuff</span>
            <br></br>
            <span>Wolfie Premium</span>
            <br></br>
            <span>...and more!</span>
          </span>
          <button className="premium-button1 button" type="button">
            <span className="premium-text24">Subscribe ($9.99)</span>
          </button>
        </div>
        <div className="premium-container4">
          <h1 className="premium-text25">Premium Plan</h1>
          <span className="premium-text26">
            <span>This is the base plan, with this plan you get:</span>
            <br></br>
            <span>Access to more APIs</span>
            <br></br>
            <span>Priority Support</span>
            <br></br>
            <span>...prob some stuff i forgot to name</span>
            <br></br>
          </span>
          <button className="premium-button2 button" type="button">
            <span className="premium-text35">Subscribe ($2.99)</span>
          </button>
        </div>
        <Link to="/account-settings" className="premium-logout button">
          &lt;- Back
        </Link>
      </div>
    </div>
  )
}

export default Premium
