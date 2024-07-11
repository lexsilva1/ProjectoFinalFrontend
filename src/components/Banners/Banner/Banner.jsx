import React from 'react';
import projectsImage from "../../../multimedia/Images/projectsImage.jpg";
import './Banner.css'; 

const Banner = ({ isLoggedIn }) => {
    return (
        <div className={`banner ${isLoggedIn ? 'banner-logged-in' : ''}`}>
            <img src={projectsImage} className="projectsImage" alt="projectsImage" />
            <div className="banner-text"> 
                <p>Empower your projects</p> 
                <p>where seamless management</p>
                <p>meets success.</p>
            </div>
        </div>
    );
};

export default Banner;
