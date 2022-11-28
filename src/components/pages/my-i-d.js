import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './my-i-d.css'
import accountSettings from "../../views/dashboard/account-settings";

// change the selectedPage state to the page that was clicked in account settings
const changePage = (page) => {
    accountSettings.setState({selectedPage: page});
    accountSettings.forceUpdate();
}

const MyID = (props) => {
  return (
    <div className={`my-i-d-content ${props.rootClassName} `}>
      <h1 className="my-i-d-text notselectable">{props.heading}</h1>
      <div className="my-i-d-user-profile">
        <div id="background" className="my-i-d-background"></div>
        <div className="my-i-d-content1">
          <div className="my-i-d-wrapper">
            <div className="my-i-d-username-wrapper">
              <span className="my-i-d-pointer notselectable">
                {props.pointer2}
              </span>
              <div className="my-i-d-container">
                <h1
                  id="username_profile"
                  className="my-i-d-current-username notselectable"
                >
                  {props.CurrentUsername}
                </h1>
                <button
                  id="edit_username"
                  type="button"
                  className="my-i-d-edit button"
                >
                  <span className="button__text my-i-d-text1">
                    {props.text3}
                  </span>
                </button>
              </div>
            </div>
            <div className="my-i-d-email-wrapper">
              <span className="my-i-d-pointer1 notselectable">
                {props.pointer3}
              </span>
              <div className="my-i-d-container1">
                <h1
                  id="email_profile"
                  className="my-i-d-current-email notselectable"
                >
                  {props.CurrentEmail}
                </h1>
                <button
                  id="edit_email"
                  type="button"
                  className="my-i-d-edit1 button"
                >
                  <span className="button__text my-i-d-text2">
                    {props.text4}
                  </span>
                </button>
              </div>
            </div>
            <div className="my-i-d-birthday-wrapper">
              <span className="my-i-d-pointer2 notselectable">
                {props.pointer4}
              </span>
              <div className="my-i-d-container2">
                <h1
                  id="birthday_profile"
                  className="my-i-d-current-birthday notselectable"
                >
                  {props.CurrentBirthday}
                </h1>
                <button
                  id="edit_bday"
                  type="button"
                  className="my-i-d-edit2 button"
                >
                  <span className="button__text my-i-d-text3">
                    {props.text5}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="my-i-d-info">
          <div className="my-i-d-info1">
            <img
              id="pfp"
              alt={props.image_alt}
              src={props.image_src}
              className="my-i-d-image"
            />
            <h1 id="username_main" className="my-i-d-text4 notselectable">
              {props.heading1}
            </h1>
          </div>
        </div>
      </div>
      <div className="my-i-d-reset-password-wrapper notselectable">
        <span className="my-i-d-pointer3 notselectable">{props.pointer}</span>
        <Link
          to="/reset-password"
          onclick="this.classList.toggle('submit--loading')"
          className="my-i-d-reset-password button"
        >
          <span className="">{props.text}</span>
        </Link>
      </div>
      <div className="my-i-d-i-d-removal-wrapper notselectable">
        <span className="my-i-d-pointer4 notselectable">{props.pointer1}</span>
        <span className="my-i-d-notice notselectable">{props.notice}</span>
        <button
          id="delete_data"
          type="button"
          className="my-i-d-delete-i-d button"
        >
          <span className="">{props.text1}</span>
        </button>
      </div>
    </div>
  )
}

MyID.defaultProps = {
  text3: 'Edit',
  heading1: 'John Doe',
  pointer4: 'BIRTHDAY',
  heading: 'My ID',
  image_alt: 'image',
  CurrentEmail: 'johndoe@gmail.com',
  rootClassName: '',
  CurrentBirthday: '30/04/2000',
  notice:
    'Deleting your ID means deleting all of the data we have of you, AND the data in VikkiVuk Storage. If you delete your ID, you will lose everything you have on apps using VikkiVuk Storage. You cannot delete your account if you have a balance in your wallet.',
  CurrentUsername: 'John Doe',
  text: 'Reset Password',
  text5: 'Edit',
  pointer3: 'EMAIL',
  pointer2: 'USERNAME',
  pointer: 'PASSWORD',
  pointer1: 'ID REMOVAL',
  text4: 'Edit',
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  text1: 'Delete my Data',
  text2: 'Edit Profile',
}

MyID.propTypes = {
  text3: PropTypes.string,
  heading1: PropTypes.string,
  pointer4: PropTypes.string,
  heading: PropTypes.string,
  image_alt: PropTypes.string,
  CurrentEmail: PropTypes.string,
  rootClassName: PropTypes.string,
  CurrentBirthday: PropTypes.string,
  notice: PropTypes.string,
  CurrentUsername: PropTypes.string,
  text: PropTypes.string,
  text5: PropTypes.string,
  pointer3: PropTypes.string,
  pointer2: PropTypes.string,
  pointer: PropTypes.string,
  pointer1: PropTypes.string,
  text4: PropTypes.string,
  image_src: PropTypes.string,
  text1: PropTypes.string,
  text2: PropTypes.string,
}

export default MyID
