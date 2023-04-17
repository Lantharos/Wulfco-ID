import React from 'react'

import PropTypes from 'prop-types'

import Friend from './page_components/friend'
import './my-friends.css'

const MyFriends = (props) => {
    const mapFriends = () => {
        const friends = props.userData.profile.friends
        if (friends === undefined || friends.friends === undefined || friends.friends.length === 0) {
            return (
                <div className="my-friends-no-friends">
                    <span className="notselectable">You have no friends :(</span>
                </div>
            )
        } else {
            return friends.friends.map((friend) => {
                return (
                    <Friend
                        username={friend.username}
                        discriminator={friend.discriminator}
                        avatar={friend.avatar}
                        id={friend.id}
                    />
                )
            })

        }
    }
  return (
    <div className="my-friends-content">
      <h1 className="my-friends-text notselectable">My Friends</h1>
      <span className="my-friends-text1 notselectable">
        <span>All of your friends at one place</span>
        <br></br>
      </span>
      <div className="my-friends-container">
        <span className="my-friends-text4 notselectable">ALL FRIENDS</span>
        <div className="my-friends-friends">
            {mapFriends()}
        </div>
      </div>
    </div>
  )
}

MyFriends.defaultProps = {
  rootClassName: '',
}

MyFriends.propTypes = {
  rootClassName: PropTypes.string,
}

export default MyFriends
