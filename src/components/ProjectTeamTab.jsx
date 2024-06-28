import React, { useState, useEffect } from 'react';
import Avatar from '../multimedia/Images/Avatar.jpg';
import { inviteUser } from '../services/projectServices';
import './ProjectTeamTab.css';
import UsersModal from './Modals/UsersModal';
import Cookies from 'js-cookie';
import { findAllUsers } from '../services/userServices';


const ProjectTeamTab = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const token = Cookies.get("authToken");
  const [users, setUsers] = useState([]);
  const members =
    project.teamMembers?.filter(
      (member) => member.approvalStatus === "MEMBER"
    ) || [];
  const invited =
    project.teamMembers?.filter(
      (member) => member.approvalStatus === "INVITED"
    ) || [];
  const applied =
    project.teamMembers?.filter(
      (member) => member.approvalStatus === "APPLIED"
    ) || [];

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await findAllUsers(token);
      setUsers(users);
    };
    fetchUsers();
  }, [token]);

  const handleUserAdded = (userToAdd) => {
    console.log(token, project.name, userToAdd.userId);
    inviteUser(token, project.name, userToAdd.userId)
      .then(() => {
        setInvitedUsers([...invitedUsers, userToAdd]);
        handleCloseModal();
        console.log(token, project.name, userToAdd.userId);
      })

      .catch((error) => {
        console.error("Erro ao convidar usuário", error);
      });
  };

  return (
    <div className="card shadow-lg w-100">
      <div className="header-with-invite">
        <h3>Team Members for {project.name}</h3>
        <button className="invite-button" onClick={handleOpenModal}>
          Invite
        </button>
        <UsersModal
          show={showModal}
          handleClose={handleCloseModal}
          inputs={{}}
          setInputs={() => {}}
          users={users}
          onUserAdded={handleUserAdded}
          onAddUser={(userToAdd) => handleUserAdded(userToAdd)}
        />
      </div>
      <p className="card-text-project">
        <strong>Slots available:</strong>{" "}
        {project.maxTeamMembers !== undefined &&
          `${project.maxTeamMembers - members.length}/${
            project.maxTeamMembers
          }`}
      </p>

      <div className="members-container">
        <h4>Members</h4>
        <div className="members-list">
          {members.map((member, index) => (
            <div
              key={`${project.id}-member-${index}`}
              className="simple-user-display"
            >
              <img
                src={member.userPhoto || Avatar}
                alt={`${member.firstName} ${member.lastName}`}
                className="user-image-project"
              />
              <p className="user-name">{`${member.firstName} ${member.lastName}`}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="invited-container">
        <h4>Invited</h4>
        <div className="members-list">
          {invited.map((member, index) => (
            <div
              key={`${project.id}-invited-${index}`}
              className="simple-user-display"
            >
              <img
                src={member.userPhoto || Avatar}
                alt={`${member.firstName} ${member.lastName}`}
                className="user-image-project"
              />
              <p className="user-name">{`${member.firstName} ${member.lastName}`}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="applied-container">
        <h4>Applied</h4>
        <div className="members-list">
          {applied.map((member, index) => (
            <div
              key={`${project.id}-applied-${index}`}
              className="simple-user-display"
            >
              <img
                src={member.userPhoto || Avatar}
                alt={`${member.firstName} ${member.lastName}`}
                className="user-image-project"
              />
              <p className="user-name">{`${member.firstName} ${member.lastName}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectTeamTab;