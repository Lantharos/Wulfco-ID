import React from 'react'

import PropTypes from 'prop-types'

import './connection-button.css'

const ConnectionButton = (props) => {
  return (
    <div className="connection-button-container">
      <a
        href={props.link_button}
        target="_blank"
        rel="noreferrer noopener"
        className="connection-button-link button"
      >
        <img
          alt={props.image_alt}
          src={props.image_src}
          loading="eager"
          className="connection-button-image"
        />
      </a>
    </div>
  )
}

ConnectionButton.defaultProps = {
  link_button: 'https://id.vikkivuk.xyz/connections/facebook/connect',
  image_src:
    'https://www.socialmediabutterflyblog.com/wp-content/uploads/sites/567/2021/01/Facebook-logo-500x350-1.png',
  image_alt: 'image',
}

ConnectionButton.propTypes = {
  link_button: PropTypes.string,
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
}

export default ConnectionButton
