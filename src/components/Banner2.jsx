import React from 'react';
import projectsImage2 from "../multimedia/Images/projectsImage2.jpg";
import './Banner2.css'; 

const Banner = () => {
    return (
        <div className="banner2">
            <img src={projectsImage2} className="projectsImage" alt="projectsImage" />
            <div className="banner-text"> 
                <p>Boost your productivity</p> 
                <p>with smart task management.</p>
            </div>
        </div>
    );
};

export default Banner;