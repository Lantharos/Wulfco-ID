import React from 'react'

import PropTypes from 'prop-types'

import FriendRequest from './page_components/friend-request'
import './add--friend.css'
import Friend from "./page_components/friend";

const AddAFriend = (props) => {
  return (
    <div className={`add--friend-content ${props.rootClassName} `}>
      <h1 className="add--friend-text notselectable">Add a Friend</h1>
      <span className="add--friend-text1 notselectable">
        <span className="">Add a friend or accept pending invites</span>
        <br className=""></br>
      </span>
      <div className="add--friend-container">
        <span className="add--friend-text4 notselectable">ADD FRIEND</span>
        <div className="add--friend-container1">
          <input
            type="email"
            id="email"
            name="email"
            required="true"
            maxlength="37"
            placeholder="john_doe#0001"
            className="add--friend-textinput input"
          />
          <button
            id="submit"
            type="button"
            onclick="this.classList.toggle('submit--loading')"
            className="add--friend-add button"
          >
            <span className="button__text add--friend-text5">Add Friend</span>
          </button>
        </div>
      </div>
      <div className="add--friend-container2">
        <span className="add--friend-text6 notselectable">SENT INVITES</span>
        <div id="sent_invites" className="add--friend-sent-invites">
          <Friend className=""></Friend>
        </div>
      </div>
      <div className="add--friend-container3">
        <span className="add--friend-text7 notselectable">
          RECEIVED INVITES
        </span>
        <div id="received_invites" className="add--friend-received-invites">
          <FriendRequest className=""></FriendRequest>
        </div>
      </div>
    </div>
  )
}

AddAFriend.defaultProps = {
  rootClassName: '',
}

AddAFriend.propTypes = {
  rootClassName: PropTypes.string,
}

export default AddAFriend
