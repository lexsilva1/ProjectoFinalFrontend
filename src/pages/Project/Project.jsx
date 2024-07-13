import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Project.css";
import avatarProject from "../../multimedia/Images/avatarProject.jpg";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import Header from "../../components/Header/Header";
import userStore from "../../stores/userStore";
import WarningModal from "../../components/Modals/WarningModal/WarningModal";
import ResourcesModal from "../../components/Modals/ResourcesModal/ResourcesModal";
import {
  getProjectByName,
  projectApplication,
  updateProjectStatus,
  removeResourceToProject,
  updateResourceToProject,
  updateProject,
} from "../../services/projectServices";
import ProjectTeamTab from "../../components/ProjectTeamTab/ProjectTeamTab";
import ExecutionPlan from "../../components/ExecutionPlan/ExecutionPlan";
import ChatIcon from "../../components/ChatIcon";
import ProjectChat from "../../components/ProjectChat";
import ProjectLogs from "../../components/ProjectLogs/ProjectLogs";
import { useTranslation } from "react-i18next";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import TypeModal from "../../components/Modals/TypeModal/TypeModal";
import { getLabs } from "../../services/labServices";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  getSkills,
  createSkill,
  deleteSkill,
  getSkillTypes,
} from "../../services/skillServices";
import {
  getInterests,
  createInterest,
  deleteInterest,
  getInterestTypes,
} from "../../services/interestServices";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import { set } from "date-fns";

