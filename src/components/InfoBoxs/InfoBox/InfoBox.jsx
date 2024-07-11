import React from 'react';
import './InfoBox.css';
import logo3 from '../../../multimedia/Images/logo3.png';

const InfoBox = () => {
    return (
        <div className="infoBox" style={{ width: '60%', position: 'relative', }}>
            <p className="title" style={{ marginTop:'60px'}}>Welcome to</p>
            <p className="title title-bottom-margin">Forge<span><img src={logo3} alt="Logo" style={{width: '1.5em', height: '1.5em', verticalAlign: 'middle'}} /></span>perimental Projects</p>
            <p className="text">Your solution for managing innovative tech projects.</p>
            <p className="text">Collaborate, track progress, and optimize resources from start to finish.</p>
            <p className="text"></p>
            <p className="text"></p>
            <p className="ending">Forge the future with us.</p>
        </div>
    );
};

export default InfoBox;