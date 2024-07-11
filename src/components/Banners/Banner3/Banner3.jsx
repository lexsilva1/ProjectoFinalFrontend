import React from 'react';
import projectsImage3 from "../../../multimedia/Images/projectsImage3.jpg";
import './Banner3.css'; 

const Banner3 = () => {
    return (
        <div className="banner3">
            <img src={projectsImage3} className="projectsImage" alt="projectsImage" />
            <div className="banner-text"> 
                <p>Enhance your teamwork</p> 
                <p>with streamlined</p>
                <p>project coordination.</p>
            </div>
        </div>
    );
};

export default Banner3;