import React from 'react'

import './registration-next.css'
import {motion} from 'framer-motion'

const RegistrationNext = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)

    const obj = {}
    data.forEach((value, key) => {
      obj[key] = value
    })

    props.handler(2, obj)
  }

  return (
    <motion.div className={`registration-next-container`} key={"continue"} initial={{ x: "-100vh", opacity: 0 }} animate={{ x: "0vh", opacity: 1, transition: {
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
        className="registration-next-form"
      >
        <h1 className="registration-next-text notselectable">
          What should we call you?
        </h1>
        <div className="registration-next-container1">
          <div className="registration-next-container2">
            <span className="registration-next-text1 notselectable">
              Name
            </span>
            <input
              id="name"
              name="name"
              required
              
              placeholder={"John Doe"}
              autoComplete="name"
              className="registration-next-textinput input"
            />
          </div>
          <div className="registration-next-container3">
            <span className="registration-next-text2 notselectable">
              Gender
            </span>
            <input
              id="gender"
              name="gender"
              required
              
              placeholder={"Male, Female, ..."}
              autoComplete="sex"
              className="registration-next-textinput1 input"
            />
          </div>
        </div>
        <button
          type="submit"
          className="registration-next-button button"
        >
          <span className="button__text registration-next-text3">
            Continue
          </span>
        </button>
      </form>
    </motion.div>
  )
}

export default RegistrationNext
