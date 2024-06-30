import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProjectByName, createTask, updateTask } from "../../services/projectServices";
import Cookies from "js-cookie";
import MembersModal from "./MembersModal";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import "./CreateTaskModal.css";
import { set, format } from "date-fns";

const CreateTaskModal = ({
  closeModal,
  addTask,
  projectName,
  tasks,
  selectedTask,
  isEditMode,
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
  const [status, setStatus] = useState(selectedTask ? selectedTask.status : "NOT_STARTED");

  const fetchProjectDetails = async () => {
    try {
      const projectDetails = await getProjectByName(token, projectName);
      const members = projectDetails.teamMembers.filter(
        (member) => member.approvalStatus === "MEMBER"
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  const renderStatusDropdown = () => (
    <DropdownButton id="status-dropdown" title="Status">
      <Dropdown.Item onClick={() => setStatus("NOT_STARTED")}>Not Started</Dropdown.Item>
      <Dropdown.Item onClick={() => setStatus("IN_PROGRESS")}>In Progress</Dropdown.Item>
      <Dropdown.Item onClick={() => setStatus("COMPLETED")}>Completed</Dropdown.Item>
      <Dropdown.Item onClick={() => setStatus("CANCELLED")}>Cancelled</Dropdown.Item>
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
        <div className="modal-info">
          <form onSubmit={handleSubmit}>
          <div className="form-group">
      {renderStatusDropdown()}
    </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
            <button type="submit" className="submit-button">
              {isEditMode ? "Update Task" : "Create Task"}
            </button>
          </form>
        </div>
        <div
          className="members-selection"
          style={{ marginRight: "220px", marginTop: "12px" }}
        >
          <div className="responsible-section">
            <label>Responsible</label>
            <button
              type="button"
              className="action-button"
              onClick={() => handleMembersClick("responsible")}
            >
              Responsible
            </button>
            {selectedResponsible && (
              <div className="selected-user">
                <img
                  src={selectedResponsible.photo || Avatar}
                  alt={selectedResponsible.firstName}
                  className="user-avatar"
                />
                <span>
                  {selectedResponsible.firstName} {selectedResponsible.lastName}
                </span>
              </div>
            )}
          </div>
          <div className="members-section" style={{ marginTop: "40px" }}>
            <label>Members</label>
            <button
              type="button"
              className="action-button"
              onClick={() => handleMembersClick("member")}
            >
              Members
            </button>
            {selectedMembers.map((member) => (
              <div key={member.id} className="selected-user">
                <img
                  src={member.photo || Avatar}
                  alt={member.firstName}
                  className="user-avatar"
                />
                <span>
                  {member.firstName} {member.lastName}
                </span>
              </div>
            ))}
          </div>
          <div className="external-executors">
            <label>External Executors</label>
            <input
              type="text"
              value={externalExecutors}
              onChange={(e) => setExternalExecutors(e.target.value)}
            />
          </div>
          <div className="form-group">
            <DropdownButton id="dropdown-basic-button" title="Dependencies">
              {tasks.map((task) => (
                <Dropdown.Item
                  key={task.id}
                  onClick={() => handleSelectDependency(task.id)}
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
