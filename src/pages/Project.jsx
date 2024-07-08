import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Project.css";
import avatarProject from "../multimedia/Images/avatarProject.jpg";
import Avatar from "../multimedia/Images/Avatar.jpg";
import Header from "../components/Header";
import userStore from "../stores/userStore";
import WarningModal from "../components/Modals/WarningModal";
import ResourcesModal from "../components/Modals/ResourcesModal";
import { getProjectByName, projectApplication, updateProjectStatus, removeResourceToProject, updateResourceToProject } from "../services/projectServices";
import ProjectTeamTab from "../components/ProjectTeamTab";
import ExecutionPlan from "../components/ExecutionPlan";
import ChatIcon from "../components/ChatIcon";
import ProjectChat from "../components/ProjectChat";
import ProjectLogs from "../components/ProjectLogs";
import { useTranslation } from "react-i18next";
import { FaTrash, FaPencilAlt  } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';
import TypeModal from "../components/Modals/TypeModal";
import { getLabs } from "../services/labServices";
import { Typeahead } from 'react-bootstrap-typeahead';
import { getSkills, createSkill, deleteSkill, getSkillTypes } from "../services/skillServices";
import { getInterests, createInterest, deleteInterest, getInterestTypes } from "../services/interestServices";
import { use } from "i18next";



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
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [labs, setLabs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestTypes, setInterestTypes] = useState([]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [resolveOnSkillTypeSelected, setResolveOnSkillTypeSelected] = useState(null);
  const [modalType, setModalType] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {


          const [
            allLabs,
            allSkills,
            allInterests,
            fetchedSkillTypes,
            fetchedInterestTypes,
          ] = await Promise.all([
            getLabs(token),
            getSkills(token),
            getInterests(token),
            getSkillTypes(),
            getInterestTypes(),
          ]);

          setLabs(allLabs);
          setSkills(
            allSkills.filter(
              (skill) => !project?.skills?.some((s) => s.id === skill.id)
            )
          );
          setInterests(
            allInterests.filter(
              (interest) =>
                !project?.interests?.some((i) => i.id === interest.id)
            )
          );
          setSkillTypes(fetchedSkillTypes);
          setInterestTypes(fetchedInterestTypes);

        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [ project, token]);

  useEffect(() => {
    setSelectedInterests(project.interests || []);
    setSelectedSkills(project.skills || []);
  }, [project]);

  const onTypeSelect = (type) => {
    setSelectedType(type);
    if (resolveOnSkillTypeSelected) {
      resolveOnSkillTypeSelected(type);
      setResolveOnSkillTypeSelected(null);
    }
  };
  const handleOpenTypeModal = (type) => {
    setModalType(type);
    setShowTypeModal(true);
  };

  // Função para fechar o modal de adição de skill ou interesse
  const handleCloseTypeModal = () => {
    setShowTypeModal(false);
  };
  // Função para adicionar ou remover skills
  const handleSkillsChange = async (selected) => {
    debugger;
    if (selected.length > selectedSkills.length) {
      const newSkills = selected.filter(
        (skill) => !selectedSkills.some((s) => s.name === skill.name)
      );
      for (const skill of newSkills) {
        try {
          if (!skills.some((s) => s.name === skill.name)) {
            setModalType(skill.name);
            const skillTypeSelected = new Promise((resolve) => {
              setResolveOnSkillTypeSelected(() => resolve);
            });
            handleOpenModal("skill");
            skill.skillType = await skillTypeSelected;
            skill.projetcName = project.name;
            skill.id = null;
            delete skill.customOption;
            const result = await createSkill(token, skill);
            setSkills((prevSkills) => [...prevSkills, result]);
            setSelectedType("");
          } else {
            skill.projectName = project.name;
            const result = await createSkill(token, skill);
          }
        } catch (error) {
          console.error("Error creating skill:", error);
        }
      }
    } else if (selected.length < selectedSkills.length) {
     
      const removedSkills = selectedSkills.filter(
        (skill) => !selected.some((s) => s.name === skill.name)
      );
      console.log("removedSkills", removedSkills);
      console.log("selectedSkills", selectedSkills);
      console.log("selected", selected);
      for (const skill of removedSkills) {
        try {
          console.log("skill", skill);
          skill.projectName = project.name;
          const result = await deleteSkill(token, skill);
        } catch (error) {
          console.error("Error deleting skill:", error);
        }
        
      }
    }
    setSelectedSkills(selected);
  };

  // Função para adicionar ou remover interesses
  const handleInterestsChange = async (selected) => {
    if (selected.length > selectedInterests.length) {
      const newInterests = selected.filter(
        (interest) => !selectedInterests.some((i) => i.name === interest.name)
      );
      for (const interest of newInterests) {
        try {
         
          if (!interests.some((i) => i.name === interest.name)) {
            setModalType(interest.name);
            const interestTypeSelected = new Promise((resolve) => {
              setResolveOnSkillTypeSelected(() => resolve);
            });
            handleOpenTypeModal("interest");
            interest.interestType = await interestTypeSelected;
            interest.projectName = project.name;
            interest.id = null;
            delete interest.customOption;
            const result = await createInterest(token, interest);
            setInterests((prevInterests) => [...prevInterests, result]);
            setSelectedType("");
          } else {
            interest.projectName = project.name;
            const result = await createInterest(token, interest);
          }
        } catch (error) {
          console.error("Error creating interest:", error);
        }
      }
    } else if (selected.length < selectedInterests.length) {
      const removedInterests = selectedInterests.filter(
        (interest) => !selected.some((i) => i.name === interest.name)
      );
      for (const interest of removedInterests) {
        try {
          interest.projectName = project.name;
          const result = await deleteInterest(token, interest);
        } catch (error) {
          console.error("Error deleting interest:", error);
        }
      }
    }
    setSelectedInterests(selected);
    console.log("profile selectedInterests", selectedInterests);
    console.log("profile selected", selected);
  };
  const handleCancelProjectClick = () => {
    setShowWarningModal(true);
  };

  const handleCancel = () => {
    setShowWarningModal(false);
  };

  const handleConfirmCancel = async () => {
    setShowWarningModal(false);
    const status = 'Cancelled';
    try {
      await updateProjectStatus(token, project.name, status);
      console.log("Project status updated to Cancelled");
    } catch (error) {
      console.error("Failed to update project status:", error);
    }
  };

  const handleRestoreProject = async () => {
    setShowModal(false);
    const status = "Planning";
    try {
      await updateProjectStatus(token, project.name, status);

      console.log("Project status updated to Ready");
    } catch (error) {
      console.error("Failed to update project status:", error);
    }
  };

  const handleShowResourcesModal = () => setShowResourcesModal(true);
  const handleCloseResourcesModal = () => setShowResourcesModal(false);

  const handleResourceSelected = (resource) => {

  };

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
    (member) =>
      member.approvalStatus === "MEMBER" || member.approvalStatus === "CREATOR"
  );

  useEffect(() => {
    const fetchProject = async () => {
      const encodedProjectName = encodeURIComponent(projectName);
      const projectData = await getProjectByName(token, encodedProjectName);
      setProject(projectData);
      setStatus(projectData.status);
      
      console.log(projectData);
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
  const isMember =
    project.status !== "Cancelled" &&
    project.teamMembers?.some(
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

    const isCurrentUserAppManager = currentUser.role < 2;
    console.log(currentUser.role);

    const toggleEditDescription = () => {
      setIsEditingDescription(!isEditingDescription);
      // Inicializar a descrição editável com a descrição atual do projeto ao alternar para edição
      if (!isEditingDescription) {
        setDescription(project.description || "");
      }
    };

    return (
      <div className="card shadow-lg w-100">
        <img
          src={project.image ? project.image : avatarProject}
          alt={project.name}
          className="card-img-top"
        />
        <div className="card-body">
          <h2 className="card-title-project-info">{project.name}</h2>
          {status === "Cancelled" ? (
            <div className={getStatusClass(status)}>
              <div className="project-card-status-bar"></div>
              <strong>Cancelled</strong>
            </div>
          ) : (
            <div className={getStatusClass(status)}>
              <div className="project-card-status-bar"></div>
              <div className="status-options">
                {statuses.map((statusOption) => (
                  <div
                    key={statusOption}
                    className="status-option"
                    onClick={() =>
                      (isCurrentUserProjectManager ||
                        isCurrentUserAppManager) &&
                      updateStatus(statusOption)
                    }
                    style={{
                      cursor:
                        isCurrentUserProjectManager || isCurrentUserAppManager
                          ? "pointer"
                          : "default",
                    }}
                  >
                    <strong>{statusOption}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Row>
            <Col md={8}>
              <p className="card-text-project">
                <strong>Laboratory: </strong> {project.lab}
              </p>
              <p className="card-text-project">
                <strong>Description: </strong>{" "}
                {!isEditingDescription ? ( 
                  <>
                    {project.description}
                    <FaPencilAlt
                      className="edit-description-icon"
                      onClick={toggleEditDescription}
                    />
                  </>
                ) : (
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={toggleEditDescription}
                    autoFocus
                  />
                )}
              </p>
              <Col md={3} style={{ marginLeft: "0px" }}>
                        <h4 style={{ fontSize: "1rem" }}>{t("Skills")}</h4>
                        {isCurrentUserProjectManager ? (
                          <Typeahead
                            id="skills-typeahead"
                            labelKey="name"
                            multiple
                            onChange={handleSkillsChange}
                            options={skills}
                            allowNew
                            newSelectionPrefix="Add a new skill: "
                            placeholder= {t("Choose your skills...")}
                            selected={selectedSkills}
                          />
                        ) : (
                          <div>
                            {selectedSkills.map((skill, index) => (
                              <span key={index} className="user-pill">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <h4 style={{ fontSize: "1rem", marginTop: "40px" }}>
                          {t("Interests")}
                        </h4>
                        {isCurrentUserProjectManager ? (
                          <Typeahead
                            id="interests-typeahead"
                            labelKey="name"
                            multiple
                            onChange={handleInterestsChange}
                            options={interests}
                            allowNew
                            newSelectionPrefix="Add a new interest: "
                            placeholder= {t("Choose your interests...")}
                            selected={selectedInterests}
                          />
                        ) : (
                          <div>
                            {selectedInterests.map((interest, index) => (
                              <span key={index} className="user-pill">
                                {interest.name}
                              </span>
                            ))}
                          </div>
                        )}
                              <TypeModal
      show={showTypeModal}
      onHide={handleCloseTypeModal}
      title={`Add ${modalType}`}
      type={modalType}
      types={modalType === "skill" ? skillTypes : interestTypes}
      onTypeSelect={onTypeSelect}
    />
                      </Col>
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
                <div
                  className="table-responsive"
                  style={{ margin: "40px", width: "60%" }}
                >
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th
                          colSpan="2"
                          style={{
                            textAlign: "center",
                            padding: "20px",
                          }}
                        >
                          Materials
                        </th>
                      </tr>
                      <tr>
                        <th
                          style={{
                            width: "60%",
                            fontSize: "0.9rem",
                            alignItems: "center",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{ width: "20%", fontSize: "0.9rem", alignItems: "right"}}
                        >
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.billOfMaterials &&
                        project.billOfMaterials.map((material, index) => (
                          <tr key={`${material.id}-${index}`}>
                            <td style={{ fontSize: "0.9rem" }}>
                              {material.name}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                              style={{backgroundColor: "transparent", border: "none", cursor: "pointer"}}
                                onClick={() =>
                                  updateResourceToProject(
                                    token,
                                    project.name,
                                    material.id,
                                    material.quantity - 1
                                  )
                                }
                              >
                                -
                              </button>
                              {material.quantity}
                              <button
                               style={{backgroundColor: "transparent", border: "none", cursor: "pointer"}}
                                onClick={() =>
                                  updateResourceToProject(
                                    token,
                                    project.name,
                                    material.id,
                                    material.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </td>
                            <td>
                              <button
                               style={{backgroundColor: "transparent", border: "none", cursor: "pointer"}}
                                onClick={() =>
                                  removeResourceToProject(
                                    token,
                                    project.name,
                                    material.id,
                                    material.quantity
                                  )
                                }
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <button onClick={handleShowResourcesModal}>
                    Add resource/component
                  </button>
                  <ResourcesModal
                    show={showResourcesModal}
                    handleClose={handleCloseResourcesModal}
                    handleSelect={handleResourceSelected}
                    projectName={project.name}
                  />
                </div>
              )}
            </Col>
            {isMember && (
              <div>
                <ProjectLogs project={project} />
              </div>
            )}
            {(isCurrentUserProjectManager || isCurrentUserAppManager) &&
              project.status !== "Cancelled" && (
                <div style={{textAlign: "right"}}>
                  <button className= "cancel-project-button" onClick={handleCancelProjectClick}>
                    Cancel Project
                  </button>
                  <WarningModal
                    isOpen={showWarningModal}
                    message="Are you sure you want to cancel this project?"
                    onCancel={handleCancel}
                    onConfirm={handleConfirmCancel}
                  />
                </div>
              )}
            {isCurrentUserAppManager && project.status === "Cancelled" && (
              <div style={{textAlign: "center"}}>
                <button className = "restore-project" onClick={handleOpenModal}>Restore Project</button>
                <WarningModal
                  isOpen={showModal}
                  message="Are you sure you want to restore this project?"
                  onCancel={handleCloseModal}
                  onConfirm={handleRestoreProject}
                />
              </div>
            )}
          </Row>
          {!isMember && project.status !== "Cancelled" && (
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
        <div className={`project-container ${!isMember ? "non-member" : ""}`}>
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