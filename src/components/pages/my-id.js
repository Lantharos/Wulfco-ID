import React from 'react'
import { Link } from 'react-router-dom'

import './my-id.css'

const MyId = (props) => {
  return (
    <div className={`my-i-d-content`}>
      <h1 className="my-i-d-text notselectable">My ID</h1>
      <div className="my-i-d-user-profile">
        <div id="background" className="my-i-d-background"></div>
        <div className="my-i-d-content1">
          <div className="my-i-d-wrapper">
            <div className="my-i-d-username-wrapper">
              <span className="my-i-d-pointer notselectable">
                USERNAME
              </span>
              <div className="my-i-d-container">
                <h1
                  id="username_profile"
                  className="my-i-d-current-username notselectable"
                >
                  {props.userData.profile.username}
                </h1>
                <button
                  id="edit_username"
                  type="button"
                  className="my-i-d-edit button"
                >
                  <span className="button__text my-i-d-text1">
                    Edit
                  </span>
                </button>
              </div>
            </div>
            <div className="my-i-d-email-wrapper">
              <span className="my-i-d-pointer1 notselectable">
                EMAIL
              </span>
              <div className="my-i-d-container1">
                <h1
                  id="email_profile"
                  className="my-i-d-current-email notselectable"
                >
                  {props.userData.email}
                </h1>
                <button
                  id="edit_email"
                  type="button"
                  className="my-i-d-edit1 button"
                >
                  <span className="button__text my-i-d-text2">
                    Edit
                  </span>
                </button>
              </div>
            </div>
            <div className="my-i-d-birthday-wrapper">
              <span className="my-i-d-pointer2 notselectable">
                BIRTHDAY
              </span>
              <div className="my-i-d-container2">
                <h1
                  id="birthday_profile"
                  className="my-i-d-current-birthday notselectable"
                >
                  Not set
                </h1>
                <button
                  id="edit_bday"
                  type="button"
                  className="my-i-d-edit2 button"
                >
                  <span className="button__text my-i-d-text3">
                    Edit
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
              alt={"Avatar"}
              src={props.userData.profile.avatar}
              className="my-i-d-image"
            />
            <h1 id="username_main" className="my-i-d-text4 notselectable">
              {props.userData.profile.username}
            </h1>
          </div>
        </div>
      </div>
      <div className="my-i-d-reset-password-wrapper notselectable">
        <span className="my-i-d-pointer3 notselectable">PASSWORD</span>
        <Link
          to="/reset-password"
          onclick="this.classList.toggle('submit--loading')"
          className="my-i-d-reset-password button"
        >
          <span className="">Reset Password</span>
        </Link>
      </div>
      <div className="my-i-d-i-d-removal-wrapper notselectable">
        <span className="my-i-d-pointer4 notselectable">ID DELETION</span>
        <span className="my-i-d-notice notselectable">Deleting your ID means deleting all of the data we have of you, AND the data in Wulfco Storage. If you delete your ID, you will lose everything you have on apps using Wulfco Storage. You cannot delete your account if you have a balance in your wallet.</span>
        <button
          id="delete_data"
          type="button"
          className="my-i-d-delete-i-d button"
        >
          <span className="">Delete my Data</span>
        </button>
      </div>
    </div>
  )
}

export default MyId
