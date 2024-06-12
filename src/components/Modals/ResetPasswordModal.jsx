import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {resetPassword} from "../../services/userServices";

const ResetPasswordModal = ({ show, handleClose }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await resetPassword(email);
        handleClose();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Please insert your email")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-4">
              <Form.Label>{t("Email address")}</Form.Label>
              <Form.Control
                type="email"
                placeholder={t("Enter email")}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <p className="info-text">
              {t(
                "By clicking submit an email will be sent with a link to reset your password"
              )}
            </p>

            <button type="submit" className="custom-button">
              {t("Submit")}
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    );
};

export default ResetPasswordModal;