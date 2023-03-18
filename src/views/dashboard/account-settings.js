import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import MyId from '../../components/pages/my-id'
import './account-settings.css'
import Profile from "../../components/pages/profile";
import Security from "../../components/pages/security";
import AuthorizedApps from "../../components/pages/authorized-apps";
import Devices from "../../components/pages/devices";
import ConnectedApps from "../../components/pages/connected-apps";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import cookies from 'react-cookies'
import hmac from 'crypto-js/hmac-sha256'
import AddFriend from "../../components/pages/add--friend";
import MyFriends from "../../components/pages/my-friends";

const config = require('../../config.json')
const api_url = config.api_url

const AccountSettings = () => {
  const [ selectedPage, setSelectedPage ] = React.useState("")
  let [ selectedButton, setSelectedButton ] = React.useState(document.getElementById('my-id'))
  const [ userData, setUserData ] = React.useState({
    profile: { avatar: "", username: "John Doe", about_me: "This is a test.", pronouns: "they/them", profile_color: "#008cff", friends: {friends: [], friend_requests: [], friend_requests_sent: []} },
    account: { security: { protected: false, security_keys: [] }, sessions: [] }
  })

  const loadUserData = () => {
    fetch(`${api_url}/id/get?id=${encodeURIComponent(cookies.load("id"))}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
        'W-Session': cookies.load('session_id'),
        'W-Loggen': cookies.load('loggen')
      }
    }).then((res) => {
      res.json().then((data) => {
        if (data.success) {
          setUserData(data.user)
          
        } else {
          toast.error("Failed to get user data!", { theme: "dark" })
        }
      })
    })
  }

  React.useEffect(() => {
    loadUserData();
  }, []);

  const switchPage = (page, button) => {
    setSelectedButton(button)
    setSelectedPage(page)
  }

  const buttonClick = (e) => {
    if (selectedButton) {
      selectedButton.className = selectedButton.className.replace("sidebar-button-selected", "sidebar-button")
    } else {
      selectedButton = document.getElementById('my-id')

      selectedButton.className = selectedButton.className.replace("sidebar-button-selected", "sidebar-button")
    }

    const buttonName = e.target.id
    const button = document.getElementById(buttonName)
    button.className = selectedButton.className.replace("sidebar-button", "sidebar-button-selected")

    switchPage(buttonName, button)
  }

  function logout() {
    fetch(`${api_url}/id/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Reason': 'logout'
      },
      body: JSON.stringify({
        uuid: cookies.load('id'),
        session: cookies.load('session_id'),
        loggen: cookies.load('loggen')
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
    }).catch(() => {
      toast.error("Something went wrong, please try again later", { theme: "dark" })
    })
  }

  function renderPage() {
    switch (selectedPage) {
      case 'my-id':
        return <MyId userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
      case 'profile':
        return <Profile userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
      case 'security':
        return <Security userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
      case 'authorized-apps':
        return <AuthorizedApps userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
      case 'devices':
        return <Devices userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
      case 'connections':
        return <ConnectedApps userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
      case 'friends':
        return <MyFriends userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
      case 'add-friend':
        return <AddFriend userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
      default:
        return <MyId userData={userData} switchPage={switchPage} saveUserData={setUserData} updateUserData={loadUserData}/>
    }
  }

  return (
      <div className="account-settings-container">
        <ToastContainer />
        <Helmet>
          <title>Account Settings</title>
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
              <button className="sidebar-button-selected button" id="my-id" type="button" onClick={buttonClick}>My ID</button>
              <button className="sidebar-button button" id="profile" type="button" onClick={buttonClick}>
                Profile
              </button>
              <button className="sidebar-button button" id="security" type="button" onClick={buttonClick}>
                Privacy &amp; Security
              </button>
              <button className="sidebar-button button" id="authorized-apps" type="button" onClick={buttonClick}>
                Authorized Apps
              </button>
              <button className="sidebar-button button" id="devices" type="button" onClick={buttonClick}>
                Devices
              </button>
              <button className="sidebar-button button" id="connections" type="button" onClick={buttonClick}>
                Connections
              </button>
            </div>
            <div className="account-settings-friends">
              <div className="account-settings-container1"></div>
              <span className="account-settings-text1 notselectable">
              FRIENDS
            </span>
              <button className="sidebar-button button" id="friends" type="button" onClick={buttonClick}>
                My Friends
              </button>
              <button className="sidebar-button button" id="add-friend" type="button" onClick={buttonClick}>
                Add a Friend
              </button>
              <button className="sidebar-button button" id="blocked" type="button" onClick={buttonClick}>
                Blocked
              </button>
            </div>
            <div className="account-settings-billing">
              <div className="account-settings-container2"></div>
              <span className="account-settings-text2 notselectable">
                BILLING
              </span>
              <Link to="/premium" className="sidebar-premium button">
                Premium
              </Link>
              <Link
                  to="/coming-soon"
                  className="sidebar-button button"
              >
                Subscriptions
              </Link>
              <Link
                  to="/coming-soon"
                  className="sidebar-button button"
              >
                Gifts
              </Link>
              <Link
                  to="/coming-soon"
                  className="sidebar-button button"
              >
                Billing
              </Link>
              <button className="sidebar-button button" id="my-card" type="button" onClick={buttonClick}>
                My Card
              </button>
            </div>
            <div className="account-settings-undefined">
              <div className="account-settings-container3"></div>
              <Link
                  to="/coming-soon"
                  className="sidebar-button button"
              >
                What&apos;s New
              </Link>
              <Link
                  to="/coming-soon"
                  className="sidebar-button button"
              >
                Developers
              </Link>
              <div className="account-settings-container4"></div>
            </div>
            <div className="account-settings-undefined1">
              <button id="logout" className="sidebar-button button" type="button" onClick={logout}>
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
