import React, { useState, useEffect } from 'react';
import Avatar from '../multimedia/Images/Avatar.jpg';
import { inviteUser, promoteUser, demoteUser, manageInvitesApplications, rejectInvitesApplications } from '../services/projectServices';
import './ProjectTeamTab.css';
import UsersModal from './Modals/UsersModal';
import userStore from '../stores/userStore';
import Cookies from 'js-cookie';
import { findAllUsers } from '../services/userServices';


const ProjectTeamTab = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const token = Cookies.get("authToken");
  const [users, setUsers] = useState([]);
  const currentUser = userStore((state) => state.user);
  const [localTeamMembers, setLocalTeamMembers] = useState(project.teamMembers);
  
  const isCurrentUserProjectManager = project.teamMembers?.find(
    (member) => member.userId === currentUser.id
  )?.isProjectManager;


  
  const members =
    project.teamMembers?.filter(
      (member) =>
        member.approvalStatus === "MEMBER" ||
        member.approvalStatus === "CREATOR"
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

  useEffect(() => {
    // Assuming project.teamMembers is up-to-date and includes users with all statuses
    const initialInvitedUsers = project.teamMembers.filter(member => member.approvalStatus === "INVITED");
    setInvitedUsers(initialInvitedUsers);
  }, [project.teamMembers]);
  
  const handleUserAdded = (userToAdd) => {
    console.log(token, project.name, userToAdd.userId);
    inviteUser(token, project.name, userToAdd.userId)
      .then(() => {
        const newUserInvited = {
          ...userToAdd,
          approvalStatus: "INVITED",
        };
    
        setLocalTeamMembers(prevMembers => [...prevMembers, newUserInvited]);
        setInvitedUsers(prevInvited => [...prevInvited, newUserInvited]);
    
        const updatedUsers = users.filter(user => user.userId !== userToAdd.userId);
        setUsers(updatedUsers);
    
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Erro ao convidar usuário", error);
      });
  };

  const handleRoleChange = async (event, userId) => {
    const newRole = event.target.value;
    console.log(`Atualizando o papel do usuário ${userId} para ${newRole}`);

    try {
      if (newRole === "Project Manager") {
        await promoteUser(token, project.name, userId);
        console.log(`Usuário ${userId} promovido a Project Manager.`);
      } else if (newRole === "Collaborator") {
        await demoteUser(token, project.name, userId);
        console.log(`Usuário ${userId} rebaixado para Collaborator.`);
      }
    } catch (error) {
      console.error("Erro ao atualizar o papel do usuário", error);
    }
  };
  const excludedUserIds = [
    ...members.map(member => member.userId),
    ...invited.map(invite => invite.userId),
    ...applied.map(application => application.userId),
  ];
  


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
  users={users.filter(user => !excludedUserIds.includes(user.userId))} 
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
              <p className="user-name-project">{`${member.firstName} ${member.lastName}`}</p>
              {/* Dropdown para mostrar e alterar o papel */}
              <select
                className="role-dropdown"
                value={
                  member.isProjectManager ? "Project Manager" : "Collaborator"
                }
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
    {invitedUsers.map((member, index) => (
      <div key={`${project.id}-invited-${index}`} className="simple-user-display">
        <img src={member.userPhoto || Avatar} alt={`${member.firstName} ${member.lastName}`} className="user-image-project" />
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
        {/* Conditionally render Accept and Decline buttons */}
        {isCurrentUserProjectManager && (
          <div className="application-actions">
            <button
              className="accept-button"
              onClick={() =>
                manageInvitesApplications(
                  token,
                  project.name,
                  member.userId,
                  "ACCEPT_APPLICATION",
                )
              }
            >
              Accept
            </button>
            <button
              className="decline-button"
              onClick={() =>
                rejectInvitesApplications(
                  token,
                  project.name,
                  member.userId,
                  "REJECT",
                  member.notificationId
                )
              }
            >
              Decline
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default ProjectTeamTab;