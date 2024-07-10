import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, FormControl } from 'react-bootstrap';
import { addResourceToProject } from '../../services/projectServices';
import { getResources } from '../../services/resourcesServices';
import CreateResourceModal from '../Modals/CreateResourceModal/CreateResourceModal';
import './ResourcesModal.css';
import Cookies from 'js-cookie';

const ResourcesModal = ({ show, handleClose, handleSelect, projectName }) => {
  const [resources, setResources] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showCreateResourceModal, setShowCreateResourceModal] = useState(false);
  const token = Cookies.get('authToken');

  const fetchResources = async () => {
    try {
      const resources = await getResources(token);
      setResources(resources);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [token]);

  const handleQuantityChange = (resource, quantity) => {
    setQuantities({ ...quantities, [resource.name]: quantity });

    const updatedMaterials = selectedMaterials.map((material) =>
      material.id === resource.id ? { ...material, quantity } : material
    );
    setSelectedMaterials(updatedMaterials);
  };

  const handleAddResource = async (resource) => {
    const quantity = quantities[resource.name] || 1; 
  
    if(projectName) {
      try {
        // Corrigir: resources.id deve ser resource.id
        const response = await addResourceToProject(token, projectName, resource.id, quantity);
        handleSelect(response); 
      } catch (error) {
        console.error('Failed to add resource to project:', error);
      }
    }
  
    const updatedMaterials = [
      ...selectedMaterials,
      { ...resource, quantity },
    ];
    setSelectedMaterials(updatedMaterials);
  
    handleSelect(updatedMaterials); 
    handleClose(); 
  };

  const handleOpenCreateResourceModal = () => {
    setShowCreateResourceModal(true);
  };

  const handleCloseCreateResourceModal = () => {
    setShowCreateResourceModal(false);
    fetchResources(); 
  };


  return (
    <>
      <Modal show={show} onHide={handleClose} className='resources-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Resources</Modal.Title>
          <Button onClick={handleOpenCreateResourceModal}>Add New Component/Resource</Button>
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
      <CreateResourceModal
        isOpen={showCreateResourceModal}
        toggle={handleCloseCreateResourceModal}
        fetchResources={fetchResources}
      />
    </>
  );
};

export default ResourcesModal;
