import React from 'react'
import { Link } from 'react-router-dom'

import './registration-start.css'
import {motion} from 'framer-motion'

const RegistrationStart = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)

    let obj = {}
    data.forEach((value, key) => {
        obj[key] = value
    })

    props.handler(1, obj)
  }

  return (
    <motion.div className={`registration-start-container`} key={"start"} initial={{ x: "-100vh", opacity: 0 }} animate={{ x: "0vh", opacity: 1, transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 500,
        damping: 25
      } }} exit={{ x: "100vh", opacity: 0 }}>
      <form
        id="form"
        name="register-form"
        onSubmit={handleSubmit}
        autoComplete="on"
        className="registration-start-form"
      >
        <h1 className="registration-start-text notselectable">
          Create an ID
        </h1>
        <div className="registration-start-container1">
          <label htmlFor={"email"} className="registration-start-text1 notselectable" id={"email-label"}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required={true}
            
            placeholder={"johndoe@yourdomain.com"}
            autoComplete="email"
            className="registration-start-textinput input"
          />
        </div>
        <div className="registration-start-container2">
          <label htmlFor={"password"} className="registration-start-text2 notselectable" id={"password-label"}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            minLength={10}
            maxLength={20}
            passwordrules="minlength: 10; maxlength: 20; required: lower; required: upper; required: digit; required: [!,@];"
            required={true}
            
            placeholder={"••••••••••••••••••"}
            autoComplete="new-password"
            className="registration-start-textinput1 input"
          />
        </div>
        <button
          type="submit"
          className="registration-start-button button"
        >
          <span className="button__text registration-start-text3">
            Continue
          </span>
        </button>
        <div className="registration-start-container3">
          <span className="registration-start-text4 notselectable">
            Already have an ID?
          </span>
          <Link to="/login" className="registration-start-navlink">
            <span className="">Log in.</span>
          </Link>
        </div>
      </form>
    </motion.div>
  )
}

export default RegistrationStart
