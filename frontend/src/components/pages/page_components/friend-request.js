import React from 'react'

import PropTypes from 'prop-types'

import './friend-request.css'

const FriendRequest = (props) => {
  return (
    <div className="friend-request-container">
      <img
        alt="invite avatar"
        src={props.avatar}
        className="friend-request-image"
      />
      <button id="decline" className="friend-request-button button">
        <svg
          viewBox="0 0 804.5714285714286 1024"
          className="friend-request-icon"
        >
          <path d="M741.714 755.429c0 14.286-5.714 28.571-16 38.857l-77.714 77.714c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-168-168-168 168c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-77.714-77.714c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l168-168-168-168c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l77.714-77.714c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l168 168 168-168c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l77.714 77.714c10.286 10.286 16 24.571 16 38.857s-5.714 28.571-16 38.857l-168 168 168 168c10.286 10.286 16 24.571 16 38.857z"></path>
        </svg>
      </button>
      <button id="accept" className="friend-request-button1 button">
        <svg viewBox="0 0 1024 1024" className="friend-request-icon2">
          <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
        </svg>
      </button>
      <h1 className="friend-request-text">{props.username}</h1>
    </div>
  )
}

FriendRequest.defaultProps = {
  username: 'john_doe#0001',
  avatar: 'https://play.teleporthq.io/static/svg/default-img.svg',
}

FriendRequest.propTypes = {
  username: PropTypes.string,
  avatar: PropTypes.string,
}

export default FriendRequest
