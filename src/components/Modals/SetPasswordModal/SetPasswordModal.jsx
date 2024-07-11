import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { confirmPasswordReset } from "../../../services/userServices";
import { useLocation } from "react-router-dom";

const SetPasswordModal = ({ show, handleClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const token = location.pathname.split("/")[2];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
    } else {
      setError("");
      try {
        const passwordDto = { password, newPassword: confirmPassword };
        await confirmPasswordReset(token, passwordDto);
        console.log("Password changed successfully!");
        handleClose();
      } catch (error) {
        console.log(error);
        setError("Failed to reset password");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Please enter your new password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button variant="primary" type="submit">
            Confirm
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SetPasswordModal;
