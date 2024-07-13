import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, message, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
