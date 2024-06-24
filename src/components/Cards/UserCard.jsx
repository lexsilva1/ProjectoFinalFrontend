import { Button } from 'react-bootstrap'; 
import './UserCard.css'; 
import Avatar from '../../multimedia/Images/Avatar.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import userStore from '../../stores/userStore';
import { FiMail } from 'react-icons/fi'; // Ícone para enviar mensagem
import { AiOutlineUser } from 'react-icons/ai'; // Ícone para ver perfil

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
    <div className="user-card">
      <div className="userPhotoName">
        <div className="user-image-color">
          </div>
        <img src={userPhoto ? userPhoto : Avatar} alt={`${firstName} ${lastName}`} className="user-image" />
        <h2 className="user-name">{`${firstName} ${lastName}`}</h2>
      </div>
      <div className="user-actions">
        <Button className="btn-icon" onClick={handleSendMessage}>
          <FiMail /> {/* Ícone de enviar mensagem */}
        </Button>
        {!privacy && (
          <Link to={`/profile/${userId}`}>
            <Button variant="secondary" className="btn-icon">
              <AiOutlineUser /> {/* Ícone de ver perfil */}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserCard;