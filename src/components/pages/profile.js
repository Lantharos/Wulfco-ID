import React from 'react'

import PropTypes from 'prop-types'

import ProfileModal from '../profile-modal'
import './profile.css'

const Profile = (props) => {
  return (
    <div className="profile-content">
      <h1 className="profile-text notselectable">{props.heading}</h1>
      <form action="/user/profile" method="POST" className="profile-form">
        <div className="profile-avatar-change-wrapper">
          <span className="profile-pointer notselectable">{props.pointer}</span>
          <div className="profile-options">
            <button
              id="change_avatar"
              type="button"
              className="profile-change-avatar button"
            >
              {props.ChangeAvatar}
            </button>
            <button
              id="reset_avatar"
              type="button"
              className="profile-reset-avatar button"
            >
              {props.ResetAvatar}
            </button>
          </div>
        </div>
        <div className="profile-container">
          <span className="profile-text1 notselectable">{props.text1}</span>
          <div className="profile-container1">
            <div className="profile-container2">
              <button id="select_default" className="profile-button button">
                <svg viewBox="0 0 1024 1024" className="profile-icon">
                  <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                </svg>
              </button>
              <span className="profile-text2">{props.text5}</span>
            </div>
            <div className="profile-container3">
              <button id="pick_custom_color" className="profile-button1 button">
                <svg viewBox="0 0 1024 1024" className="profile-icon2">
                  <path d="M986.51 37.49c-49.988-49.986-131.032-49.986-181.020 0l-172.118 172.118-121.372-121.372-135.764 135.764 106.426 106.426-472.118 472.118c-8.048 8.048-11.468 18.958-10.3 29.456h-0.244v160c0 17.674 14.328 32 32 32h160c0 0 2.664 0 4 0 9.212 0 18.426-3.516 25.456-10.544l472.118-472.118 106.426 106.426 135.764-135.764-121.372-121.372 172.118-172.118c49.986-49.988 49.986-131.032 0-181.020zM173.090 960h-109.090v-109.090l469.574-469.572 109.088 109.088-469.572 469.574z"></path>
                </svg>
                <svg viewBox="0 0 1024 1024" className="profile-icon4">
                  <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                </svg>
              </button>
              <span className="profile-text3">{props.text6}</span>
            </div>
          </div>
        </div>
        <div className="profile-container4">
          <span className="profile-text4 notselectable">{props.text2}</span>
          <textarea
            id="about_me"
            maxLength="190"
            placeholder={props.textarea_placeholder}
            className="profile-textarea textarea"
          ></textarea>
        </div>
        <div className="profile-container5">
          <span className="profile-text5 notselectable">{props.text3}</span>
          <input
            type="text"
            id="pronouns"
            placeholder={props.textinput_placeholder}
            className="profile-textinput input"
          />
        </div>
        <button
          id="submit"
          type="button"
          onClick="this.classList.toggle('submit--loading')"
          className="profile-save button"
        >
          <span className="button__text">{props.text4}</span>
        </button>
      </form>
      <aside className="profile-container6">
        <span className="profile-text7 notselectable">{props.text}</span>
        <ProfileModal></ProfileModal>
      </aside>
    </div>
  )
}

Profile.defaultProps = {
  text4: 'Save',
  text1: 'PROFILE COLOR',
  textarea_placeholder:
    "Say what you want everyone to know about you here, as long as it's within 190 characters.",
  text: 'PREVIEW',
  ResetAvatar: 'Remove Avatar',
  text2: 'ABOUT ME',
  textinput_placeholder: 'he/him, they/them etc...',
  text3: 'PRONOUNS',
  pointer: 'AVATAR',
  text6: 'Custom',
  ChangeAvatar: 'Change Avatar',
  heading: 'Profile',
  text5: 'Default',
}

Profile.propTypes = {
  text4: PropTypes.string,
  text1: PropTypes.string,
  textarea_placeholder: PropTypes.string,
  text: PropTypes.string,
  ResetAvatar: PropTypes.string,
  text2: PropTypes.string,
  textinput_placeholder: PropTypes.string,
  text3: PropTypes.string,
  pointer: PropTypes.string,
  text6: PropTypes.string,
  ChangeAvatar: PropTypes.string,
  heading: PropTypes.string,
  text5: PropTypes.string,
}

export default Profile
