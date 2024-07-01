import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import avatarProject from "../../multimedia/Images/avatarProject.jpg";
import "./ProjectCard.css";
import { Link } from 'react-router-dom';
import { Badge } from "react-bootstrap";
import userStore from "../../stores/userStore";

const ProjectCard = ({ project, isLoggedIn }) => {

  const getStatusClass = (status) => {
    switch (status) {
      case "Planning":
        return "project-card-status project-card-status-planning";
      case "Ready":
        return "project-card-status project-card-status-ready";
      case "Approved":
        return "project-card-status project-card-status-approved";
      case "In Progress":
        return "project-card-status project-card-status-in-progress";
      case "Cancelled":
        return "project-card-status project-card-status-cancelled";
      case "Finished":
        return "project-card-status project-card-status-finished";
      default:
        return "project-card-status";
    }
  };


  

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
            <h5 className="project-card-card-title">{project.name}</h5>

            <div className={getStatusClass(project.status)}>
              <div className="project-card-status-bar"></div>
              <strong></strong> {project.status}
            </div>

            <p className="project-card-card-text">
              <strong>Keywords:</strong>
              {project.interests &&
                project.interests.map((interest, index) => (
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
                project.skills.map((skill, index) => (
                  <Badge
                    key={`${project.id}-skill-${index}`}
                    className="project-card-badge project-card-badge-light mr-2 mb-2 px-2"
                  >
                    {skill}
                  </Badge>
                ))}
            </p>

            <p className="project-card-card-text">
              <strong>Description:</strong> {project.description}
            </p>
          </div>
          
          {isLoggedIn && (() => {
            const currentUser = userStore((state) => state.user);
            const isMember = project.teamMembers?.some(
              (member) =>
                member.userId === currentUser.id &&
                (member.approvalStatus === "MEMBER" ||
                  member.approvalStatus === "CREATOR")
            );
          
            return (
              <div className="project-card-btn-container">
                <Link
                  to={`/project/${project.name}`}
                  className="project-card-btn project-card-btn-primary"
                >
                  {isMember ? "Open Project" : "See Details"}
                </Link>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
