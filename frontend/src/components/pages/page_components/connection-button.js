import React from 'react'

import PropTypes from 'prop-types'

import './connection-button.css'

const ConnectionButton = (props) => {
  const onClick = () => {
    props.genURL(props.platform)
  }

  return (
    <div className="connection-button-container">
      <button className="connection-button-link button" type={"button"} onClick={() => onClick()}>
        <img
          alt={props.image_alt}
          src={props.image_src}
          loading="eager"
          className="connection-button-image"
        />
      </button>
    </div>
  )
}

ConnectionButton.defaultProps = {
  image_src: 'https://www.socialmediabutterflyblog.com/wp-content/uploads/sites/567/2021/01/Facebook-logo-500x350-1.png',
  image_alt: 'image',
}

ConnectionButton.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
}

export default ConnectionButton
