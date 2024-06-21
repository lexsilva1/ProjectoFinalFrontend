import { Button } from 'react-bootstrap'; 
import './UserCard.css'; 
import Avatar from '../../multimedia/Images/Avatar.jpg';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  const { firstName, lastName, userPhoto, privacy } = user;


  return (
    <div className="user-card" style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <img src={userPhoto ? userPhoto : Avatar} alt={`${firstName} ${lastName}`} className="user-image" />
        <h2 className="user-name">{`${firstName} ${lastName}`}</h2>
      </div>
      <div className="user-actions">
        <Button className="btn-primary">Send Message</Button>
        {!privacy && 
          <Link to={`/profile/${user.userId}`}>
            <Button variant="secondary">View Profile</Button>
          </Link>
        }
      </div>
    </div>
  );
};

export default UserCard;