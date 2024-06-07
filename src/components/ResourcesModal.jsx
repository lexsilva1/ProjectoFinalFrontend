import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getResources } from '../services/resourcesServices';
import Cookies from 'js-cookie';

const ResourcesModal = ({show, handleClose }) => {
  const [resources, setResources] = useState([]);
  const [quantities, setQuantities] = useState({});
  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resources = await getResources(token);
        setResources(resources);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResources();
  }, [token]);

  const handleQuantityChange = (resourceName, quantity) => {
    setQuantities({ ...quantities, [resourceName]: quantity });
  };

  const handleAdd = (resourceName) => {
    console.log(`Added ${quantities[resourceName]} of ${resourceName}`);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Resources</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {resources.map((resource) => (
          <Form key={resource.name}>
            <Form.Label>{resource.name}</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => handleQuantityChange(resource.name, e.target.value)}
            />
            <Button onClick={() => handleAdd(resource.name)}>Add</Button>
          </Form>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResourcesModal;