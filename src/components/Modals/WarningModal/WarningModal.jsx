import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const WarningModal = ({ isOpen, message, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={onCancel} centered>
      <Modal.Header style={{backgroundColor: "var(--details-color)"}} closeButton>
        <Modal.Title  >Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body   style={{textAlign: "center", padding: "20px", fontSize: "20px"}}>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModal;