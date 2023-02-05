import React from 'react'

import PropTypes from 'prop-types'

import './profile-modal.css'

const ProfileModal = (props) => {
  return (
    <div className="profile-modal-container">
      <div className="profile-modal-container1">
        <div style={{backgroundColor: props.profile_color}} className="profile-modal-container2"></div>
        <div className="profile-modal-container3">
          <img
            id="avatar_profile"
            src={props.profile_picture}
            alt="Avatar"
            className="profile-modal-image"
          />
          <div className="profile-modal-container4">
            <div className="profile-modal-container5">
              <h1
                id="username_profile"
                className="profile-modal-text notselectable"
              >
                {props.username}
              </h1>
              <h1
                id="username_profile"
                className="profile-modal-text1 notselectable"
              >
                {props.discriminator}
              </h1>
            </div>
            <div className="profile-modal-container6"></div>
            <div className="profile-modal-container7">
              <span className="profile-modal-text2 notselectable">
                PRONOUNS
              </span>
              <input
                type="text"
                id="pronouns_profile"
                disabled
                placeholder={"There's nothing here :("}
                value={props.pronouns || ""}
                className="profile-modal-textinput input"
              />
            </div>
            <div className="profile-modal-container8">
              <span className="profile-modal-text3 notselectable">
                ABOUT ME
              </span>
              <textarea
                id="about_me_profile"
                disabled
                maxLength="200"
                placeholder={"There's nothing here :("}
                value={props.about_me || ""}
                className="profile-modal-textarea textarea"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProfileModal.defaultProps = {
  profile_picture: 'https://play.teleporthq.io/static/svg/default-img.svg',
  username: 'john_doe',
  discriminator: '#0000',
  pronouns: "There's nothing here :(",
  about_me: "There's nothing here :("
}

ProfileModal.propTypes = {
  profile_picture: PropTypes.string,
  username: PropTypes.string,
  discriminator: PropTypes.string,
  pronouns: PropTypes.string,
  about_me: PropTypes.string
}

export default ProfileModal
