import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, FormControl } from 'react-bootstrap';
import { getResources } from '../services/resourcesServices';
import Cookies from 'js-cookie';

const ResourcesModal = ({show, handleClose }) => {
  const [resources, setResources] = useState([]);
  const [quantities, setQuantities] = useState({});
  const token = Cookies.get('authToken');
  const [name,setName] = useState(null);
  const [type,setType] = useState(null);
  const [identifier , setIdentifier] = useState(null);
  const [supplier, setSupplier] = useState(null);



  useEffect(() => {
    const fetchResources = async () => {
      try {
        const params = {};
        if (name) params.resourceName = name;
        if (type) params.resourceType = type;
        if (identifier) params.resourceIdentifier = identifier;
        if (supplier) params.supplier = supplier;
  
        const resources = await getResources(token, params);
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

  const handleAddResource = (resourceName) => {
    console.log(`Added ${quantities[resourceName]} of ${resourceName}`);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Resources</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {resources.map((resource, index) => (
  <Row key={index}>
    <Col>
      <p>{resource.name}</p>
    </Col>
    <Col>
      <FormControl
        type="number"
        min="0"
        onChange={(e) => handleQuantityChange(resource.name, e.target.value)}
      />
    </Col>
    <Col>
      <Button onClick={() => handleAddResource(resource)}>Add</Button>
    </Col>
  </Row>
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