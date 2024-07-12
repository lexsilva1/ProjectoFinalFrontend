import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./UserCard.css";
import Avatar from "../../../multimedia/Images/Avatar.jpg";
import { Link, useNavigate } from "react-router-dom"; 
import userStore from "../../../stores/userStore";
import { FiMail } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { setAdminStatus } from "../../../services/userServices";
import Cookies from "js-cookie";
import WarningModal from "../../Modals/WarningModal/WarningModal";

const UserCard = ({ user }) => {
  const currentUser = userStore((state) => state.user);
  const navigate = useNavigate();
  const { firstName, lastName, userPhoto, privacy, userId, role } = user;
  const token = Cookies.get("authToken");
  const [isManager, setIsManager] = useState(user.role === "Manager");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [actionType, setActionType] = useState(""); // "promote" or "demote"

  const setSelectedUserMessages = userStore(
    (state) => state.setSelectedUserMessages
  );
  const handleSendMessage = () => {
    console.log("clicked", userId);
    setSelectedUserMessages(userId);
    navigate(`/messages/${userId}`);
  };

  const isCurrentUserAppManager = currentUser.role < 2;
  const canPromote = isCurrentUserAppManager && !isManager;
  const canDemote = currentUser.role === 0 && isManager;

  const handleAction = async () => {
    try {
      await setAdminStatus(token, userId);
      setIsManager(actionType === "promote");
      setShowModal(false); // Close the modal after action
    } catch (error) {
      console.error(`Error ${actionType === "promote" ? "promoting" : "demoting"} user:`, error);
    }
  };

  const handlePromoteUser = () => {
    setModalMessage("Are you sure you want to promote this user to Application Manager?");
    setShowModal(true);
    setActionType("promote");
  };

  const handleDemoteUser = () => {
    setModalMessage("Are you sure you want to demote this user from Application Manager?");
    setShowModal(true);
    setActionType("demote");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="user-card">
      <div className="userPhotoName">
        <div className="user-image-color"></div>
        <img
          src={userPhoto ? userPhoto : Avatar}
          alt={`${firstName} ${lastName}`}
          className="user-image"
        />
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
      {canPromote && (
        <button className="promote-button" onClick={handlePromoteUser}>
          Promote to App Manager
        </button>
      )}
      {canDemote && (
        <button className="demote-button" onClick={handleDemoteUser}>
          Demote from App Manager
        </button>
      )}
            <WarningModal
        isOpen={showModal}
        message={modalMessage}
        onCancel={handleCancel}
        onConfirm={handleAction}
      />
    </div>
  );
};

export default UserCard;
