import React from 'react'

import { Helmet } from 'react-helmet'

import AuthorizedAppPermission from '../../components/pages/page_components/authorized-app-permission'
import './authorize.css'
import cookies from "react-cookies";
import hmac from "crypto-js/hmac-sha256";
import {toast, ToastContainer} from "react-toastify";
import {AnimatePresence} from "framer-motion";
const config = require('../../config.json')
const api_url = config.api_url
import EnterPassword from "../../components/dialogs/enter-password";
import {redirect} from "react-router-dom";
import ReactDom from "react-dom";

const Authorize = (props) => {
  const [ enterPassword, setEnterPassword ] = React.useState({})
  const [appData, setAppData] = React.useState({ name: "Loading..." })

  const getUrlParameter = (sParam) => {
    const sPageURL = window.location.search.substring(1)
    const sURLVariables = sPageURL.split('&')
    let returner = false
    sURLVariables.forEach((paramName) => {
      const sParameterName = paramName.split('=')
      if (sParameterName[0] === sParam) {
        returner = sParameterName[1]
      }
    })
    return returner
  }

  const authorize = () => {
      setEnterPassword({
          after: function () {
              fetch(`${api_url}/id/authorize?app=${appData.id}&id=${encodeURIComponent(cookies.load("id"))}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
                      'W-Session': cookies.load('session_id'),
                      'W-Loggen': cookies.load('loggen')
                  },
                  body: JSON.stringify({
                      redirect_uri: appData.redirect_uri,
                      state: appData.state,
                      scopes: appData.scopes,
                      response_type: appData.response_type
                  })
              }).then((res) => {
                  res.json().then((data) => {
                      if (data.success) {
                          window.location.href = data.redirect_uri
                      } else {
                          toast.error('Failed to authorize', { theme: 'dark', autoClose: 2000 });
                      }
                  })
              }).catch(() => {
                  toast.error('Failed to authorize', { theme: 'dark', autoClose: 2000 });
              })
          }
      })
  }

  const loadPage = () => {
      if (appData.name !== "Loading...") {
          return;
      }
    const client_id = decodeURIComponent(getUrlParameter('client_id'))
    const redirect_uri = decodeURIComponent(getUrlParameter('redirect_uri'))
    const state = decodeURIComponent(getUrlParameter('state'))
    const scope = decodeURIComponent(getUrlParameter('scopes'))
    const response_type = decodeURIComponent(getUrlParameter('response_type'))

    if (cookies.load("session_id")) {
      fetch(`${api_url}/id/oauth?app=${client_id}&id=${encodeURIComponent(cookies.load("id"))}`, {
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
            if (!data.app.redirects.includes(redirect_uri)) {
              toast.error('Invalid redirect uri', { theme: 'dark', autoClose: 2000 });
              redirect(`$/login?redirect_uri=${encodeURIComponent(redirect_uri)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}&response_type=${encodeURIComponent(response_type)}&client_id=${encodeURIComponent(client_id)}`)
            } else {
                document.getElementById('app_avatar').src = data.app.avatar ? data.app.avatar : "assets/cloud.png"
                document.getElementById('avatar').src = data.user_avatar

                setAppData({
                    name: data.app.name,
                    id: data.app.id,
                    redirect_uri: redirect_uri,
                    state: state,
                    scopes: scope.split(' '),
                    response_type: response_type
                })

                fetch(`${api_url}/id/scopes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        scopes: scope.split(' ')
                    })
                }).then((res) => {
                    res.json().then((data) => {
                        if (data.success) {
                            const scopes = []
                            data.scopes.forEach((permission) => {
                                scopes.push(<AuthorizedAppPermission
                                    rootClassName="authorized-app-permission-root-class-name5"
                                    permission={permission}
                                ></AuthorizedAppPermission>)
                            })

                            ReactDom.render(scopes, document.getElementById('scopes'))
                        } else {
                            toast.error('Failed to load app data', { theme: 'dark', autoClose: 2000 });
                        }
                    })
                }).catch((err) => {
                    toast.error('Failed to load app data', { theme: 'dark', autoClose: 2000 });
                })
            }
          } else {
            toast.error('Failed to load app data', { theme: 'dark', autoClose: 2000 });
          }
        });
      }).catch((err) => {
        toast.error('Failed to load app data', { theme: 'dark', autoClose: 2000 });
      })
    } else {
        toast.error('You are not logged in', { theme: 'dark', autoClose: 2000 });
        window.location.href = `/login?redirect_uri=${encodeURIComponent(redirect_uri)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}&response_type=${encodeURIComponent(response_type)}&client_id=${encodeURIComponent(client_id)}`
    }
  }

  return (
    <div className="authorize-container">
      <ToastContainer />
      <Helmet>
        <title>Authorize App Connection</title>
        <meta
          name="description"
          content="An app is asking for permission to read your account information, would you like to approve it?"
        />
        <meta property="og:title" content="Authorize App Connection" />
        <meta
          property="og:description"
          content="An app is asking for permission to read your account information, would you like to approve it?"
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/10f1cb93-1683-40cb-80dc-d58305d2dd58?org_if_sml=1"
        />
      </Helmet>
      <AnimatePresence>
        {enterPassword.after && <EnterPassword setEnterPassword={setEnterPassword} enterPassword={enterPassword} />}
      </AnimatePresence>
        <div className="authorize-container1">
        <div className="authorize-container2">
            {loadPage()}

            <h1 id="app_name" className="authorize-text notselectable">{appData.name} wants to connect to your ID.</h1>
          <div className="authorize-container3">
            <div className="authorize-container4">
              <img
                src="https://play.teleporthq.io/static/svg/default-img.svg"
                alt="image"
                id="avatar"
                className="authorize-image"
              />
              <h1 className="authorize-text3 notselectable">+</h1>
              <img
                src="assets/cloud.png"
                alt="image"
                id="app_avatar"
                className="authorize-image1"
              />
            </div>
            <div id="scopes" className="authorize-container5"></div>
          </div>
          <button
            type="button"
            className="authorize-button button"
            disabled={appData.name === "Loading..."}
            onClick={authorize}
          >
            <span className="button__text authorize-text4">Authorize</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Authorize
