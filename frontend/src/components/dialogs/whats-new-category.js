import React from 'react'

import PropTypes from 'prop-types'

import './whats-new-category.css'

const WhatsNewCategory = (props) => {
  return (
    <div className={`whats-new-category-container ${props.rootClassName} `}>
      <h1 id="title" className="whats-new-category-text notselectable">
        {props.heading}
      </h1>
      <p id="description" className="whats-new-category-text1 notselectable">
        <span className="">
            {props.description}
        </span>
        <br className=""></br>
      </p>
    </div>
  )
}

WhatsNewCategory.defaultProps = {
  heading: 'WULFCO ID RELEASE',
  rootClassName: '',
}

WhatsNewCategory.propTypes = {
  heading: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default WhatsNewCategory
