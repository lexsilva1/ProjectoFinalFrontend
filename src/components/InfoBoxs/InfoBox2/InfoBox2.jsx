import React, { useState } from 'react';
import './InfoBox2.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Alterado para Chevron
import ProjectsTeam from '../../../multimedia/Images/ProjectsTeam.jpg';
import GanttChart from '../../../multimedia/Images/GanttChart.jpg';
import stockManagement from '../../../multimedia/Images/stockManagement.jpg';

const InfoBox2 = () => {
    const [cardIndex, setCardIndex] = useState(0);
    const totalCards = 3; // Total de cartões

    const nextCard = () => {
        setCardIndex((prevCardIndex) => (prevCardIndex + 1) % totalCards);
    };

    const prevCard = () => {
        setCardIndex((prevCardIndex) => (prevCardIndex + totalCards - 1) % totalCards);
    };

    return (
        <div className="blue-square">
            <button onClick={prevCard} className="toggle-button-arrow" style={{opacity: cardIndex > 0 ? 1 : 0}}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            {cardIndex === 0 ? (
                <div className="white-card">
                    <h1>Our Innovative Mission</h1>
                    <p>
                        At ForgeXperimental Projects, we believe in the power of people and the excellence of innovation.
                        We are driven by the sharing of ideas, enthusiasm for creation, and the desire to go further.
                        Discover how we are shaping the future of technology through collaboration and unique values.
                    </p>
                    <img src={ProjectsTeam} alt="Projects Team" />
                </div>
            ) : cardIndex === 1 ? (
                <div className="white-card">
                    <h1>Empowering Collaboration</h1>
                    <p>
                        Our commitment extends beyond innovation to the meticulous orchestration of every project phase.
                        We empower teams to collaborate seamlessly, ensuring tasks are executed with precision and timelines are met with excellence.
                        Experience how our tools are designed to bring your project's vision to life, fostering a culture of accountability and strategic planning.
                    </p>
                    <img src={GanttChart} alt="Gantt Chart" />
                </div>
            ) : (
                <div className="white-card">
                    <h1>Optimizing Resources</h1>
                    <p>
                    We streamline resource management to enhance productivity and innovation. 
                    Our platform ensures efficient allocation and utilization of laboratory resources, 
                    fostering a collaborative environment where creativity thrives and projects progress smoothly.
                    </p>
                    <img src={stockManagement} alt="Stock Management" />
                </div>
            )}
            <button onClick={nextCard} className="toggle-button-arrow" style={{opacity: cardIndex < totalCards - 1 ? 1 : 0}}>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};

export default InfoBox2;