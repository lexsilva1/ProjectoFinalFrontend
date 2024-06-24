import { Button } from 'react-bootstrap'; 
import './UserCard.css'; 
import Avatar from '../../multimedia/Images/Avatar.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import userStore from '../../stores/userStore';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const { firstName, lastName, userPhoto, privacy, userId } = user;
const setSelectedUserMessages = userStore(state => state.setSelectedUserMessages);
  const handleSendMessage = () => {
    console.log('clicked', userId);
    setSelectedUserMessages(userId);
    navigate(`/messages/${userId}`);
  };


  return (
    <div className="user-card" style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <img src={userPhoto ? userPhoto : Avatar} alt={`${firstName} ${lastName}`} className="user-image" />
        <h2 className="user-name">{`${firstName} ${lastName}`}</h2>
      </div>
      <div className="user-actions">
      <Button className="btn-primary" onClick={handleSendMessage}>Send Message</Button>
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