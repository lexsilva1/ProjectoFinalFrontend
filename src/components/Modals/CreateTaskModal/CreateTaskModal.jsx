import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getProjectByName,
  createTask,
  updateTask,
} from "../../../services/projectServices";
import Cookies from "js-cookie";
import MembersModal from "../MembersModal/MembersModal";
import Avatar from "../../../multimedia/Images/Avatar.jpg";
import { Dropdown, DropdownButton, Col, Row } from "react-bootstrap";
import "./CreateTaskModal.css";
import { format } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateTaskModal = ({
  closeModal,
  addTask,
  projectName,
  tasks,
  selectedTask,
  isEditMode,
  setUpadatePing,
}) => {
  const [projectMembers, setProjectMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState(selectedTask ? selectedTask.title : "");
  const [externalExecutors, setExternalExecutors] = useState(
    selectedTask ? selectedTask.externalExecutors : ""
  );
  const [description, setDescription] = useState(
    selectedTask ? selectedTask.description : ""
  );
  const [responsibleId, setResponsibleId] = useState("");
  const [startDate, setStartDate] = useState(
    selectedTask ? new Date(selectedTask.start) : ""
  );
  const [endDate, setEndDate] = useState(
    selectedTask ? new Date(selectedTask.end) : ""
  );
  const [creationDate, setCreationDate] = useState("");
  const [dependencies, setDependencies] = useState(
    selectedTask ? selectedTask.dependencies : []
  );
  const [users, setUsers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const token = Cookies.get("authToken");
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedResponsible, setSelectedResponsible] = useState(
    selectedTask
      ? projectMembers.find(
          (member) => member.userId === selectedTask.responsibleId
        )
      : null
  );
  const [selectedMembers, setSelectedMembers] = useState(
    selectedTask
      ? projectMembers.filter((member) =>
          selectedTask.users.includes(member.userId)
        )
      : []
  );
  const [selectionType, setSelectionType] = useState("");
  const [status, setStatus] = useState(
    selectedTask ? selectedTask.status : "NOT_STARTED"
  );

  const fetchProjectDetails = async () => {
    try {
      const projectDetails = await getProjectByName(token, projectName);
      const members = projectDetails.teamMembers.filter(
        (member) => member.approvalStatus === "MEMBER" || "CREATOR"
      );
      setProjectMembers(members);
      setFilteredMembers(members);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectName]);

  useEffect(() => {
    const filtered = projectMembers.filter((member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm, projectMembers]);

  const handleMembersClick = (type) => {
    setSelectionType(type);
    setIsMembersModalOpen(true);
  };

  const handleSelectUser = (user, type) => {
    console.log("Selected User ID:", user.userId);
    if (type === "responsible") {
      setSelectedResponsible(user);
      setResponsibleId(user.userId);
    } else if (type === "member") {
      if (!selectedMembers.some((member) => member.userId === user.userId)) {
        setSelectedMembers((users) => [...users, user]);
      }
    }
    setIsMembersModalOpen(false);
  };

  const handleSelectDependency = (taskId) => {
    if (!dependencies.includes(taskId)) {
      setDependencies([...dependencies, taskId]);
    } else {
      setDependencies(dependencies.filter((id) => id !== taskId));
    }
  };

  const renderDependencyNames = () => {
    return tasks
      .filter((task) => dependencies.includes(task.id))
      .map((task) => <div key={task.id}>{task.title}</div>);
  };

  const removeSelectedMember = (memberId) => {
    const updatedMembers = selectedMembers.filter(
      (member) => member.id !== memberId
    );
    setSelectedMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Members:", selectedMembers);
    const taskDto = {
      title,
      externalExecutors,
      description,
      projectName,
      responsibleId,
      dependencies,
      users: selectedMembers.map((member) => member.userId),
      start: startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss") : null,
      end: endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss") : null,
      status,
    };

    if (isEditMode && selectedTask) {
      try {
        await updateTask(token, projectName, {
          ...taskDto,
          id: selectedTask.id,
        });
        console.log(taskDto);
        addTask({ ...taskDto, id: selectedTask.id });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      try {
        const response = await createTask(token, projectName, taskDto);
        addTask(response.task);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
    setUpadatePing();
    closeModal();
  };

  useEffect(() => {
    if (isEditMode && selectedTask) {
      const responsible = projectMembers.find(
        (member) => member.userId === selectedTask.responsibleId
      );
      setSelectedResponsible(responsible);

      if (responsible) {
        setResponsibleId(responsible.userId);
      }

      const members = projectMembers.filter((member) =>
        selectedTask.users.includes(member.userId)
      );
      setSelectedMembers(members);
      setStatus(selectedTask.status);
    }
  }, [isEditMode, selectedTask, projectMembers]);

  const statusLabels = {
    NOT_STARTED: "Not Started",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const renderStatusDropdown = () => (
    <DropdownButton
      style={{ backgroundColor: "transparent", marginLeft: "20px" }}
      id="status-dropdown"
      title={statusLabels[status] || "Select Status"}
    >
    {status != "NOT_STARTED" ? <Dropdown.Item onClick={() => setStatus("NOT_STARTED")}>
        Not Started
      </Dropdown.Item> : null}
      {status != 'IN_PROGRESS' ? <Dropdown.Item onClick={() => setStatus("IN_PROGRESS")}>
        In Progress
      </Dropdown.Item> : null}
     {status != 'COMPLETED'? <Dropdown.Item onClick={() => setStatus("COMPLETED")}>
        Completed
      </Dropdown.Item> : null}
     {status != 'CANCELLED' ?<Dropdown.Item onClick={() => setStatus("CANCELLED")}>
        Cancelled
      </Dropdown.Item> : null}
    </DropdownButton>
  );

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      contentLabel={isEditMode ? "Edit Task" : "Create Task"}
      ariaHideApp={false}
    >
      <div className="modal-create-task-header">
        <h2>{isEditMode ? "Edit Task" : "Create Task"}</h2>
        <button onClick={closeModal} className="close-button">
          &times;
        </button>
      </div>
      <div className="modal-content-container">
        <Row>
          <Col xs={12} md={6}>
            <div
              className="modal-info"
              style={{
                marginLeft: "40px",
                marginRight: "40px",
                marginBottom: "40px",
              }}
            >
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  {isEditMode && (
                    <>
                      <label style={{ fontWeight: "bold" }}>
                        Status: {renderStatusDropdown()}
                      </label>
                    </>
                  )}
                </div>
                <div className="form-group" style={{ marginTop: "30px" }}>
                  <label style={{ fontWeight: "bold" }}>
                    Title:{" "}
                    <input
                      type="text"
                      value={title}
                      style={{ marginLeft: "10px" }}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled= {status === "COMPLETED" || status === "CANCELLED"}
                    />
                  </label>
                </div>
                <div className="form-group" style={{ marginTop: "30px" }}>
                  <label style={{ fontWeight: "bold" }}>Description:</label>
                  <ReactQuill
                    value={description}
                    onChange={(value) => setDescription(value)}
                    status={status === "COMPLETED" || status === "CANCELLED"}
                  />
                </div>

                <div className="form-group" style={{ marginTop: "40px" }}>
                  <label style={{ fontWeight: "bold" }}>
                    Start Date:{" "}
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      status={status === "COMPLETED" || status === "CANCELLED"}
                    />
                  </label>
                </div>
                <div className="form-group" style={{ marginTop: "20px" }}>
                  <label style={{ fontWeight: "bold" }}>
                    End Date:{" "}
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      status={status === "COMPLETED" || status === "CANCELLED"}
                    />
                  </label>
                </div>
              </form>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="members-selection">
              <div className="responsible-section">
                <label style={{ fontWeight: "bold" }}>Responsible:</label>
                <button
                  type="button"
                  className="action-button"
                  onClick={() => handleMembersClick("responsible")}
                  status={status === "COMPLETED" || status === "CANCELLED"}
                >
                  +
                </button>
                {selectedResponsible && (
                  <div className="selected-user" style={{ margin: "15px" }}>
                    <img
                      src={selectedResponsible.photo || Avatar}
                      alt={selectedResponsible.firstName}
                      className="user-avatar"
                    />
                    <span style={{ marginLeft: "10px" }}>
                      {selectedResponsible.firstName}{" "}
                      {selectedResponsible.lastName}
                    </span>
                    <button
                      type="button"
                      className="remove-button"
                      style={{
                        marginLeft: "10px",
                        border: "none",
                        color: "red",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => setSelectedResponsible(null)}
                      disabled= {status === "COMPLETED" || status === "CANCELLED"}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
              <div className="members-section" style={{ marginTop: "40px" }}>
                <label style={{ fontWeight: "bold" }}>Members:</label>
                <button
                  type="button"
                  className="action-button circle-button"
                  onClick={() => handleMembersClick("member")}
                  disabled= {status === "COMPLETED" || status === "CANCELLED"}
                >
                  +
                </button>
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="selected-user"
                    style={{ margin: "15px" }}
                  >
                    <img
                      src={member.photo || Avatar}
                      alt={member.firstName}
                      className="user-avatar"
                    />
                    <span style={{ marginLeft: "10px" }}>
                      {member.firstName} {member.lastName}
                    </span>
                    <button
                      type="button"
                      className="remove-button"
                      style={{
                        marginLeft: "10px",
                        border: "none",
                        color: "red",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => removeSelectedMember(member.id)}
                      disabled= {status === "COMPLETED" || status === "CANCELLED"}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div className="external-executors" style={{ marginTop: "40px" }}>
                <label style={{ fontWeight: "bold", width: "100%" }}>
                  External Executors:{" "}
                  <input
                    type="text"
                    value={externalExecutors}
                    style={{
                      width: "60%",
                      marginLeft: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    onChange={(e) => setExternalExecutors(e.target.value)}
                    disabled= {status === "COMPLETED" || status === "CANCELLED"}
                  />
                </label>
              </div>
              <div className="form-group" style={{ marginTop: "50px" }}>
                <DropdownButton id="dropdown-basic-button" title="Dependencies">
                  {tasks.map((task) => (
                    <Dropdown.Item
                      key={task.id}
                      onClick={() => handleSelectDependency(task.id)}
                      disabled= {status === "COMPLETED" || status === "CANCELLED"}
                    >
                      {task.title}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <div className="selected-dependencies">
                  {renderDependencyNames()}
                </div>
              </div>
            </div>
          </Col>
          <div style={{ textAlign: "right" }}>
            <button onClick={handleSubmit} type="submit" className="btn btn-primary mt-3">
              {isEditMode ? "Update Task" : "Create Task"}
            </button>
          </div>
        </Row>
      </div>

      <MembersModal
        isOpen={isMembersModalOpen}
        onRequestClose={() => setIsMembersModalOpen(false)}
        members={filteredMembers}
        handleSelectUser={handleSelectUser}
        selectionType={selectionType}
      />
    </Modal>
  );
};

export default CreateTaskModal;
