import React from 'react';
import usersImage from "../../../multimedia/Images/usersImage.jpg";
import './BannerUsers.css';

const BannerUsers = () => {
    return (
        <div className="banner-users">
            <img src={usersImage} className="usersImage" alt="usersImage" />
            <div className="banner-text"> 
                <p>Empower your team</p> 
                <p>for seamless collaboration</p>
                <p>and success.</p>
            </div>
        </div>
    );
};

export default BannerUsers;