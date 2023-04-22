import React from 'react'

import './loading.css'
import { motion } from 'framer-motion'

const Loading = (props) => {
    return (
        <div className="coming-soon-container">
            <div>
                <motion.a animate={{opacity: [1, 0.5, 0], scale: [3, 3.2, 3],}} transition={{ duration: 0.6, repeat: Infinity }} style={{ color: "#ffffff", fontFamily: "Roboto", display: "inline-flex", marginRight: "0.5em", fontSize: "24px", cursor: "default", userSelect: "none" }}>.</motion.a>
                <motion.a animate={{opacity: [0, 1, 0.5], scale: [3, 3, 3.2],}} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} style={{ color: "#ffffff", fontFamily: "Roboto", display: "inline-flex", marginRight: "0.5em", fontSize: "24px", cursor: "default", userSelect: "none" }}>.</motion.a>
                <motion.a animate={{opacity: [0.5, 0, 1], scale: [3.2, 3, 3],}} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} style={{ color: "#ffffff", fontFamily: "Roboto", display: "inline-flex", marginRight: "0.5em", fontSize: "24px", cursor: "default", userSelect: "none" }}>.</motion.a>
            </div>
        </div>
    );
}

export default Loading
