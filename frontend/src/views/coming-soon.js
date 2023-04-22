import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './coming-soon.css'

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <Helmet>
        <title>Loading - VikkiVuk ID</title>
        <meta
          name="description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC."
        />
        <meta property="og:title" content="Loading - VikkiVuk ID" />
        <meta
          property="og:description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="coming-soon-container1">
        <h1 className="coming-soon-text notselectable">
          <span className="coming-soon-text1">Coming soon!</span>
        </h1>
        <h1 className="coming-soon-text2 notselectable">
          <span>
            So sorry for the inconvenience but this part of the page is not
            publicly accessible
          </span>
          <br></br>
          <span>
            because it is under construction. Please bear with us, we are
            working hard!
          </span>
        </h1>
        <Link to={"/summary"} className="coming-soon-navlink button">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default ComingSoon
