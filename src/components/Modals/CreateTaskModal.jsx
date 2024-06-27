import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProjectByName } from "../../services/projectServices";
import Cookies from "js-cookie";
import MembersModal from "./MembersModal";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import "./CreateTaskModal.css";

const CreateTaskModal = ({ closeModal, addTask, projectName }) => {
  const [projectMembers, setProjectMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [externalExecutors, setExternalExecutors] = useState("");
  const [description, setDescription] = useState("");
  const [responsibleId, setResponsibleId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [dependencies, setDependencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const token = Cookies.get("authToken");
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedResponsible, setSelectedResponsible] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

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
    const filtered = projectMembers.filter(member =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm, projectMembers]);

  const handleMembersClick = () => {
    setIsMembersModalOpen(!isMembersModalOpen);
  };

  const handleSelectUser = (user, type) => {
    if (type === 'responsible') {
      setSelectedResponsible(user);
    } else if (type === 'member') {
      setSelectedMembers([...selectedMembers, user]);
    }
    setIsMembersModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      title,
      externalExecutors,
      description,
      responsibleId,
      startDate,
      endDate,
      creationDate,
      dependencies,
      users,
    };
    addTask(newTask);
    closeModal();
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      contentLabel="Create Task"
      ariaHideApp={false}
    >
      <div className="modal-create-task-header">
        <h2>Create Task</h2>
        <button onClick={closeModal} className="close-button">
          &times;
        </button>
      </div>
      <div className="modal-content-container"> 
        <div className="modal-info"> 
          <form onSubmit={handleSubmit}>
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
              Create Task
            </button>
          </form>
        </div>
        <div style={{marginRight: "200px", marginTop: "20px"}}>
          {selectedResponsible && (
            <div>
              <label>Responsible:</label>
              <img src={selectedResponsible.photo || Avatar} alt={selectedResponsible.firstName} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
              <span>{selectedResponsible.firstName} {selectedResponsible.lastName}</span>
            </div>
          )}
          <label>Members:</label>
          {selectedMembers.map(member => (
            <div key={member.id}>
              <img src={member.photo || Avatar} alt={member.firstName} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
              <span>{member.firstName} {member.lastName}</span>
            </div>
          ))}
        </div>
        <div className="task-actions" > 
          <button 
            type="button" 
            className="action-button"
            onClick={() => handleMembersClick('responsible')}
          >
            Responsible
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => handleMembersClick('member')}
          >
            Members
          </button>
          <button type="button" className="action-button">
            Dependencies
          </button>
        </div>
      </div>
      <MembersModal
        isOpen={isMembersModalOpen}
        onRequestClose={() => setIsMembersModalOpen(false)}
        members={filteredMembers}
        handleSelectUser={handleSelectUser} 
      />
    </Modal>
  );
};

export default CreateTaskModal;
