import React from 'react'

import { Helmet } from 'react-helmet'

import './continue-registration1.css'
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

const ContinueRegistration1 = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)

    let name = data.get('name')
    let gender = data.get('gender')

    console.log(cookies.load('registration_session'))

    let loadingNotif = toast.loading("Submitting...", {theme: "dark"})
    fetch(api_url + '/id/registration-continue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'W-SessionID': cookies.load('registration_session'),
        'W-Step': 'continue'
      },
      body: JSON.stringify({
        name: name,
        gender: gender
      })
    })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            toast.update(loadingNotif, {theme: "dark", render: "An error occured", type: toast.TYPE.ERROR, isLoading: false, autoClose: 3000})
          } else {
            toast.update(loadingNotif, {theme: "dark", render: "Submitted", type: toast.TYPE.SUCCESS, isLoading: false, autoClose: 3000})
            sessionStorage.setItem("first_name", res.data.fname)
            sessionStorage.setItem("last_name", res.data.lname)

            props.history.push('/continue-registration2')
          }
        }).catch(err => {
            toast.update(loadingNotif, {theme: "dark", render: "An error occured", type: toast.TYPE.ERROR, isLoading: false, autoClose: 3000})
        })
  }

  return (
    <div className="continue-registration1-container">
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
      <div className="continue-registration1-container1">
        <form
          id="form"
          name="register-form"
          action="/user/register"
          method="POST"
          target="self"
          autoComplete="on"
          className="continue-registration1-form"
          onSubmit={handleSubmit}
        >
          <h1 className="continue-registration1-text notselectable">
            What should we call you?
          </h1>
          <div className="continue-registration1-container2">
            <div className="continue-registration1-container3">
              <span className="continue-registration1-text1 notselectable">
                Full name
              </span>
              <input
                type="name"
                id="name"
                name="name"
                required="true"
                
                placeholder="John Doe"
                autoComplete="name"
                className="continue-registration1-textinput input"
              />
            </div>
            <div className="continue-registration1-container4">
              <span className="continue-registration1-text2 notselectable">
                Gender
              </span>
              <input
                type="gender"
                id="gender"
                name="gender"
                required="true"
                placeholder="Male/Female/Other"
                autoComplete="gender"
                className="continue-registration1-textinput1 input"
              />
            </div>
          </div>
          <button
            type="submit"
            className="continue-registration1-button button"
          >
            <span className="button__text continue-registration1-text3">
              Continue
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContinueRegistration1
