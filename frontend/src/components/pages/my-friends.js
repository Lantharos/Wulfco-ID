import React from 'react'

import PropTypes from 'prop-types'

import Friend from './page_components/friend'
import './my-friends.css'
import 'react-toastify/dist/ReactToastify.css';

const MyFriends = (props) => {
    const mapFriends = () => {
        const friends = props.userData.friends.friends
        const friendList = []

        // loop through the friends object
        for (const friend in friends) {
            friendList.push(<Friend id={friend.id} avatar={friend.avatar} username={friend.username} discriminator={friend.discriminator} />)
        }

        return friendList
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
