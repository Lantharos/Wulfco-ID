import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './start-registration.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import cookies from 'react-cookies'
let config = require('../../config.json')
let api_url = config.api_url

// validate email function
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

function shake(input) {
    input.classList.add('error')
    setTimeout(() => {
        input.classList.remove('error')
    }, 1000)
}

const StartRegistration = (props) => {
  // form submit handler
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)

    let email = data.get('email')
    let password = data.get('password')

    if (!validateEmail(email)) {toast.error('Please enter a valid email address', {theme: "dark"});shake(document.querySelector('#email'))}
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {toast.error('Password must contain at least 8 characters, 1 capital letter, 1 number and 1 special character', {theme: "dark"});shake(document.querySelector('#password'))}

    let loadingNotif = toast.loading("Creating a session...", {theme: "dark"})
    fetch(api_url + '/id/registration-start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(res => {
        if (res.error) {
            toast.error(res.error, {theme: "dark"})
        } else {
            toast.success('Registration session started', {theme: "dark"})
            cookies.save('registration_session', res.session_id, { path: '/' })
            props.history.push('/continue-registration1')
        }
    }).catch(err => {
        toast.update(loadingNotif, {theme: "dark", render: "An error occured", type: toast.TYPE.ERROR, isLoading: false, autoClose: 3000})
    })
  }

  return (
    <div className="start-registration-container">
      <ToastContainer />
      <Helmet>
        <title>Create an Account</title>
        <meta
          name="description"
          content="Don't have an account? No worries! Just create one, today, for free."
        />
        <meta property="og:title" content="Create an Account" />
        <meta
          property="og:description"
          content="VikkiVuk ID is a place where you can create one account that you will use for all of the services created by VikkiVuk LLC. This enhances your user experience drastically."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/e9ec2f33-b7e4-4cd9-a0dc-1d8ee57b364f?org_if_sml=1"
        />
      </Helmet>
      <div className="start-registration-container1">
        <form
          id="form"
          name="register-form"
          action="/user/register"
          method="POST"
          target="self"
          autoComplete="on"
          className="start-registration-form"
          onSubmit={handleSubmit}
        >
          <h1 className="start-registration-text notselectable">
            Create an ID
          </h1>
          <div className="start-registration-container2">
            <span className="start-registration-text1 notselectable">
              Email
            </span>
            <input
              type="email"
              id="email"
              name="email"
              required="true"
              autoFocus="true"
              placeholder="johndoe@yourdomain.com"
              autoComplete="email"
              className="start-registration-textinput input"
            />
          </div>
          <div className="start-registration-container3">
            <span className="start-registration-text2 notselectable">
              Password
            </span>
            <input
              type="password"
              id="password"
              name="password"
              required="true"
              autoFocus="true"
              minLength="5"
              placeholder="••••••••••••••••••"
              autoComplete="email"
              className="start-registration-textinput1 input"
            />
          </div>
          <button
            type="submit"
            className="start-registration-button button"
          >
            <span className="button__text start-registration-text3">
              Continue
            </span>
          </button>
          <div className="start-registration-container4">
            <span className="start-registration-text4 notselectable">
              Already have an ID?
            </span>
            <Link to="/login" className="start-registration-navlink">
              <span>Log in.</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StartRegistration
