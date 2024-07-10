import { Button } from 'react-bootstrap'; 
import './UserCard.css'; 
import Avatar from '../../multimedia/Images/Avatar.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import userStore from '../../stores/userStore';
import { FiMail } from 'react-icons/fi'; 
import { AiOutlineUser } from 'react-icons/ai'; 

const UserCard = ({ user }) => {
  const currentUser = userStore((state) => state.user);
  const navigate = useNavigate();
  const { firstName, lastName, userPhoto, privacy, userId } = user;



const setSelectedUserMessages = userStore(state => state.setSelectedUserMessages);
  const handleSendMessage = () => {
    console.log('clicked', userId);
    setSelectedUserMessages(userId);
    navigate(`/messages/${userId}`);
  };

  const isCurrentUserAppManager = currentUser.role < 2;
  console.log(currentUser.role);

  

  return (
    <div className="user-card">
      <div className="userPhotoName">
        <div className="user-image-color">
          </div>
        <img src={userPhoto ? userPhoto : Avatar} alt={`${firstName} ${lastName}`} className="user-image" />
        <h2 className="user-name">{`${firstName} ${lastName}`}</h2>
      </div>
      <div className="user-actions">
        <Button className="btn-icon" onClick={handleSendMessage}>
          <FiMail /> 
        </Button>
        {!privacy && (
          <Link to={`/profile/${userId}`}>
            <Button variant="secondary" className="btn-icon">
              <AiOutlineUser /> 
            </Button>
          </Link>
        )}
             
      </div>
      {isCurrentUserAppManager && (
        <div className = "user-role">
          <button className="promote-button">Promote to App Manager</button>
    </div>
  )}
    </div>
  );
};

export default UserCard;