import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Project.css";
import avatarProject from "../multimedia/Images/avatarProject.png";
import Avatar from "../multimedia/Images/Avatar.jpg";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";
import { getProjectByName } from "../services/projectServices";
import UserCard from "../components/Cards/UserCard";
import { useTranslation } from "react-i18next";

const Project = () => {
  const { projectName } = useParams();
  const [project, setProject] = useState({});
  const [activeTab, setActiveTab] = useState("info");
  const token = Cookies.get("authToken");
  const currentUser = userStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProject = async () => {
      const encodedProjectName = encodeURIComponent(projectName);
      const projectData = await getProjectByName(token, encodedProjectName);
      setProject(projectData);
    };

    fetchProject();
  }, [projectName]);

  const isMember = project.teamMembers?.some(
    (member) => member.userId === currentUser.id
  );

  

  const renderInfoTabContent = () => {

    const slotsAvailable = project.maxTeamMembers !== undefined &&
    project.teamMembers !== undefined &&
    project.maxTeamMembers > project.teamMembers.length;
    
    return (
      <div className="card shadow-lg w-100">
        <img
          src={project.image ? project.image : avatarProject}
          alt={project.name}
          className="card-img-top"
        />
        <div className="card-body">
          <h2 className="card-title">{project.name}</h2>
          <p className="card-text-project">
            <strong>Status:</strong> {project.status}
          </p>
          <p className="card-text-project">
            <strong>Laboratory:</strong> {project.lab}
          </p>
          <p className="card-text-project">
            <strong>Description: </strong>
            {project.description}
          </p>
          <p className="card-text-project">
            <strong>Keywords: </strong>
            {project.interests &&
              project.interests.map((interest, index) => (
                <span
                  key={`${project.id}-keyword-${index}`}
                  className="badge badge-dark mr-2 mb-2"
                >
                  {interest}
                </span>
              ))}
          </p>
          <p className="card-text-project">
            <strong>Skills: </strong>
            {project.skills &&
              project.skills.map((skill, index) => (
                <span
                  key={`${project.id}-skill-${index}`}
                  className="badge badge-light mr-2 mb-2"
                >
                  {skill}
                </span>
              ))}
          </p>
          {!isMember && (
            <>
              <p className="card-text-project">
                <strong>Team Members:</strong>
              </p>
              {project.teamMembers &&
                project.teamMembers.map((member, index) => (
                  <div
                    key={`${project.id}-member-${index}`}
                    className="project-team-member"
                  >
                    <div className="member-container">
                      <img
                        src={member.userPhoto ? member.userPhoto : Avatar}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="project-team-member-image"
                      />
                      <span>
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                  </div>
                ))}
              <p className="card-text-project">
                <strong>Slots available:</strong>{" "}
                {project.maxTeamMembers !== undefined &&
                  project.teamMembers !== undefined &&
                  `${project.maxTeamMembers - project.teamMembers.length}/${
                    project.maxTeamMembers
                  }`}
              </p>
            </>
          )}
          {isMember && (
            <div>
              <p className="card-text-project">
                <strong>Materials:</strong>
              </p>
              {project.billOfMaterials &&
                project.billOfMaterials.map((material, index) => (
                  <div key={`${material.id}-${index}`}>
                    <p>
                      <strong>Name:</strong> {material.name}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {material.quantity}
                    </p>
                  </div>
                ))}
            </div>
          )}
          {!isMember && slotsAvailable && (
            <button className="btn btn-primary">Apply</button>
          )}
        </div>
      </div>
    );
  };
  const renderTeamTabContent = () => {
    return (
      <div className="card shadow-lg w-100">
        <h2>Team Members for {project.name}</h2>
        <p className="card-text-project">
          <strong>Slots available:</strong>{" "}
          {project.maxTeamMembers !== undefined &&
            project.teamMembers !== undefined &&
            `${project.maxTeamMembers - project.teamMembers.length}/${
              project.maxTeamMembers
            }`}
        </p>
        {project.teamMembers &&
          project.teamMembers.map((member, index) => (
            <UserCard key={`${project.id}-member-${index}`} user={member} />
          ))}
      </div>
    );
  };

  const renderExecutionPlanTabContent = () => {
    return (
      <div className="card shadow-lg w-100">
        <h2>Execution Plan for {project.name}</h2>
        {/* Conteúdo do plano de execução */}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return renderInfoTabContent();
      case "execution-plan":
        return renderExecutionPlanTabContent();
      case "team":
        return renderTeamTabContent();
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="app-container">
        <Sidebar />
        <div className="project-container">
          <div className="container mt-5">
            {isMember && (
              <nav>
                <div className="nav nav-tabs w-100">
                  <button
                    className={`nav-item nav-link ${
                      activeTab === "info" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("info")}
                  >
                    Info
                  </button>
                  <button
                    className={`nav-item nav-link ${
                      activeTab === "execution-plan" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("execution-plan")}
                  >
                    Execution Plan
                  </button>
                  <button
                    className={`nav-item nav-link ${
                      activeTab === "team" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("team")}
                  >
                    Team
                  </button>
                </div>
              </nav>
            )}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;