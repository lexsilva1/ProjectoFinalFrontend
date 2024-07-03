import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddAnnotationModal = ({ show, handleClose, handleSave }) => {
  const [annotation, setAnnotation] = useState('');

  const onSave = () => {
    handleSave(annotation);
    setAnnotation(''); 
    handleClose(); 
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Annotation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Annotation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAnnotationModal;