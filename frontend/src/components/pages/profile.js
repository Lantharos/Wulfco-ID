import React from 'react'

import ProfileModal from '../profile-modal'
import './profile.css'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import cookies from 'react-cookies'
import hmac from 'crypto-js/hmac-sha256'
import { BlockPicker } from "react-color";

const config = require('../../config.json')
const api_url = config.api_url

const Profile = (props) => {
  const [ pronouns, setPronouns ] = React.useState(props.userData.profile.pronouns)
  const [ aboutMe, setAboutMe ] = React.useState(props.userData.profile.about_me)
  const [ profileColor, setProfileColor ] = React.useState(props.userData.profile.profile_color || "#1a63b9")
  const [ showPicker, setShowPicker ] = React.useState(false);
  const [ resetAvatarHidden, setResetAvatarHidden ] = React.useState(false)
  const fileInput = React.useRef();

  const save = (e) => {
    e.preventDefault()

    const message = toast.loading('Saving...', { theme: "dark" })

    fetch(`${api_url}/profile?id=${encodeURIComponent(cookies.load("id"))}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
        'W-Session': cookies.load('session_id'),
        'W-Loggen': cookies.load('loggen')
      },
      body: JSON.stringify({
        pronouns: pronouns || "",
        about_me: aboutMe || "",
        profile_color: profileColor || "#008cff"
      })
    }).then((res) => {
        res.json().then((data) => {
            if (data.success) {
              toast.update(message, { render: 'Saved!', type: 'success', autoClose: 2000, isLoading: false })
              props.updateUserData()
            } else {
              toast.update(message, { render: 'Failed to save!', type: 'error', autoClose: 2000, isLoading: false })
            }
        })
    }).catch(() => {
        toast.update(message, { render: 'Failed to save!', type: 'error', autoClose: 2000, isLoading: false })
    })
  }

  const changeAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!allowedExtensions.exec(file.name)) {
        toast.error('File must be a .jpg, .jpeg, or .png!', { theme: "dark" })
        return
    }

    if (file.size < 2097152) {
      const reader = new FileReader();

      reader.onload = (e2) => {
        const base64String = reader.result.split(',')[1];
        const jsonData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: base64String
        };

        const message = toast.loading('Uploading...', { theme: "dark" })

        fetch(`${api_url}/avatar?id=${encodeURIComponent(cookies.load("id"))}`, {
          method: "POST",
          headers: {
            'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
            'W-Session': cookies.load('session_id'),
            'W-Loggen': cookies.load('loggen')
          },
          body: JSON.stringify(jsonData)
        }).then((res) => {
          res.json().then((data) => {
            if (data.success) {
              toast.update(message, { render: 'Uploaded!', type: 'success', autoClose: 2000, isLoading: false })
              props.updateUserData()
            } else {
              toast.update(message, { render: 'Failed to upload!', type: 'error', autoClose: 2000, isLoading: false })
            }
          })
        }).catch(() => {
          toast.update(message, { render: 'Failed to upload!', type: 'error', autoClose: 2000, isLoading: false })
        })
      };

      reader.readAsDataURL(file);
    } else {
      toast.error('File must be less than 2MB!', { theme: "dark" })
    }
  }

  const checkHasAvatar = () => {
    if (props.userData.profile.avatar.includes("dicebear")) {
      setResetAvatarHidden(false)
    } else {
      setResetAvatarHidden(true)
    }
  }

  const resetAvatar = () => {
    const message = toast.loading('Resetting...', { theme: "dark" })

    fetch(`${api_url}/avatar?id=${encodeURIComponent(cookies.load("id"))}`, {
      method: "DELETE",
      headers: {
        'W-Auth': hmac(cookies.load('token'), cookies.load('secret')).toString(),
        'W-Session': cookies.load('session_id'),
        'W-Loggen': cookies.load('loggen')
      }
    }).then((res) => {
      res.json().then((data) => {
        if (data.success) {
          toast.update(message, { render: 'Reset!', type: 'success', autoClose: 2000, isLoading: false })
          props.updateUserData()
        } else {
          toast.update(message, { render: 'Failed to reset!', type: 'error', autoClose: 2000, isLoading: false })
        }
      })
    }).catch(() => {
      toast.update(message, { render: 'Failed to reset!', type: 'error', autoClose: 2000, isLoading: false })
    })
  }

  return (
    <div className="profile-content">
      <input ref={fileInput} type="file" accept={".jpeg, .jpg, .png"} className={"hidden"} onChange={changeAvatar}/>
      <h1 className="profile-text notselectable">Profile</h1>
      {() => checkHasAvatar()}
      <form onSubmit={save} className="profile-form">
        <div className="profile-avatar-change-wrapper">
          <span className="profile-pointer notselectable">AVATAR</span>
          <div className="profile-options">
            <button
              id="change_avatar"
              type="button"
              className="profile-change-avatar button"
              onClick={() => fileInput.current.click()}
            >
              Change Avatar
            </button>
            <button
              id="reset_avatar"
              type="button"
              className={`profile-reset-avatar button ${resetAvatarHidden ? "hidden" : ""}`}
              onClick={resetAvatar}
            >
              Reset Avatar
            </button>
          </div>
        </div>
        <div className="profile-container">
          <span className="profile-text1 notselectable">PROFILE COLOR</span>
          <div className="profile-container1">
            <div className="profile-container2">
              <button id="select_default" onClick={() => setProfileColor("#1a63b9")} type="button" className="profile-button button">
                <svg id="default_color_selected" style={{opacity: (profileColor === "#1a63b9") ? 1 : 0}} viewBox="0 0 1024 1024" className="profile-icon">
                  <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                </svg>
              </button>
              <span className="profile-text2">Default</span>
            </div>
            <div className="profile-container3">
              <button id="pick_custom_color" style={{backgroundColor: profileColor}} onClick={() => (showPicker) ? setShowPicker(false) : setShowPicker(true)} type="button" className="profile-button1 button">
                <svg viewBox="0 0 1024 1024" className="profile-icon2">
                  <path d="M986.51 37.49c-49.988-49.986-131.032-49.986-181.020 0l-172.118 172.118-121.372-121.372-135.764 135.764 106.426 106.426-472.118 472.118c-8.048 8.048-11.468 18.958-10.3 29.456h-0.244v160c0 17.674 14.328 32 32 32h160c0 0 2.664 0 4 0 9.212 0 18.426-3.516 25.456-10.544l472.118-472.118 106.426 106.426 135.764-135.764-121.372-121.372 172.118-172.118c49.986-49.988 49.986-131.032 0-181.020zM173.090 960h-109.090v-109.090l469.574-469.572 109.088 109.088-469.572 469.574z"></path>
                </svg>
                <svg id="custom_color_selected" style={{opacity: (profileColor === "#1a63b9") ? 0 : 1}} viewBox="0 0 1024 1024" className="profile-icon4">
                  <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                </svg>
              </button>
              <span className="profile-text3">Custom</span>
              {showPicker && (
                  <div style={{ position: "absolute", zIndex: 1, top: "350px" }}>
                    <BlockPicker
                        color={profileColor}
                        onChangeComplete={(color) => setProfileColor(color.hex)}
                    />
                  </div>
              )}
            </div>
          </div>
        </div>
        <div className="profile-container4">
          <span className="profile-text4 notselectable">ABOUT ME</span>
          <textarea
            id="about_me"
            maxLength="200"
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder={"Say what you want everyone to know about you here, as long as it's within 200 characters."}
            defaultValue={props.userData.profile.about_me || ""}
            className="profile-textarea textarea"
          ></textarea>
        </div>
        <div className="profile-container5">
          <span className="profile-text5 notselectable">PRONOUNS</span>
          <input
            type="text"
            id="pronouns"
            maxLength="10"
            onChange={(e) => setPronouns(e.target.value)}
            defaultValue={props.userData.profile.pronouns || ""}
            placeholder={'he/him, they/them etc...'}
            className="profile-textinput input"
          />
        </div>
        <button
          id="submit"
          type="submit"
          className="profile-save button"
        >
          <span>Save</span>
        </button>
      </form>
      <aside className="profile-container6">
        <span className="profile-text7 notselectable">PREVIEW</span>
        <ProfileModal about_me={aboutMe} profile_color={profileColor} pronouns={pronouns} username={props.userData.profile.username} discriminator={props.userData.profile.discriminator} profile_picture={props.userData.profile.avatar}></ProfileModal>
      </aside>
    </div>
  )
}

export default Profile
