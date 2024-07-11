import React from "react";
import DOMPurify from "dompurify";
import "bootstrap/dist/css/bootstrap.min.css";
import avatarProject from "../../../multimedia/Images/avatarProject.jpg";
import "./ProjectCard.css";
import { Link } from 'react-router-dom';
import { Badge } from "react-bootstrap";
import userStore from "../../../stores/userStore";
import { useTranslation } from "react-i18next";

const ProjectCard = ({ project, isLoggedIn }) => {
  const { t } = useTranslation();
  const currentUser = userStore((state) => state.user);
  const status = project.status == "In_Progress" ? "In Progress" : project.status;

  const getStatusClass = (status) => {
    switch (status) {
      case "Planning": return "project-card-status project-card-status-planning";
      case "Ready": return "project-card-status project-card-status-ready";
      case "Approved": return "project-card-status project-card-status-approved";
      case "In_Progress": return "project-card-status project-card-status-in-progress";
      case "Cancelled": return "project-card-status project-card-status-cancelled";
      case "Finished": return "project-card-status project-card-status-finished";
      default: return "project-card-status";
    }
  };

  const isMember = isLoggedIn && project.teamMembers?.some(member =>
    member.userId === currentUser.id && (member.approvalStatus === "MEMBER" || member.approvalStatus === "CREATOR")
  );

  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="project-card-card shadow-lg">
        <img
          src={project.image || avatarProject}
          alt={`Project ${project.name}`}
          className="project-card-card-img-top"
        />
        <div className="project-card-card-body">
          <div className="project-content-container">
            <h5 className="project-card-card-title">{project.name}</h5>
            <div className={getStatusClass(project.status)}>
              <div className="project-card-status-bar"></div>
              {t(status)}
            </div>
            <p className="project-card-card-text">
              <strong>{t("Keywords")}:</strong>
              {project.interests?.slice(0, 3).map((interest, index) => (
  <Badge key={`${project.id}-keyword-${index}`} className="project-card-badge project-card-badge-dark mr-2 mb-2 px-2">
    {interest.name}
  </Badge>
))}
{project.interests?.length > 3 && (
  <Badge className="project-card-badge project-card-badge-light mr-2 mb-2 px-2">
    +{project.interests.length - 3} more
  </Badge>
)}
            </p>
            <p className="project-card-card-text">
  <strong>{t("Skills")}:</strong>
  {project.skills?.slice(0, 3).map((skill, index) => (
    <Badge key={`${project.id}-skill-${index}`} className="project-card-badge project-card-badge-dark mr-2 mb-2 px-2">
      {skill.name}
    </Badge>
  ))}
  {project.skills?.length > 3 && (
    <Badge className="project-card-badge project-card-badge-light mr-2 mb-2 px-2">
      +{project.skills.length - 3} more
    </Badge>
  )}
</p>
            <p className="project-card-card-text lineclamp">
              <strong>{t("Description")}:</strong> <span dangerouslySetInnerHTML={createMarkup(project.description)}></span>
            </p>
          </div>
          {isLoggedIn && (
            <div className="project-card-btn-container">
              <Link
                to={`/project/${project.name}`}
                className="project-card-btn project-card-btn-primary"
              >
                {isMember ? t("Open Project") : t("See Details")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;