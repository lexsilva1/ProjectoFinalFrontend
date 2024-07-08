import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import userStore from "../../stores/userStore";
import "./RegisterModal.css";
import { useTranslation } from "react-i18next";
import { registerUser } from "../../services/userServices";

const RegisterModal = () => {
  const { t } = useTranslation();
  const showRegister = userStore((state) => state.showRegister);
  const setShow = userStore((state) => state.setShowRegister);
  const handleClose = () => setShow(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirm password are the same
    if (password !== confirmPassword) {
      setErrorMessage(t("Password and confirm password do not match."));
      return;
    }

    try {
      const data = await registerUser(email, password);
      setErrorMessage("");
      handleClose();
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        setErrorMessage(
          t(
            "Registration failed. Please ensure your password is at least 8 characters long, contains a lowercase and uppercase letter, a number, and a special character."
          )
        );
      } else if (error.status === 404) {
        setErrorMessage(
          t(
            "The email you entered is already in use. Please use a different email."
          )
        );
      } else {
        setErrorMessage(t("An unexpected error occurred. Please try again."));
      }
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
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-4">
            <Form.Label>{t("Password")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("Password")}
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
          </Form.Group>

          <Form.Group controlId="formBasicConfirmPassword" className="mb-4">
            <Form.Label>{t("Confirm Password")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("Confirm Password")}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <p className="info-text">
            {t(
              "By clicking continue, you will need to check your email to confirm your account."
            )}
          </p>
<div className="d-flex justify-content-center">
          <button type="submit" className="custom-button">
            {t("Register")}
          </button>
</div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
