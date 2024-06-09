import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import userStore from "../../stores/userStore";
import "./RegisterModal.css";
import { useTranslation } from "react-i18next";
import { registerUser } from "../../services/userServices";

const RegisterModal = () => {
  const { t } = useTranslation(); // Use useTranslation hook to get t function
  const showRegister = userStore((state) => state.showRegister);
  const setShow = userStore((state) => state.setShowRegister);
  const handleClose = () => setShow(false);

  const [email, setEmail] = useState(""); // Add this line
  const [password, setPassword] = useState(""); // Add this line

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(email, password); // Update this line
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      show={showRegister}
      onHide={handleClose}
      centered
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <div className="w-100 d-flex justify-content-center">
          <Modal.Title>{t("Create an account")}</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-4">
            <Form.Label>{t("Email address")}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t("Enter email")}
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
            {/* Update this line */}
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-4">
            <Form.Label>{t("Password")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("Password")}
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            {/* Update this line */}
          </Form.Group>

          <Form.Group controlId="formBasicConfirmPassword" className="mb-4">
            <Form.Label>{t("Confirm Password")}</Form.Label>
            <Form.Control type="password" placeholder={t("Confirm Password")} />
          </Form.Group>

          <p className="info-text">
            {t(
              "By clicking continue, you will need to check your email to confirm your account."
            )}
          </p>

          <button type="submit" className="custom-button">
            {t("Register")}
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
