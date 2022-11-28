import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import MyID from '../../components/pages/my-i-d'
import './account-settings.css'
import Profile from "../../components/pages/profile";
import Security from "../../components/pages/security";
import AuthorizedApps from "../../components/pages/authorized-apps";
import Devices from "../../components/pages/devices";
import ConnectedApps from "../../components/pages/connected-apps";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import cookies from 'react-cookies'

let config = require('../../config.json')
let api_url = config.api_url

const AccountSettings = (props) => {
  let [ selectedPage, setSelectedPage ] = React.useState('my-id')
  let [ selectedButton, setSelectedButton ] = React.useState(document.getElementById('my-id'))

  const apiHealth = async () => {
    let response = false
    await fetch(api_url, {headers: {"X-Reason": "life_check"}}).then((res) => {
      response = true
    }).catch((err) => {
      toast.error("API is down, please try again later", { theme: "dark"})
    })

    return response
  }

  const buttonClick = (e) => {
    if (selectedButton) {
      selectedButton.style.backgroundColor = 'transparent'
      selectedButton.style.color = '#a6a6a6'
    } else {
      selectedButton = document.getElementById('my-id')
      selectedButton.style.backgroundColor = 'transparent'
      selectedButton.style.color = '#a6a6a6'
    }

    const buttonName = e.target.id
    const button = document.getElementById(buttonName)
    button.style.backgroundColor = 'rgba(43, 149, 255, 0.37)'
    button.style.color = 'rgb(0, 127, 255)'

    // this.setState({selectedButton: button})
    // this.setState({selectedPage: buttonName})
    //
    setSelectedButton(button)
    setSelectedPage(buttonName)

    // this.forceUpdate()
  }

  function logout() {
    fetch(api_url + '/id/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Reason': 'logout'
      },
      body: JSON.stringify({
        token: cookies.load('token'),
        id: cookies.load('id'),
        secret: cookies.load('secret'),
        loggen: cookies.load('loggen'),
        session_id: cookies.load('session_id')
      })
    }).then((res) => {
      if (res.status === 200) {
        cookies.remove('token')
        cookies.remove('id')
        cookies.remove('secret')
        cookies.remove('loggen')
        cookies.remove('session_id')

        window.location.href = '/login'
      } else {
        toast.error("Something went wrong, please try again later", { theme: "dark" })
      }
    }).catch((err) => {
      toast.error("Something went wrong, please try again later", { theme: "dark" })
    })
  }

  async function checkApiStatus() {
      let res = await apiHealth()
      if (!res) {
        document.getElementById('apidown').style.visibility = 'visible'
        document.getElementById('apidown').style.zIndex = '10'
      } else {
        document.getElementById('apidown').style.visibility = 'hidden'
        document.getElementById('apidown').style.zIndex = '-1'
      }
  }

  function renderPage() {
    checkApiStatus()

    switch (selectedPage) {
      case 'my-id':
        return <MyID />
      case 'profile':
        return <Profile />
      case 'security':
        return <Security />
      case 'authorized-apps':
        return <AuthorizedApps />
      case 'devices':
        return <Devices />
      case 'connections':
        return <ConnectedApps />
      default:
        return <MyID />
    }
  }

  return (
      <div className="account-settings-container">
        <ToastContainer />
        <Helmet>
          <title>Account Settings</title>
          <meta
              name="description"
              content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC."
          />
          <meta property="og:title" content="AccountSettings - VikkiVuk ID" />
          <meta
              property="og:description"
              content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
          />
          <meta
              property="og:image"
              content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
          />
        </Helmet>
        <Link to="/summary" className="account-settings-logout button">
          &lt;- Summary
        </Link>
        <div className="account-settings-main">
          <div className="account-settings-sidebar" >
            <div className="account-settings-user-settings">
            <span className="account-settings-text notselectable">
              USER SETTINGS
            </span>
              <button className="account-settings-button button" id="my-id" onClick={buttonClick}>My ID</button>
              <button className="account-settings-button01 button" id="profile" onClick={buttonClick}>
                Profile
              </button>
              <button className="account-settings-button02 button" id="security" onClick={buttonClick}>
                Privacy &amp; Security
              </button>
              <button className="account-settings-button03 button" id="authorized-apps" onClick={buttonClick}>
                Authorized Apps
              </button>
              <button className="account-settings-button04 button" id="devices" onClick={buttonClick}>
                Devices
              </button>
              <button className="account-settings-button05 button" id="connections" onClick={buttonClick}>
                Connections
              </button>
            </div>
            <div className="account-settings-friends">
              <div className="account-settings-container1"></div>
              <span className="account-settings-text1 notselectable">
              FRIENDS
            </span>
              <button className="account-settings-button06 button" id="friends" onClick={buttonClick}>
                Your Friends
              </button>
              <button className="account-settings-button07 button" id="add-friend" onClick={buttonClick}>
                Add a Friend
              </button>
              <button className="account-settings-button08 button" id="pending-invites" onClick={buttonClick}>
                Pending Invites
              </button>
              <button className="account-settings-button09 button" id="blocked" onClick={buttonClick}>
                Blocked
              </button>
              <button className="account-settings-button10 button" id="followed-profiles" onClick={buttonClick}>
                Followed Profiles
              </button>
            </div>
            <div className="account-settings-billing">
              <div className="account-settings-container2"></div>
              <span className="account-settings-text2 notselectable">
              BILLING
            </span>
              <Link to="/premium" className="account-settings-navlink button">
                Premium
              </Link>
              <Link
                  to="/coming-soon"
                  className="account-settings-navlink1 button"
              >
                Subscriptions
              </Link>
              <Link
                  to="/coming-soon"
                  className="account-settings-navlink2 button"
              >
                Gifts
              </Link>
              <Link
                  to="/coming-soon"
                  className="account-settings-navlink3 button"
              >
                Billing
              </Link>
              <button className="account-settings-button05 button" id="my-card" onClick={buttonClick}>
                My Card
              </button>
            </div>
            <div className="account-settings-undefined">
              <div className="account-settings-container3"></div>
              <Link
                  to="/coming-soon"
                  className="account-settings-navlink4 button"
              >
                What&apos;s New
              </Link>
              <Link
                  to="/coming-soon"
                  className="account-settings-navlink5 button"
              >
                Developers
              </Link>
              <div className="account-settings-container4"></div>
            </div>
            <div className="account-settings-undefined1">
              <button id="logout" className="account-settings-button11 button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
          <div>
            {renderPage()}
          </div>
        </div>
        <div className="account-settings-screen-size-warning">
          <h1 className="account-settings-text3 notselectable">
            <span className="account-settings-text4">Sorry but...</span>
          </h1>
          <h1 className="account-settings-text5">
          <span>
            So sorry, but currently we only support Desktop or any Desktop Sized
            Screen,
          </span>
            <br></br>
            <span>
            this is due to overflow and rendering issues, this might be removed
            in the future.
          </span>
          </h1>
          <a
              href="https://accounts.vikkivuk.xyz/r/home?check=false"
              target="_blank"
              rel="noreferrer noopener"
              className="account-settings-link button"
          >
            Go Home
          </a>
        </div>
        <div className="account-settings-a-p-i-down" id="apidown">
          <h1 className="account-settings-text09 notselectable">
            <span className="account-settings-text10">Sorry but...</span>
          </h1>
          <h1 className="account-settings-text11">
          <span>
            It looks like the API is unavailable or offline, this is not your
            fault! Please try
          </span>
            <br></br>
            <span>again later.</span>
            <br></br>
          </h1>
          <a
              href="/public"
              target="_self"
              rel="noreferrer noopener"
              className="account-settings-link1 button"
          >
            Go Home
          </a>
        </div>
      </div>
  )
}

export default AccountSettings
