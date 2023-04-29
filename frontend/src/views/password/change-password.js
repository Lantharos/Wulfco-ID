import React from 'react'

import { Helmet } from 'react-helmet'

import './change-password.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const config = require('../../config.json')
const api_url = config.api_url

const ChangePassword = (props) => {
  const changePassword = (e) => {
    e.preventDefault()
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (password === confirmPassword) {
      const message = toast.loading('Changing password...', { theme: "dark" })

      fetch(`${api_url}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: btoa(password),
          token: token
        }),
      }).then((res) => {
        res.json().then((data) => {
          if (data.success) {
            toast.update(message, { render: 'Password changed!', type: 'success', autoClose: 2000, isLoading: false })
            window.location.href = '/login'
          } else {
            toast.update(message, { render: 'Something went wrong!', type: 'error', autoClose: 2000, isLoading: false })
          }
        })
      })
    } else {
      toast.info('Passwords do not match!', { theme: "dark" })
    }
  }

  return (
    <div className="change-password-container">
      <Helmet>
        <title>Change password</title>
        <meta name="description" content="Continue resetting your password." />
        <meta property="og:title" content="Reset Password LS" />
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
      <div className="change-password-container1">
        <form
          id="form"
          name="login-form"
          autoComplete="on"
          className="change-password-form"
          onSubmit={changePassword}
        >
          <h1 className="change-password-text notselectable">Last Step!</h1>
          <span className="change-password-text1 notselectable">
            Now that you verified your email, just enter your new password.
          </span>
          <div className="change-password-container2">
            <span className="change-password-text2 notselectable">
              New Password
            </span>
            <input
              type="password"
              id="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              passwordrules="minlength: 10; maxlength: 20; required: lower; required: upper; required: digit; required: [!,@];"
              name="password"
              required="true"
              
              maxLength="20"
              minLength="10"
              placeholder="••••••••••••••••"
              autoComplete="new-password"
              className="change-password-textinput input"
            />
          </div>
          <div className="change-password-container3">
            <span className="change-password-text3 notselectable">
              Confirm Password
            </span>
            <input
              type="password"
              id="confirm-password"
              name="confirmpassword"
              required="true"
              
              maxLength="20"
              minLength="3"
              placeholder="••••••••••••••••"
              autoComplete="new-password"
              className="change-password-textinput1 input"
            />
          </div>
          <button
            id="submit"
            type="submit"
            className="change-password-button button"
          >
            <span className="button__text change-password-text4">
              Change Password
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
