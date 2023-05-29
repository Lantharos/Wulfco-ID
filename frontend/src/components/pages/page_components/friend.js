import React from 'react'

import PropTypes from 'prop-types'

import './friend.css'

const Friend = (props) => {
  return (
    <div className={`friend-container ${props.rootClassName} `}>
      <img alt="invite avatar" src={props.avatar} className="friend-image" />
      <button id="decline" className="friend-button button">
        <svg viewBox="0 0 804.5714285714286 1024" className="friend-icon">
          <path
            d="M741.714 755.429c0 14.286-5.714 28.571-16 38.857l-77.714 77.714c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-168-168-168 168c-10.286 10.286-24.571 16-38.857 16s-28.571-5.714-38.857-16l-77.714-77.714c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l168-168-168-168c-10.286-10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l77.714-77.714c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l168 168 168-168c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l77.714 77.714c10.286 10.286 16 24.571 16 38.857s-5.714 28.571-16 38.857l-168 168 168 168c10.286 10.286 16 24.571 16 38.857z"
            className=""
          ></path>
        </svg>
      </button>
      <h1 className="friend-text">{props.username}#{props.discriminator}</h1>
    </div>
  )
}

Friend.defaultProps = {
  avatar: 'https://play.teleporthq.io/static/svg/default-img.svg',
  username: 'john_doe',
  discriminator: '0000',
  id: "0",
  rootClassName: '',
}

Friend.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  id: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default Friend
