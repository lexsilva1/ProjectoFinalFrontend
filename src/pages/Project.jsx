import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Project.css";
import avatarProject from "../multimedia/Images/avatarProject.jpg";
import Avatar from "../multimedia/Images/Avatar.jpg";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";
import WarningModal from "../components/Modals/WarningModal";
import { getProjectByName, projectApplication, updateProjectStatus, fetchProjectLogs } from "../services/projectServices";
import ProjectTeamTab from "../components/ProjectTeamTab";
import ExecutionPlan from "../components/ExecutionPlan";
import ChatIcon from "../components/ChatIcon";
import ProjectChat from "../components/ProjectChat";
import ProjectLogs from "../components/ProjectLogs";
import { useTranslation } from "react-i18next";
import { Container, Row, Col } from 'react-bootstrap';



const Project = () => {
  const { projectName } = useParams();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const [project, setProject] = useState({});
  const [activeTab, setActiveTab] = useState("info");
  const token = Cookies.get("authToken");
  const currentUser = userStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState();
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [logs, setLogs] = useState([]);
  const [logUpdateTrigger, setLogUpdateTrigger] = useState(0);
  const changeStatus = (newStatus) => {
    if (newStatus === "In_Progress") {
      newStatus = "In Progress";
    }
    setStatus(newStatus);
  };

  const hasUserApplied = project.teamMembers?.some(
    (member) =>
      member.userId === currentUser.id && member.approvalStatus === "APPLIED"
  );

  const handleNewLogAdded = () => {
    console.log("Log added, incrementing trigger");
    setLogUpdateTrigger((prev) => prev + 1);
  };

  const statuses = ["Planning", "Ready", "Approved", "In Progress", "Finished"];
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
  const updateStatus = async (status) => {
    if (status === "In Progress") {
      status = "In_Progress";
    }
    const response = await updateProjectStatus(token, project.name, status);
    console.log(response);
    if (response === "status updated") {
      changeStatus(status);
    } else {
      alert("You can't update the status to this value");
    }
  };
  const isUserMember = project.teamMembers?.some(
    (member) =>
      member.approvalStatus === "MEMBER" || member.approvalStatus === "CREATOR"
  );

  const teamMembers = project.teamMembers?.filter(
    (member) => member.approvalStatus === "MEMBER"
  );

  useEffect(() => {
    const fetchProject = async () => {
      const encodedProjectName = encodeURIComponent(projectName);
      const projectData = await getProjectByName(token, encodedProjectName);
      setProject(projectData);
      setStatus(projectData.status);
    };

    fetchProject();
  }, [projectName, token]);

  const projectTask = {
    id: project.id,
    name: project.name,
    start: project.startDate,
    end: project.endDate,
    progress: 50,
    dependencies: [],
    isDisabled: false,
    styles: {
      progressColor: "#ffbb54",
      progressSelectedColor: "#ff9e0d",
    },
    type: "project",
  };
  const isMember = project.teamMembers?.some(
    (member) =>
      member.userId === currentUser.id &&
      (member.approvalStatus === "MEMBER" ||
        member.approvalStatus === "CREATOR")
  );

  const renderInfoTabContent = () => {
    const approvedMembers = project.teamMembers
      ? project.teamMembers.filter(
          (member) =>
            member.approvalStatus === "MEMBER" ||
            member.approvalStatus === "CREATOR"
        )
      : [];

    const slotsAvailable = project.maxTeamMembers - approvedMembers.length;

    const handleApply = async () => {
      const response = await projectApplication(token, project.name);
      if (response === "applied") {
        navigate("/");
      } else {
        alert("You have already applied to this project");
      }
    };

    const isCurrentUserProjectManager = project.teamMembers?.some(
      (member) =>
        member.userId === currentUser.id && member.isProjectManager === true
    );

    const isCurrentUserAppManager = currentUser.role <2;

    return (
      <div className="card shadow-lg w-100">
        <img
          src={project.image ? project.image : avatarProject}
          alt={project.name}
          className="card-img-top"
        />
        <div className="card-body">
          <h2 className="card-title-project-info">{project.name}</h2>
          <div className={getStatusClass(status)}>
            <div className="project-card-status-bar"></div>
            <div className="status-options">
              {statuses.map((statusOption) => (
                <div
                  key={statusOption}
                  className="status-option"
                  onClick={() => (isCurrentUserProjectManager || isCurrentUserAppManager) && updateStatus(statusOption)}
                  style={{ cursor: isCurrentUserProjectManager || isCurrentUserAppManager ? "pointer" : "default" }}
                >
                  <strong>{statusOption}</strong>
                </div>
              ))}
            </div>
          </div>
          <Row>
            <Col md={8}>
              <p className="card-text-project">
                <strong>Laboratory: </strong> {project.lab}
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
                  <div className="card-text-project">
                    {teamMembers &&
                      teamMembers.map((member, index) => (
                        <div
                          key={`${project.id}-member-${index}`}
                          className="project-team-member"
                        >
                          <img
                            src={member.userPhoto ? member.userPhoto : Avatar}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="project-team-member-image"
                          />
                          <span className="project-team-member-name">
                            {member.firstName} {member.lastName}
                          </span>
                        </div>
                      ))}
                  </div>
                  <p className="card-text-project">
                    <strong>Slots available:</strong>{" "}
                    {project.maxTeamMembers !== undefined &&
                      project.teamMembers !== undefined &&
                      `${slotsAvailable}/${project.maxTeamMembers}`}
                  </p>
                </>
              )}
            </Col>
            <Col md={4}>
              {" "}
              {isMember && (
                <div className="table-responsive" style={{ margin: "40px", borderRadius: "10px" }}>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th
                          colSpan="2"
                          style={{
                            textAlign: "center",
                            backgroundColor: "var(--details-color",
                          }}
                        >
                          Materials
                        </th>
                      </tr>
                      <tr>
                        <th
                          style={{ width: "20%", backgroundColor: "#f0f0f0", fontSize: "0.9rem", alignItems: "center"}}
                        >
                          Name
                        </th>
                        <th
                          style={{ width: "10%", backgroundColor: "#f0f0f0", fontSize: "0.9rem", alignItems: "center"}}
                        >
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.billOfMaterials &&
                        project.billOfMaterials.map((material, index) => (
                          <tr key={`${material.id}-${index}`}>
                            <td  style={{fontSize: "0.9rem" }}>{material.name}</td>
                            <td>{material.quantity}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Col>
            {isMember && (
              <div>
                <ProjectLogs project={project} />
              </div>
            )}
            {isCurrentUserProjectManager && (
                <button className="btn-project-apply" onClick={handleOpenModal}>
                  Cancel Project
                </button>
            )}
          </Row>
          {!isMember && (
            <div className="button-container">
              {hasUserApplied ? (
                <div>You have applied to this project.</div>
              ) : (
                <button className="btn-project-apply" onClick={handleApply}>
                  Apply
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTeamTabContent = () => {
    return <ProjectTeamTab project={project} />;
  };

  const renderExecutionPlanTabContent = () => {
    return (
      <div className="card shadow-lg w-100">
        <ExecutionPlan
          name={project.name}
          startDate={project.startDate}
          endDate={project.endDate}
          projectTask={projectTask}
        />
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
      {isMember && <ChatIcon onChatIconClick={toggleChat} />}
      {isChatOpen && <ProjectChat isOpen={isChatOpen} onClose={toggleChat} />}
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