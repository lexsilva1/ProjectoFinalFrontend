import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import userStore from "../../../stores/userStore";
import "../RegisterModal/RegisterModal.css";
import { useTranslation } from "react-i18next";
import { login } from "../../../services/userServices";
import { getLastMessages } from "../../../services/messageServices";
import ResetPasswordModal from "../../Modals/ResetPasswordModal/ResetPasswordModal";
import { getNotifications } from "../../../services/notificationService";
import Cookies from 'js-cookie';
import { set } from "date-fns";


const LoginModal = ({ handleOpenResetPasswordModal }) => {
  const { t } = useTranslation();
  const showLogin = userStore((state) => state.showLogin);
  const setShow = userStore((state) => state.setShowLogin);
  const handleClose = () => {
    setShow(false);
    setLoginError(false);
  };
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const notifications = userStore((state) => state.notifications);
  const setNotifications = userStore((state) => state.setNotifications);
  const setUnreadMessages = userStore((state) => state.setUnreadMessages); 
  const userList = userStore((state) => state.userList);
  const setUserList = userStore((state) => state.setUserList);

  const handleSubmit = async (e) => {
    console.log('handleSubmit');
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const loginSuccessful = await login(email, password);
    if (loginSuccessful) {

      console.log('loginSuccessful');
      
      const userNotifications = await getNotifications(Cookies.get("authToken"));
      if(userNotifications) {
        setNotifications(userNotifications);
      }
      
      const messages = await getLastMessages(Cookies.get("authToken"));
      if(messages) {
        setUserList(messages);
        // Calculate unreadCount using the freshly fetched messages
        const unreadCount = messages.filter(user => !user.read).length;
        setUnreadMessages(unreadCount);
        console.log('unreadCount', unreadCount);
        console.log('userList', messages); // Log the fresh messages
      }
      
      handleClose();

      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  return (
    <>
      <Modal
        show={showLogin}
        onHide={handleClose}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <div className="w-100 d-flex justify-content-center">
            <Modal.Title className="modal-title" style={{color: "var(--dark-color"}}>
              {t("Get started by logging in to your account")}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-4">
              <Form.Label>{t("Email address")}</Form.Label>
              <Form.Control type="email" placeholder={t("Enter email")} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Label>{t("Password")}</Form.Label>
              <Form.Control type="password" placeholder={t("Password")} />
              {loginError && (
                <p className="text-danger">
                  {t("Invalid login credentials. Please try again.")}
                </p>
              )}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                  handleOpenResetPasswordModal();
                }}
                className="text-info"
              >
                Forgot your password?
              </a>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <button type="submit" className="custom-button">
                {t("Login")}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ResetPasswordModal
        show={showResetPasswordModal}
        onHide={() => setShowResetPasswordModal(false)}
      />
    </>
  );
};

export default LoginModal;
