import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, FormControl } from 'react-bootstrap';
import { getResources } from '../../services/resourcesServices';
import CreateResourceModal from '../Modals/CreateResourceModal/CreateResourceModal';
import Cookies from 'js-cookie';

const ResourcesModal = ({ show, handleClose, projectName, project, setProject, inputs, setInputs }) => {
  const [resources, setResources] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showCreateResourceModal, setShowCreateResourceModal] = useState(false);
  const token = Cookies.get('authToken');
  const [tempSelectedMaterials, setTempSelectedMaterials] = useState([]);
 

  const fetchResources = async () => {
    try {
      let fetchedResources = await getResources(token);
      setTempSelectedMaterials(project ? project.billOfMaterials : inputs.materials);
      setSelectedMaterials(project ? project.billOfMaterials : inputs.materials);
      fetchedResources = fetchedResources.filter((resource) => !selectedMaterials.some((material) => material.id === resource.id));
      setResources(fetchedResources);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    
    fetchResources();
  }, [show]);

  const handleQuantityChange = (resource, quantity) => {
    setQuantities({ ...quantities, [resource.name]: quantity });
    const updatedMaterials = selectedMaterials.map((material) =>
      material.id === resource.id ? { ...material, quantity: parseInt(quantity, 10) } : material
    );
    setSelectedMaterials(updatedMaterials);
  };

  const handleAddResource = (resource) => {
    const quantity = quantities[resource.name] || 1;
    const updatedMaterials = [...tempSelectedMaterials, { ...resource, quantity: parseInt(quantity, 10) }];
    setTempSelectedMaterials(updatedMaterials);
    const updateSelection = resources.filter((r) => r.id !== resource.id);
    setResources(updateSelection);
  };

  const handleAddSelectedResources = async () => {
    const updatedMaterials = [...selectedMaterials, ...tempSelectedMaterials];
    setTempSelectedMaterials([]);

    if (project) {
      const updatedBillOfMaterials = [...project.billOfMaterials, ...updatedMaterials];
      setProject({ ...project, billOfMaterials: updatedBillOfMaterials });
    } else if (inputs) {
      const updatedMaterialsList = [...inputs.materials, ...updatedMaterials];
      setInputs({ ...inputs, materials: updatedMaterialsList });
    }

    handleClose();
  };

  const handleRemoveSelectedResource = (resourceId) => {
    const updatedMaterials = tempSelectedMaterials.filter(material => material.id !== resourceId);
    setTempSelectedMaterials(updatedMaterials);
    const resource = tempSelectedMaterials.find((material) => material.id === resourceId);
    console.log('resource', resource);
    const updatedResources = [...resources, resource];
    updatedResources.sort((a, b) => a.id - b.id);
    setResources(updatedResources);
    
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
          <h5>Recursos Adicionados</h5>
          {tempSelectedMaterials.map((material, index) => (
            <Row key={index} className="align-items-center">
              <Col>
                <p>{material.name} - Quantidade: {material.quantity}</p>
              </Col>
              <Col>
                <Button variant="danger" onClick={() => handleRemoveSelectedResource(material.id)}>Remover</Button>
              </Col>
            </Row>
          ))}
          <hr />
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
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddSelectedResources}>
            Adicionar Selecionados
          </Button>
        </Modal.Footer>
      </Modal>
      <CreateResourceModal
        isOpen={showCreateResourceModal}
        toggle={handleCloseCreateResourceModal}
        fetchResources={fetchResources}
        handleAddResource={handleAddResource}
      />
    </>
  );
};

export default ResourcesModal;
