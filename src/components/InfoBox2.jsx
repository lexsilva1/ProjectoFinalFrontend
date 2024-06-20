import React from 'react';
import './InfoBox2.css';
import ProjectsTeam from '../multimedia/Images/ProjectsTeam.jpg';

const InfoBox2 = () => {
    return (
        <div className="blue-square">
            <div className="white-card">
                <h1>Our Innovative Mission</h1>
                <p>
                    At ForgeXperimental Projects, we believe in the power of people and the excellence of innovation.
                    We are driven by the sharing of ideas, enthusiasm for creation and the desire to go further.
                    Discover how we are shaping the future of technology through collaboration and unique values.
                </p>
                <img src={ProjectsTeam} alt="Projects Team" />
            </div>
        </div>
    );
};

export default InfoBox2;