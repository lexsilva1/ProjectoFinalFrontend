import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import avatarProject from '../multimedia/Images/avatarProject.png';
import './ProjectCard.css';

const ProjectCard = ({ project, isLoggedIn }) => {
    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-lg">
                <img src={project.image ? project.image : avatarProject} alt={project.name} className="card-img-top" /> 
                <div className="card-body">
                    <h5 className="card-title"> {project.name}</h5>
                    <p className="card-text">
                        <strong>Status:</strong> {project.status}
                    </p>
                    <p className="card-text">
                        <strong>Keywords:</strong> 
                        {project.interests && project.interests.map((interest, index) => (
                            <span key={`${project.id}-keyword-${index}`} className="badge badge-dark mr-2 mb-2">{interest}</span>
                        ))}
                    </p>
                    <p className="card-text">
                        <strong>Skills:</strong> 
                        {project.skills && project.skills.map((skill, index) => (
                            <span key={`${project.id}-skill-${index}`} className="badge badge-light mr-2 mb-2">{skill}</span>
                        ))}
                    </p>
                    <p className="card-text">
    <strong>Description:</strong> 
    {project.description}
</p>
                    {isLoggedIn && (
                        <button className="btn btn-primary">Open Project</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;