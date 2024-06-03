import React from 'react';
import './InfoBox.css';
import logo3 from '../multimedia/Images/logo3.png';

const InfoBox = () => {
    return (
        <div className="infoBox">
            <img src={logo3} alt="Logo" width="70" height="70" className="d-inline-block align-top" />
            <p className="title">Welcome to ForgeXperimental Projects</p>
            <p className="text">Your solution for managing</p>
            <p className="text">innovative tech projects.</p>
            <p className="text">Collaborate, track progress,</p>
            <p className="text">and optimize resources</p>
            <p className="text">from start to finish.</p>
            <p className="ending">Forge the future with us.</p>
        </div>
    );
};

export default InfoBox;