import React, {useState} from 'react'

import WhatsNewCategory from './whats-new-category'
import './whats-new.css'
import {motion} from 'framer-motion'

const WhatsNew = (props) => {
    const [ categories, setCategories ] = useState([])

    const mapCategories = () => {
        const categoriesRaw = props.changelog.data.categories || []
        categoriesRaw.forEach((category) => {
            setCategories(categories => [...categories, <WhatsNewCategory heading={category.heading} description={category.description}></WhatsNewCategory>])
        })
    }

    React.useEffect(() => {
        mapCategories()
    }, [])

  return (
    <div>
        <motion.div animate={ { opacity: 1, transition: { duration: 0.2 } } } initial={{ opacity: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="edit-username-background"></motion.div>

        <motion.div className={`whats-new-container`} animate={{height: 'auto', width: '457px'}} initial={{height: 0, width: 0}} exit={{opacity:0}}>
            <h1 className="whats-new-text notselectable">What&apos;s new</h1>
            <button id="close" type="button" className="whats-new-button button" onClick={() => {props.closeDialog()}}>X</button>
            <span className="whats-new-text1 notselectable">{props.changelog.data.updatedAt}</span>
            {(categories.length > 0) ? categories : <h1 className="notselectable" style={{color: "#a2a2a2", fontSize: "20px", marginLeft: "4%"}}>No changelog added.</h1>}
        </motion.div>
    </div>
  )
}

export default WhatsNew
