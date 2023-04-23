import React from 'react'

import { Helmet } from 'react-helmet'

import './reset-password.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const config = require('../../config.json')
const api_url = config.api_url

const ResetPassword = (props) => {
  const resetPassword = () => {
    const email = document.getElementById('email').value
    if (email) {
      const message = toast.loading('Sending email...', { theme: "dark" })

      fetch(`${api_url}/password`, {
        method: 'POST',
        body: JSON.stringify({ email: btoa(email) }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            toast.update(message, { render: 'Check your email!', type: 'success', autoClose: 2000, isLoading: false })
          } else {
            toast.update(message, { render: 'Something went wrong!', type: 'error', autoClose: 2000, isLoading: false })
          }
        }).catch((err) => { toast.update(message, { render: "Something went wrong!", type: "error", autoClose: 2000, isLoading: false}); console.log(err) })
    } else {
      toast.info('Please enter your email!', { theme: "dark" })
    }
  }

  return (
    <div className="reset-password-container">
      <Helmet>
        <title>Reset your password</title>
        <meta
          name="description"
          content="Forgot your password? No worries, just enter your email and we'll send a link to reset your password!"
        />
        <meta property="og:title" content="Reset your password" />
        <meta
          property="og:description"
          content="Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC."
        />
        <meta
          property="og:image"
          content="https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/70dc84ed-902e-47ba-a9d3-d75e24c32e1d?org_if_sml=1"
        />
      </Helmet>
      <ToastContainer />
      <div className="reset-password-container1">
        <form
          id="form"
          name="login-form"
          autoComplete="on"
          className="reset-password-form"
          onSubmit={(e) => { e.preventDefault(); resetPassword() }}
        >
          <h1 className="reset-password-text notselectable">
            Reset your Password
          </h1>
          <span className="reset-password-text1 notselectable">
            We see you&apos;re having issues logging in, please enter your email
            down below so we can send a link to reset your pass.
          </span>
          <div className="reset-password-container2">
            <span className="reset-password-text2 notselectable">Email</span>
            <input
              type="email"
              id="email"
              name="email"
              required="true"
              autoFocus="true"
              placeholder="johndoe@yourdomain.com"
              autoComplete="username"
              className="reset-password-textinput input"
            />
          </div>
          <button
            id="submit"
            type="submit"
            className="reset-password-button button"
          >
            <span className="button__text reset-password-text3">Send Link</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
