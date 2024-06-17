import React from 'react';
import UserCard from "../components/Cards/UserCard";

const ProjectTeamTab = ({ project }) => {
  // Separar os membros da equipe por status de aprovação
  const members = project.teamMembers?.filter((member) => member.approvalStatus === 'MEMBER') || [];
  const invited = project.teamMembers?.filter((member) => member.approvalStatus === 'INVITED') || [];
  const applied = project.teamMembers?.filter((member) => member.approvalStatus === 'APPLIED') || [];

  return (
    <div className="card shadow-lg w-100">
      <h2>Team Members for {project.name}</h2>
      <p className="card-text-project">
        <strong>Slots available:</strong>{" "}
        {project.maxTeamMembers !== undefined &&
          `${project.maxTeamMembers - members.length}/${project.maxTeamMembers}`}
      </p>

      <h3>Members</h3>
      {members.map((member, index) => (
        <UserCard key={`${project.id}-member-${index}`} user={member} />
      ))}

      <h3>Invited</h3>
      {invited.map((member, index) => (
        <UserCard key={`${project.id}-invited-${index}`} user={member} />
      ))}

      <h3>Applied</h3>
      {applied.map((member, index) => (
        <UserCard key={`${project.id}-applied-${index}`} user={member} />
      ))}
    </div>
  );
};

export default ProjectTeamTab;