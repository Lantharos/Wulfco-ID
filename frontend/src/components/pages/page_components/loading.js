import React from 'react';
import './loading.css';
import { motion } from 'framer-motion';
import LightningStrike from './LightningStrike'; // Import the LightningStrike component

const Loading = (props) => {
    return (
        <div className="coming-soon-container">
            <LightningStrike color="#FF4444" /> {/* Use any color you like */}
        </div>
    );
};

export default Loading;
