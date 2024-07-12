import React, { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";

/* User  Card component 
The cards that are display in the users page. Shows the users foto and name, the message button (that
navigates to the messages page), the profile button (if user profile is public) and a button to promote
and demote a user to application manager (for that we verify if the user logged in is a application manager
to be able to promote and if the user logged in is admin to be able to demote) */

const UserCard = ({ user }) => {
  const currentUser = userStore((state) => state.user);
  const navigate = useNavigate();
  const { firstName, lastName, userPhoto, privacy, userId, role } = user;
  const token = Cookies.get("authToken");
  const [isManager, setIsManager] = useState(user.role === "Manager");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [actionType, setActionType] = useState(""); // "promote" or "demote"
  const { t } = useTranslation();

  // Function to navigate to the messages page if the user clicks the message button
  const setSelectedUserMessages = userStore(
    (state) => state.setSelectedUserMessages
  );
  const handleSendMessage = () => {
    console.log("clicked", userId);
    setSelectedUserMessages(userId);
    navigate(`/messages/${userId}`);
  };

  // Function to verify if the user logged in is a application manager to be able to promote or if he is the admin to be able to demote
  const isCurrentUserAppManager = currentUser.role < 2;
  const canPromote = isCurrentUserAppManager && !isManager;
  const canDemote = currentUser.role === 0 && isManager;

  // Function to promote or demote a user to application manager
  const handleAction = async () => {
    try {
      await setAdminStatus(token, userId);
      setIsManager(actionType === "promote");
      setShowModal(false); 
    } catch (error) {
      console.error(
        `Error ${actionType === "promote" ? "promoting" : "demoting"} user:`,
        error
      );
    }
  };

  // Function to set the message in the modal to promote or demote a user
  const handlePromoteUser = () => {
    setModalMessage(
      "Are you sure you want to promote this user to Application Manager?"
    );
    setShowModal(true);
    setActionType("promote");
  };

  const handleDemoteUser = () => {
    setModalMessage(
      "Are you sure you want to demote this user from Application Manager?"
    );
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
          {t("Promote to App Manager")}
        </button>
      )}
      {canDemote && (
        <button className="demote-button" onClick={handleDemoteUser}>
          {t("Demote from App Manager")}
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
