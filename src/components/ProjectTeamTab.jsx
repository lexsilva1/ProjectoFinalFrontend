import React, { useState, useEffect } from 'react';
import Avatar from '../multimedia/Images/Avatar.jpg';
import { inviteUser, promoteUser, demoteUser, manageInvitesApplications, rejectInvitesApplications, removeProjectUser, leaveProject } from '../services/projectServices';
import './ProjectTeamTab.css';
import UsersModal from './Modals/UsersModal';
import userStore from '../stores/userStore';
import Cookies from 'js-cookie';
import { findAllUsers } from '../services/userServices';
import { Row, Col, Card, Button, Form, Image } from 'react-bootstrap';


const ProjectTeamTab = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const token = Cookies.get("authToken");
  const [users, setUsers] = useState([]);
  const currentUser = userStore((state) => state.user);
  const [localTeamMembers, setLocalTeamMembers] = useState(project.teamMembers);

  const isCurrentUserProjectManager = localTeamMembers?.find(
    (member) => member.userId === currentUser.id
  )?.isProjectManager;

  const members =
    localTeamMembers?.filter(
      (member) =>
        member.approvalStatus === "MEMBER" ||
        member.approvalStatus === "CREATOR"
    ) || [];
  const invited =
    localTeamMembers?.filter(
      (member) => member.approvalStatus === "INVITED"
    ) || [];
  const applied =
    localTeamMembers?.filter(
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
    const initialInvitedUsers = localTeamMembers.filter(member => member.approvalStatus === "INVITED");
    setInvitedUsers(initialInvitedUsers);
  }, [localTeamMembers]);
  
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

  const handleRemoveUser = (userId) => {
    removeProjectUser(token, project.name, userId)
      .then(() => {
        // Filter out the removed user from localTeamMembers
        const updatedTeamMembers = localTeamMembers.filter(member => member.userId !== userId);
        setLocalTeamMembers(updatedTeamMembers);
  
        console.log(`User ${userId} removed from project ${project.name}.`);
        console.log("Updated localTeamMembers:", updatedTeamMembers); // Adicionar este log
      })
      .catch((error) => {
        console.error("Error removing user from project", error);
      });
  };
  
  const handleAcceptApplication = async (member) => {
    try {
      await manageInvitesApplications(
        
        token,
        project.name,
        member.userId,
        "ACCEPT_APPLICATION"
      );
      console.log(`Application from user ${member.userId} accepted.`);
  
      // Atualize o estado para mover o usuário aceito da lista de candidatos para a lista de membros
      setLocalTeamMembers((prevMembers) =>
        prevMembers.map((m) =>
          m.userId === member.userId ? { ...m, approvalStatus: "MEMBER" } : m
        )
      );
    } catch (error) {
      console.error("Error accepting user application", error);
    }
  };

  const handleLeaveProject = async () => {
    try {
      await leaveProject(token, project.name);
      console.log(`Left project ${project.name} successfully.`);
      // Aqui você pode adicionar lógica adicional, como redirecionar o usuário ou atualizar o estado da UI
    } catch (error) {
      console.error("Error leaving project", error);
    }
  };

  return (
    <Card className="shadow-lg w-100" >
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="card-title">Team Members For {project.name}</h4>
        <Button onClick={handleOpenModal} style={{ display: isCurrentUserProjectManager ? 'block' : 'none' }}>Add Team Member</Button>
        <UsersModal
          show={showModal}
          handleClose={handleCloseModal}
          inputs={{}}
          setInputs={() => {}}
          users={users.filter(user => !excludedUserIds.includes(user.userId))} 
          onUserAdded={handleUserAdded}
          onAddUser={(userToAdd) => handleUserAdded(userToAdd)}
        />
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4} style={{ borderRight: "1px solid lightgray" }}>
            <h5>Members</h5>
            <div className="members-list">
              {members.length > 0 ? (
                members.map((member, index) => (
                  <div key={`${project.id}-member-${index}`} className="simple-user-display">
                    <Image src={member.userPhoto || Avatar} roundedCircle className="user-image-project" />
                    <p className="user-name-project">{`${member.firstName} ${member.lastName}`}</p>
                    {isCurrentUserProjectManager && currentUser.id !== member.userId ? (
                      <Form.Select
                        className="role-dropdown"
                        value={member.isProjectManager ? "Project Manager" : "Collaborator"}
                        onChange={(e) => handleRoleChange(e, member.userId)}
                      >
                        <option value="Collaborator">Collaborator</option>
                        <option value="Project Manager">Project Manager</option>
                      </Form.Select>
                    ) : (
                      <p className="role-label">{member.isProjectManager ? "Project Manager" : "Collaborator"}</p>
                    )}
                    {isCurrentUserProjectManager && currentUser.id !== member.userId && (
                      <div className="remove-user-cross" onClick={() => handleRemoveUser(member.userId)}>
                        <Button variant="link" size="sm">x</Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No members available.</p>
              )}
            </div>
          </Col>

          <Col md={4}style={{ borderRight: "1px solid lightgray" }}>
            <h5>Invited</h5>
            <div className="members-list">
              {invited.length > 0 ? (
                invited.map((member, index) => (
                  <div key={`${project.id}-invited-${index}`} className="simple-user-display">
                    <Image src={member.userPhoto || Avatar} roundedCircle className="user-image-project" />
                    <p className="user-name">{`${member.firstName} ${member.lastName}`}</p>
                  </div>
                ))
              ) : (
                <p>No invited users available.</p>
              )}
            </div>
          </Col>

          <Col md={4} >
            <h5>Applied</h5>
            <div className="members-list">
              {applied.length > 0 ? (
                applied.map((member, index) => (
                  <div key={`${project.id}-applied-${index}`} className="simple-user-display">
                    <Image src={member.userPhoto || Avatar} roundedCircle className="user-image-project" />
                    <p className="user-name">{`${member.firstName} ${member.lastName}`}</p>
                    {isCurrentUserProjectManager && (
                      <div className="application-actions">
                        <Button size="sm" className="accept-button" onClick={() => handleAcceptApplication(member)}>Accept</Button>
                        <Button size="sm" className="decline-button" onClick={() =>
                          rejectInvitesApplications(
                            token,
                            project.name,
                            member.userId,
                            "REJECT",
                            member.notificationId
                          )
                        }>Decline</Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No applied users available.</p>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <p className="card-text-project">
          <strong>Slots available:</strong> 
          {project.maxTeamMembers !== undefined && 
            `${project.maxTeamMembers - members.length}/${project.maxTeamMembers}`}
        </p>
        <button onClick={handleLeaveProject}>Leave Project</button>
      </Card.Footer>
    </Card>
  );
};

export default ProjectTeamTab;