/* Project Component: Responsible for displaying the project details 
It shows the project information, team members, number of slots available if the user is not a member,
the title, status, description, skills, interests, logs and materials if the user is a member.
It also allows the user to apply to the project and if the user is an application manager, it allows the user to cancel 
or restore the project.
If the user is a project manager, it allows the user to change the status of the project, edit the description, 
add skills and interests, and add resources/components to the project.
*/

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
  const [resolveOnSkillTypeSelected, setResolveOnSkillTypeSelected] =
    useState(null);
  const [modalType, setModalType] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [billOfMaterials, setBillOfMaterials] = useState([]);
  const [selectedLab, setSelectedLab] = useState(project.lab);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  // Function to get the project data
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
  }, [project, token]);

  // Function to get the project data when the project changes or is updated
  useEffect(() => {
    setSelectedInterests(project.interests || []);
    setSelectedSkills(project.skills || []);
    setBillOfMaterials(project.billOfMaterials || []);
  }, [project]);

  // Function to choose the type of skill or interest
  const onTypeSelect = (type) => {
    setSelectedType(type);
    if (resolveOnSkillTypeSelected) {
      resolveOnSkillTypeSelected(type);
      setResolveOnSkillTypeSelected(null);
    }
  };

  // Function to open the modal to choose the type of skill or interest
  const handleOpenTypeModal = (type) => {
    setModalType(type);
    setShowTypeModal(true);
  };

  // Function to close the modal to choose the type of skill or interest
  const handleCloseTypeModal = () => {
    setShowTypeModal(false);
  };
  // Function to add or remove skills
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

  // Function to add or remove interests
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

  // Function to show the warning modal to cancel the project
  const handleCancelProjectClick = () => {
    setShowWarningModal(true);
  };

  // Function to close the warning modal to cancel the project
  const handleCancel = () => {
    setShowWarningModal(false);
  };

  // Function to confirm the cancelation of the project
  const handleConfirmCancel = async () => {
    setShowWarningModal(false);
    const status = "Cancelled";
    try {
      await updateProjectStatus(token, project.name, status).then(() => {
        setProject({ ...project, status: status });
      });
      console.log("Project status updated to Cancelled");
    } catch (error) {
      console.error("Failed to update project status:", error);
    }
  };

  // Function to restore the project
  const handleRestoreProject = async () => {
    setShowModal(false);
    const status = "Planning";
    try {
      await updateProjectStatus(token, project.name, status).then(() => {
        setProject({ ...project, status: status });
      });

      console.log("Project status updated to Ready");
    } catch (error) {
      console.error("Failed to update project status:", error);
    }
  };

  const handleShowResourcesModal = () => setShowResourcesModal(true);
  const handleCloseResourcesModal = () => setShowResourcesModal(false);
  const handleResourceSelected = (resource) => {};

  // Function to change the status of the project
  const changeStatus = (newStatus) => {
    if (newStatus === "In_Progress") {
      newStatus = "In Progress";
    }
    setStatus(newStatus);
  };

  // To see if the user has already applied to the project
  const hasUserApplied = project.teamMembers?.some(
    (member) =>
      member.userId === currentUser.id && member.approvalStatus === "APPLIED"
  );

  const handleNewLogAdded = () => {
    setLogUpdateTrigger((prev) => prev + 1);
  };

  // Define the statuses of the project and the colors
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

  // Function to update the status of the project
  const updateStatus = async (status) => {
    if (status === "In Progress") {
      status = "In_Progress";
    }
    const response = await updateProjectStatus(token, project.name, status);
    console.log(response);
    if (response === "status updated") {
      changeStatus(status);
    } else {
      console.log("Project has team members");
      setShowConfirmationModal(true);
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

  // Function to get the project data
  useEffect(() => {
    const fetchProject = async () => {
      const encodedProjectName = encodeURIComponent(projectName);
      const projectData = await getProjectByName(token, encodedProjectName);
      setProject(projectData);
      setStatus(projectData.status);
      setSelectedLab(projectData.lab);
      setDescription(projectData.description);
    };

    fetchProject();
  }, [projectName, token]);

  // Shows the data of the project
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

  // Function to verify if the user is a member of the project
  const isMember =
    project.status !== "Cancelled" &&
    project.teamMembers?.some(
      (member) =>
        member.userId === currentUser.id &&
        (member.approvalStatus === "MEMBER" ||
          member.approvalStatus === "CREATOR")
    );

  //Information tab content, with the project information verifing if the user is a member or not to render the correct components
  const renderInfoTabContent = () => {
    const approvedMembers = project.teamMembers
      ? project.teamMembers.filter(
          (member) =>
            member.approvalStatus === "MEMBER" ||
            member.approvalStatus === "CREATOR"
        )
      : [];

    const slotsAvailable = project.maxTeamMembers - approvedMembers.length;
    // If the user is not a member he can apply to the project, if he already applied he can't apply again and shows a message
    const handleApply = async () => {
      const response = await projectApplication(token, project.name);
      if (response === "applied") {
        navigate("/");
      } else {
        alert("You have already applied to this project");
      }
    };

    //Function to verify if the user is a project manager
    const isCurrentUserProjectManager = project.teamMembers?.some(
      (member) =>
        member.userId === currentUser.id && member.isProjectManager === true
    );

    //Function to verify if the user is an application manager
    const isCurrentUserAppManager = currentUser.role < 2;
    console.log(currentUser.role);

    const toggleEditDescription = () => {
      setIsEditingDescription(!isEditingDescription);
      setShowSaveButton(!isEditingDescription);
      if (!isEditingDescription) {
        setDescription(project.description || "");
      }
    };

    // Function to handle the change in the description
    const handleDescriptionChange = (value) => {
      setDescription(value);
    };

    // Function to handle the change in the lab
    const handleLabChange = async (event) => {
      console.log(event.target.value);
      setSelectedLab(event.target.value);
      const projectDto = {
        lab: event.target.value,
        description: description,
      };
      await updateProject(token, project.name, projectDto);
    };

    // Function to save the changes in the description and lab
    const handleSave = async () => {
      const projectDto = {
        lab: selectedLab,
        description: description,
      };
      try {
        await updateProject(token, project.name, projectDto);
        setIsEditingDescription(false);
        setShowSaveButton(false);
        setDescription(description);
      } catch (error) {
        console.error("Erro ao atualizar o projeto:", error);
      }
    };

    return (
      <div className="card shadow-lg w-100">
        <Card.Header
          className="d-flex justify-content-between align-items-center"
          style={{ height: "60px" }}
        ></Card.Header>
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
              <strong>{t("Cancelled")}</strong>
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
            <Col md={12}>
              <p className="card-text-project">
                <strong>{t("Laboratory")}: </strong>{" "}
                {isCurrentUserProjectManager ? (
                  <select
                    style={{
                      border: "solid 1px #c6c2c2",
                      marginLeft: "10px",
                      borderRadius: "5px",
                    }}
                    value={selectedLab}
                    onChange={(e) => handleLabChange(e)}
                  >
                    {labs.map((lab) => (
                      <option key={lab.location} value={lab.location}>
                        {lab.location}
                      </option>
                    ))}
                  </select>
                ) : (
                  project.lab
                )}
              </p>
              <div>
                <p
                  className="card-text-project"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",

                    padding: "5px",
                    borderTopRightRadius: "5px",
                    borderTopLeftRadius: "5px",
                  }}
                >
                  <strong>{t("Description")}: </strong>
                  <FaPencilAlt
                    className="edit-description-icon"
                    onClick={toggleEditDescription}
                    style={{ cursor: "pointer" }}
                  />
                </p>
                <div
                  style={{
                    marginLeft: "40px",
                    marginTop: "-40.5px",
                    border: isEditingDescription ? "none" : "none",
                    width: isEditingDescription ? "96.6%" : "93.7%",
                    borderBottomRightRadius: isEditingDescription
                      ? "0px"
                      : "5px",
                    borderBottomLeftRadius: isEditingDescription
                      ? "0px"
                      : "5px",
                  }}
                >
                  {!isEditingDescription ? (
                    <>
                      <span
                        style={{ width: "90%" }}
                        dangerouslySetInnerHTML={createMarkup(description)}
                      ></span>
                    </>
                  ) : (
                    <>
                      <textarea
                        style={{ width: "97%", height: "100px" }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      {showSaveButton && (
                        <div>
                          <button class="btn btn-primary" onClick={handleSave}>
                            {t("Save")}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div style={{ margin: "40px" }}>
                <h4 style={{ fontSize: "1rem" }}>{t("Skills")}:</h4>
                {isCurrentUserProjectManager ? (
                  <Typeahead
                    id="skills-typeahead"
                    labelKey="name"
                    className="custom-typeahead"
                    multiple
                    onChange={handleSkillsChange}
                    options={skills}
                    allowNew
                    newSelectionPrefix="Add a new skill: "
                    placeholder={t("Choose your skills...")}
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
                  {t("Keywords")}:
                </h4>
                {isCurrentUserProjectManager ? (
                  <Typeahead
                    id="interests-typeahead"
                    labelKey="name"
                    className="custom-typeahead"
                    multiple
                    onChange={handleInterestsChange}
                    options={interests}
                    allowNew
                    newSelectionPrefix="Add a new interest: "
                    placeholder={t("Choose your interests...")}
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
              </div>
              {!isMember && (
                <>
                  <p className="card-text-project">
                    <strong>{t("Team Members")}:</strong>
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
                    <strong>{t("Slots available")}:</strong>{" "}
                    {project.maxTeamMembers !== undefined &&
                      project.teamMembers !== undefined &&
                      `${slotsAvailable}/${project.maxTeamMembers}`}
                  </p>
                </>
              )}
            </Col>
            <Col md={12}>
              {isMember && (
                <div
                  className="table-responsive"
                  style={{ margin: "40px", width: "93.7%" }}
                >
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th
                          colSpan="2"
                          style={{
                            width: "100%",
                            padding: "10px",
                            border: "solid 1px #c6c2c2",
                            borderRadius: "5px",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <span style={{ marginTop: "5px" }}>
                              {t("Materials")}:
                            </span>
                            <Button
                              variant="primary"
                              onClick={handleShowResourcesModal}
                            >
                              {t("Add resource/component")}
                            </Button>
                          </div>
                        </th>
                      </tr>
                      <tr>
                        <th
                          style={{
                            width: "60%",
                            fontSize: "0.9rem",
                            alignItems: "center",
                            padding: "10px",
                          }}
                        >
                          {t("Name")}
                        </th>
                        <th
                          style={{
                            width: "20%",
                            fontSize: "0.9rem",
                            alignItems: "right",
                            padding: "10px",
                          }}
                        >
                          {t("Quantity")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.billOfMaterials &&
                        project.billOfMaterials.map((material, index) => (
                          <tr key={`${material.id}-${index}`}>
                            <td style={{ fontSize: "0.9rem", padding: "10px" }}>
                              {material.name}
                            </td>
                            <td>
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  updateResourceToProject(
                                    token,
                                    project.name,
                                    material.id,
                                    material.quantity - 1,
                                    setProject({
                                      ...project,
                                      billOfMaterials:
                                        project.billOfMaterials.map((m) =>
                                          m.id === material.id
                                            ? { ...m, quantity: m.quantity - 1 }
                                            : m
                                        ),
                                    })
                                  )
                                }
                              >
                                -
                              </button>
                              {material.quantity}
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  updateResourceToProject(
                                    token,
                                    project.name,
                                    material.id,
                                    material.quantity + 1,
                                    setProject({
                                      ...project,
                                      billOfMaterials:
                                        project.billOfMaterials.map((m) =>
                                          m.id === material.id
                                            ? { ...m, quantity: m.quantity + 1 }
                                            : m
                                        ),
                                    })
                                  )
                                }
                              >
                                +
                              </button>
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  width: "20px",
                                  marginLeft: "60px",
                                }}
                                onClick={() =>
                                  removeResourceToProject(
                                    token,
                                    project.name,
                                    material.id,
                                    material.quantity,
                                    setProject({
                                      ...project,
                                      billOfMaterials:
                                        project.billOfMaterials.filter(
                                          (m) => m.id !== material.id
                                        ),
                                    })
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

                  <ResourcesModal
                    show={showResourcesModal}
                    handleClose={handleCloseResourcesModal}
                    handleSelect={handleResourceSelected}
                    projectName={project.name}
                    project={project}
                    setProject={setProject}
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
                <div style={{ textAlign: "right" }}>
                  <button
                    className="cancel-project-button"
                    onClick={handleCancelProjectClick}
                  >
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
              <div style={{ textAlign: "center" }}>
                <button className="restore-project" onClick={handleOpenModal}>
                  Restore Project
                </button>
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
      <ConfirmationModal
        show={showConfirmationModal}
        message="You can't change the project to this status"
        handleClose={() => setShowConfirmationModal(false)}
      />
    </>
  );
};

export default Project;
