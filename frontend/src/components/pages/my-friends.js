import React from 'react'

import Friend from './page_components/friend'
import './my-friends.css'
import 'react-toastify/dist/ReactToastify.css';

const MyFriends = (props) => {
    const mapFriends = () => {
        const friends = props.userData.friends.friends || {}
        const friendList = []

        for (const friendId in friends) {
            friendList.push(<Friend request={false} id={friends[friendId].id} avatar={friends[friendId].avatar} username={friends[friendId].username} discriminator={friends[friendId].discriminator} />)
        }

        return friendList.length !== 0 ?  friendList : <span className="my-friends-text5 notselectable">You have no friends :(</span>
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

export default MyFriends
