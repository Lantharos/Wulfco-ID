import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './login.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import detectEthereumProvider from '@metamask/detect-provider';
import cookies from 'react-cookies'
import hmac from "crypto-js/hmac-sha256";
import QRCodeStyling from 'qr-code-styling';

const config = require('../../config.json')
const api_url = config.api_url

const Login = () => {
  const qrRef = React.useRef(null)

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

  const checkIsLoggedIn = (redirect) => {
    const toastmsg = toast.loading("Found login credentials, checking if valid...", { theme: "dark" })
    fetch(`${api_url}/get?id=${encodeURIComponent(cookies.load("id"))}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
        'W-Session': cookies.load('session_id'),
        'W-Loggen': cookies.load('loggen'),
        'W-Reason': 'get-user-data'
      }
    }).then((res) => {
      res.json().then((data) => {
        if (data.success) {
          if (!data.user.account.email || !data.user.account.email.verified) {
            window.location.href = `/onecode?type=registration`
          } else {
            toast.update(toastmsg, { render: "Redirecting...", isLoading: false, type: toast.TYPE.SUCCESS, autoClose: 2000 })
            window.location.href =  decodeURIComponent(redirect)
          }
        } else {
          if (data.error === "Email not verified") {
            window.location.href = `/onecode?type=registration`
            return
          }

          toast.update(toastmsg, { render: "Login credentials invalid, please login.", isLoading: false, type: toast.TYPE.ERROR, autoClose: 2000 })
          cookies.save("token", "", {path: '/', secure: false})
          cookies.save("secret", "", {path: '/', secure: false})
          cookies.save("id", "", {path: '/', secure: false})
          cookies.save("loggen", "", {path: '/', secure: false})
          cookies.save("session_id", "", {path: '/', secure: false})
        }
      })
    }).catch(() => {
      toast.update(toastmsg, { render: "Login credentials invalid, please login.", isLoading: false, type: toast.TYPE.ERROR, autoClose: 2000 })
      cookies.save("token", "", {path: '/', secure: false})
      cookies.save("secret", "", {path: '/', secure: false})
      cookies.save("id", "", {path: '/', secure: false})
      cookies.save("loggen", "", {path: '/', secure: false})
      cookies.save("session_id", "", {path: '/', secure: false})
    })
  }

  const checkForRedirect = () => {
    const redirect = getUrlParameter('callback')
    if (redirect) {
      if (cookies.load('token') && cookies.load('secret') && cookies.load('id') && cookies.load('loggen') && cookies.load('session_id')) {
        checkIsLoggedIn(redirect)
      } else {
        cookies.save('redirect', decodeURIComponent(redirect), {path: '/', secure: false, expires: new Date(Date.now() + 1000 * 60 * 60 * 24)})
      }
    } else {
      if (cookies.load('token') && cookies.load('secret') && cookies.load('id') && cookies.load('loggen') && cookies.load('session_id')) {
        checkIsLoggedIn('/summary')
      }
    }
  }

  const attemptLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = btoa(formData.get('email'));
    const password = btoa(formData.get('password'));
    const notification = toast.loading('Attempting to login...', { theme: "dark" });

      fetch(`${api_url}/login`, {method: 'post', headers: {"W-Crypto": "false", "Content-Type": "application/json"}, body: JSON.stringify({email, password})}).then((response) => {
        response.json().then((data) => {
          if (data.success) {
            toast.update(notification, {type: toast.TYPE.SUCCESS, isLoading: false, autoClose: 5000, render: "Successfully logged in! Redirecting...", theme: "dark" })

            cookies.save('secret', data.session.secret, {path: '/', secure: false})
            cookies.save('token', data.session.token, {path: '/', secure: false})
            cookies.save('id', data.uuid, {path: '/', secure: false})
            cookies.save('loggen', data.session.loggen, {path: '/', secure: false})
            cookies.save('session_id', data.session.session_id, {path: '/', secure: false})

            if (cookies.load('redirect')) {
                window.location.href = cookies.load('redirect')
                cookies.remove('redirect')
            } else {
              window.location.href = '/summary'
            }
          } else {
            if (data.error === "Email not verified") {
              window.location.href = `/onecode?type=registration`
            } else {
              toast.update(notification, {type: toast.TYPE.ERROR, render: "Incorrect Email or Password", isLoading: false, autoClose: 5000, theme: "dark"})

              document.getElementById('email').classList.add('error')
              document.getElementById('password').classList.add('error')

              setTimeout(() => {
                document.getElementById('email').classList.remove('error')
                document.getElementById('password').classList.remove('error')
              }, 1000);
            }
          }
        })
      })
   }

  const setQR = () => {
    const qr = new QRCodeStyling({
      width: 208,
      height: 208,
      data: "Hello World!!!!!!!!!!!",
      margin: 8,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "Q"
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.5,
        margin: 0
      },
      dotsOptions: {
        type: "extra-rounded",
        gradient: {
          type: "linear",
          colorStops: [
            {
              offset: 0,
              color: "#000000"
            },
            {
              offset: 1,
              color: "#000000"
            }
          ],
          rotation: 0
        }
      },
      backgroundOptions: {
        color: "#FFFFFF"
      },
      image: "assets/strike.png",
      cornersSquareOptions: {
        type: "extra-rounded",
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops: [
            {
              offset: 0,
              color: "#ff4444"
            },
            {
              offset: 1,
              color: "#ff2344"
            }
          ]
        }
      },
      cornersDotOptions: {
        type: "dot",
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops: [
            {
              offset: 0,
              color: "#ff4444"
            },
            {
              offset: 1,
              color: "#ff2344"
            }
          ]
        }
      }
    });

    qr.append(qrRef.current);
  }

  React.useEffect(() => {
    setQR()
    checkForRedirect()
  }, [])

  return (
    <div className="login-container">
      <ToastContainer />
      <Helmet>
        <title>Log In</title>
        <meta
          name="description"
          content="Login to your ID to be able to access everything"
        />
        <meta property="og:title" content="Log In" />
        <meta
          property="og:description"
          content="Login to your ID to be able to access everything"
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="login-container01">
        <div className="login-container02">
          <form
            id="form"
            name="login-form"
            autoComplete="on"
            className="login-form"
            onSubmit={attemptLogin}
          >
            <h1 className="login-text notselectable">Log in to your ID</h1>
            <div className="login-container03">
              <label htmlFor={"email"} className="login-text01 notselectable">Email</label>
              <input type="email"
                id="email"
                name="email"
                required
                
                autoComplete="email"
                className="login-textinput input"
              />
            </div>
            <div className="login-container04">
              <label htmlFor={"password"} className="login-text02 notselectable">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                className="login-textinput1 input"
              />
            </div>
            <input type="hidden" name="csrf-token" id="csrf-token" />
            <button
                id="login"
              type="submit"
              className="login-button button"
            >
              <span className="button__text login-text03">Login</span>
              <svg viewBox="0 0 1024 1024" className="login-icon">
                <path d="M725.333 426.667h-42.667v-85.333c0-94.080-76.544-170.667-170.667-170.667s-170.667 76.587-170.667 170.667v85.333h-42.667c-47.061 0-85.333 38.229-85.333 85.333v298.667c0 47.104 38.272 85.333 85.333 85.333h426.667c47.061 0 85.333-38.229 85.333-85.333v-298.667c0-47.104-38.272-85.333-85.333-85.333zM512 780.757c-30.677 0-55.467-24.747-55.467-55.424s24.789-55.509 55.467-55.509 55.467 24.832 55.467 55.509-24.789 55.424-55.467 55.424zM597.333 469.333h-170.667v-128c0-47.104 38.272-85.333 85.333-85.333s85.333 38.229 85.333 85.333v128z"></path>
              </svg>
            </button>
            <Link to="/reset-password" className="login-navlink">
              Forgot your password?
            </Link>
            <div className="login-container05"></div>
            <div className="login-container06">
              <span className="login-text04 notselectable">
                Don&apos;t have an ID?
              </span>
              <Link to="/create-id" className="login-navlink1">
                <span>Create one.</span>
              </Link>
            </div>
          </form>
          <div className="login-container07">
            <div ref={qrRef} className={"login-image"} />
            <h1 className="login-text06 notselectable">
              <span>
                Log in with QR
              </span>
              <br></br>
              <span>Code</span>
            </h1>
            <span className="login-text10">
              <span>Scan this with the Wulfco App</span>
              <br></br>
              <span>to log in instantly</span>
              <br></br>
            </span>
          </div>
        </div>
        {/*<div className="login-container08">*/}
        {/*  <div className="login-container09">*/}
        {/*    <h1 className="login-text15 notselectable">*/}
        {/*      <span>Have a crypto wallet?</span>*/}
        {/*      <br></br>*/}
        {/*    </h1>*/}
        {/*    <span className="login-text18 notselectable">*/}
        {/*      <span>Use it to login or register.</span>*/}
        {/*      <br></br>*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*  <div className="login-container10">*/}
        {/*    <button className="login-button1 button" type="button" onClick={() => connectMetamask()}>*/}
        {/*      <img*/}
        {/*        alt="Metamask"*/}
        {/*        src="/assets/metamask.png"*/}
        {/*        loading="eager"*/}
        {/*        className="login-image1"*/}
        {/*      />*/}
        {/*      <h1 className="login-text21 notselectable">Metamask</h1>*/}
        {/*    </button>*/}
        {/*    <button className="login-button2 button" type="button">*/}
        {/*      <img*/}
        {/*        alt="WalletConnect"*/}
        {/*        src="/assets/walletconnect.png"*/}
        {/*        loading="eager"*/}
        {/*        className="login-image2"*/}
        {/*      />*/}
        {/*      <h1 className="login-text22 notselectable">WalletConnect</h1>*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default Login
