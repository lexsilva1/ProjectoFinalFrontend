import { Button } from 'react-bootstrap'; 
import './UserCard.css'; 
import Avatar from '../../multimedia/Images/Avatar.jpg';

const UserCard = ({ user }) => {
  const { firstName, lastName, userPhoto, privacy } = user;

  console.log(user);

  return (
    <div className="user-card" style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <img src={userPhoto ? userPhoto : Avatar} alt={`${firstName} ${lastName}`} className="user-image" />
        <h2 className="user-name">{`${firstName} ${lastName}`}</h2>
      </div>
      <div className="user-actions">
        <Button variant="primary">Send Message</Button>
        {!privacy && <Button variant="secondary">View Profile</Button>}
      </div>
    </div>
  );
};

export default UserCard;