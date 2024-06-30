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

  const handleRoleChange = (event, userId) => {
    const newRole = event.target.value;
    // Lógica para atualizar o papel do usuário no backend
    // Isso pode envolver chamar uma API e passar o userId e o novo papel
    console.log(`Atualizando o papel do usuário ${userId} para ${newRole}`);
    // Atualize o estado local ou faça uma nova busca de usuários após a atualização, se necessário
  };

  return (
    <div className="card shadow-lg w-100">
      <div className="header-with-invite">
      <div className="card-header">
  <h4 className="card-title">Team Members For {project.name}</h4>
</div>
        <button className="invite-button" onClick={handleOpenModal}>
          Add Team Member
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
      <div className="card-slots-avaliable">
      <p className="card-text-project">
        <strong>Slots available:</strong>{" "}
        {project.maxTeamMembers !== undefined &&
          `${project.maxTeamMembers - members.length}/${
            project.maxTeamMembers
          }`}
      </p>
      </div>

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
      {/* Dropdown para mostrar e alterar o papel */}
      <select 
        className="role-dropdown" 
        value={member.isProjectManager ? "Project Manager" : "Collaborator"}
        onChange={(e) => handleRoleChange(e, member.userId)}
      >
        <option value="Collaborator">Collaborator</option>
        <option value="Project Manager">Project Manager</option>
      </select>
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