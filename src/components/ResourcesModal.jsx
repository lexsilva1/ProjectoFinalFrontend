import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, FormControl } from 'react-bootstrap';
import { getResources } from '../services/resourcesServices';
import Cookies from 'js-cookie';

const ResourcesModal = ({ show, handleClose, handleSelect }) => {
  const [resources, setResources] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
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

  const handleQuantityChange = (resource, quantity) => {
    setQuantities({ ...quantities, [resource.name]: quantity });

    const updatedMaterials = selectedMaterials.map((material) =>
      material.id === resource.id ? { ...material, quantity } : material
    );
    setSelectedMaterials(updatedMaterials);
  };

  const handleAddResource = (resource) => {
    const quantity = quantities[resource.name] || 1;
    const updatedMaterials = [
      ...selectedMaterials,
      { ...resource, quantity },
    ];
    setSelectedMaterials(updatedMaterials);

    handleSelect(updatedMaterials); // Enviar materiais selecionados ao componente pai
    handleClose(); // Fechar o modal após adicionar um material
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Resources</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {resources.map((resource, index) => (
          <Row key={index} className="align-items-center">
            <Col>
              <p>{resource.name}</p>
            </Col>
            <Col>
              <FormControl
                type="number"
                min="1"
                value={quantities[resource.name] || 1}
                onChange={(e) => handleQuantityChange(resource, e.target.value)}
              />
            </Col>
            <Col>
              <Button onClick={() => handleAddResource(resource)}>Add</Button>
            </Col>
          </Row>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default ResourcesModal;
