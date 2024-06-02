import React from 'react';
import { Button } from 'react-bootstrap'; 
import './UserCard.css'; 

const UserCard = ({ user }) => {
  const { firstName, lastName, userPhoto } = user;

  return (
    <div className="user-card" style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <img src={userPhoto} alt={`${firstName} ${lastName}`} className="user-image" />
        <h2 className="user-name">{`${firstName} ${lastName}`}</h2>
      </div>
      <div className="user-actions">
        <Button variant="primary">Send Message</Button>
        <Button variant="secondary">View Profile</Button>
      </div>
    </div>
  );
};

export default UserCard;