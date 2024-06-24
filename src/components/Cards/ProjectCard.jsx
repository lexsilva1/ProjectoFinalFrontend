import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import avatarProject from "../../multimedia/Images/avatarProject.png";
import "./ProjectCard.css";
import { Link } from 'react-router-dom';
import { Badge } from "react-bootstrap";

const ProjectCard = ({ project, isLoggedIn }) => {
const skills = project.skills;
const skillNames = skills.map((skill) => skill.name);
const interests = project.interests;
const interestNames = interests.map((interest) => interest.name);
  

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="project-card-card shadow-lg">
        <img
          src={project.image ? project.image : avatarProject}
          alt={project.name}
          className="project-card-card-img-top"
        />
        <div className="project-card-card-body">
        <div className="project-content-container">
          <h5 className="project-card-card-title"> {project.name}</h5>
          <p className="project-card-card-text">
            <strong>Status: </strong> {project.status}
          </p>
          
          <p className="project-card-card-text">
            <strong>Keywords:</strong>
            {project.interests &&
              interestNames.map((interest, index) => (
                <Badge
                  key={`${project.id}-keyword-${index}`}
                  className="project-card-badge project-card-badge-dark mr-2 mb-2 px-2"
                >
                  {interest}
                </Badge>
              ))}
          </p>
          
          <p className="project-card-card-text">
            <strong>Skills:</strong>
            {project.skills &&
              skillNames.map((skill, index) => (
                <Badge
                  key={`${project.id}-skill-${index}`}
                  className="project-card-badge project-card-badge-light mr-2 mb-2 px-2"
                >
                  {skill}
                </Badge>
              ))}
          </p>
          <p className="project-card-card-text">
            <strong>Description: </strong>
            {project.description}
          </p>
          
          </div>
          {isLoggedIn && (
            <Link to={`/project/${project.name}`} className="project-card-btn project-card-btn-primary">Open Project</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
