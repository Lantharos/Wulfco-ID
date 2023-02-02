import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './login.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import detectEthereumProvider from '@metamask/detect-provider';
import cookies from 'react-cookies'

let token = ''
let config = require('../../config.json')
let api_url = config.api_url

const Login = (props) => {
  const apiHealth = async () => {
    let response = false
    await fetch(api_url, {headers: {"W-Reason": "life_check"}}).then((res) => {
      document.getElementById('login').disabled = false
      response = true
    }).catch((err) => {
      console.log(err)
      // disable the login button
      document.getElementById('login').disabled = true

      toast.error("API is down, please try again later", { theme: "dark"})
    })

    return response
  }

  const checkLogin = async () => {
    if (cookies.load('session_id') && cookies.load('token')) {

    }
  }

  const connectMetamask = () => {
    apiHealth().then(async(res) => {
      if (!res) { return }
      const provider = await detectEthereumProvider({ mustBeMetaMask: true });

      if (provider) {
        try {
          const account = await provider.request({ method: 'eth_requestAccounts' })
          await provider.request({method: "wallet_addEthereumChain", params: [{chainId: "0x38", chainName: "Binance Smart Chain", nativeCurrency: {name: "BNB", symbol: "bnb", decimals: 18}, rpcUrls: ["https://bsc-dataseed.binance.org/"], blockExplorerUrls: ["https://bscscan.com/"]}]})

          await provider.request({method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }]})

          let walletID = account[0]
          let walletType = 'metamask'
          let walletNetwork = 'bsc'

          let notification = toast.loading("Connecting to Metamask", { theme: "dark" })

          fetch(api_url + '/id/login', {method: 'POST', headers: {'W-Crypto': 'true', 'W-Wallet-Type': walletType}, body: JSON.stringify({walletID: walletID, walletType: walletType, walletNetwork: walletNetwork})}).then((res) => {return res.json()}).then((data) => {
            toast.update(notification, {render: "Connected to Metamask", type: toast.TYPE.SUCCESS, theme: "dark", autoClose: 2000})
            setTimeout(() => {
              cookies.save('secret', data.secret, {path: '/', secure: false})
              cookies.save('token', data.token, {path: '/', secure: false})
              cookies.save('id', data.user_id, {path: '/', secure: false})
              cookies.save('loggen', data.loggen, {path: '/', secure: false})
              cookies.save('session_id', data.session_id, {path: '/', secure: true})

              window.history.push('/summary')
            }, 3000)
          }).catch((err) => {
            toast.update(notification, { render: "Failed to connect to Metamask", type: "error", isLoading: false, theme: "dark", autoClose: 2000 })
          })
        } catch (error) {
          toast.error('Please connect Metamask to continue', {theme: "dark"})
        }
      } else {
        toast.error('Please install Metamask to continue', {theme: "dark"})
      }
    })
  }

  const getQRLoginCode = () => {
    if (document.getElementById('qr-login-image').src !== "https://play.teleporthq.io/static/svg/default-img.svg") { return;  }

    apiHealth().then(() => {
      fetch(api_url + '/id/qr-login', {method: 'get'}).then((response) => {
        response.json().then((data) => {
          document.getElementById('qr-login-image').src = data.qr
        })
      })
    })
  }

  const attemptLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const email = btoa(data.get('email'));
    const password = btoa(data.get('password'));

    apiHealth().then(async(ret) => {
      if(!ret) { return }

      let notification = toast.loading('Attempting to login...', { theme: "dark" });

      fetch(api_url + '/id/login', {method: 'post', headers: {"W-Crypto": "false", "Content-Type": "application/json"}, body: JSON.stringify({email, password})}).then((response) => {
        response.json().then((data) => {
          if (data.success) {
            toast.update(notification, {type: toast.TYPE.SUCCESS, isLoading: false, autoClose: 5000, render: "Successfully logged in! Redirecting...", theme: "dark" })

            cookies.save('secret', data.session.secret, {path: '/', secure: false})
            cookies.save('token', data.session.token, {path: '/', secure: false})
            cookies.save('id', data.uuid, {path: '/', secure: false})
            cookies.save('loggen', data.session.loggen, {path: '/', secure: false})
            cookies.save('session_id', data.session.session_id, {path: '/', secure: false})
            window.location.href = '/summary'
          } else {
            toast.update(notification, {type: toast.TYPE.ERROR, render: "Incorrect Email or Password", isLoading: false, autoClose: 5000, theme: "dark"})

            document.getElementById('email').classList.add('error')
            document.getElementById('password').classList.add('error')

            setTimeout(() => {
              document.getElementById('email').classList.remove('error')
              document.getElementById('password').classList.remove('error')
            }, 1000);
          }
        })
      })
    })
   }

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
            <img id="qr-login-image"
              alt="image"
              src="https://play.teleporthq.io/static/svg/default-img.svg"
              className="login-image"
                 onLoad={() => {getQRLoginCode(); getCSRFToken()}}
            />
            <h1 className="login-text06 notselectable">
              <span>
                Log in with QR
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
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
        <div className="login-container08">
          <div className="login-container09">
            <h1 className="login-text15 notselectable">
              <span>Have a crypto wallet?</span>
              <br></br>
            </h1>
            <span className="login-text18 notselectable">
              <span>Use it to login or register.</span>
              <br></br>
            </span>
          </div>
          <div className="login-container10">
            <button className="login-button1 button" onClick={() => connectMetamask()}>
              <img
                alt="image"
                src="/assets/metamask.png"
                loading="eager"
                className="login-image1"
              />
              <h1 className="login-text21 notselectable">Metamask</h1>
            </button>
            <button className="login-button2 button">
              <img
                alt="image"
                src="/assets/walletconnect.png"
                loading="eager"
                className="login-image2"
              />
              <h1 className="login-text22 notselectable">WalletConnect</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
