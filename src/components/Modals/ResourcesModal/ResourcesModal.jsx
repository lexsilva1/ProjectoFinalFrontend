import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, FormControl } from "react-bootstrap";
import { addResourceToProject } from "../../../services/projectServices";
import { getResources } from "../../../services/resourcesServices";
import CreateResourceModal from "../CreateResourceModal/CreateResourceModal";
import "./ResourcesModal.css";
import Cookies from "js-cookie";

const ResourcesModal = ({
  show,
  handleClose,
  handleSelect,
  projectName,
  project,
  setProject,
}) => {
  const [resources, setResources] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showCreateResourceModal, setShowCreateResourceModal] = useState(false);
  const token = Cookies.get("authToken");
  const [tempSelectedMaterials, setTempSelectedMaterials] = useState([]);

  const fetchResources = async () => {
    try {
      let resources = await getResources(token);
      // Filtra recursos que já foram adicionados
      resources = resources.filter(
        (resource) =>
          !selectedMaterials.some((material) => material.id === resource.id)
      );
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

  const handleAddResource = (resource) => {
    const quantity = quantities[resource.name] || 1;
    const updatedMaterials = [
      ...tempSelectedMaterials,
      { ...resource, quantity },
    ];
    console.log("Adicionando recurso:", resource, "Quantidade:", quantity); // Debug
    setTempSelectedMaterials(updatedMaterials);
  };

  const handleAddSelectedResources = async () => {
    console.log("Adicionando selecionados:", tempSelectedMaterials); // Debug
    setSelectedMaterials([...selectedMaterials, ...tempSelectedMaterials]);
    setTempSelectedMaterials([]);
    handleClose();
  };

  const handleRemoveSelectedResource = (resourceId) => {
    const updatedMaterials = tempSelectedMaterials.filter(
      (material) => material.id !== resourceId
    );
    setTempSelectedMaterials(updatedMaterials);
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
      <Modal show={show} onHide={handleClose} className="resources-modal">
        <Modal.Header closeButton>
          <Modal.Title>Resources</Modal.Title>
          <Button onClick={handleOpenCreateResourceModal}>
            Add New Component/Resource
          </Button>
        </Modal.Header>
        <Modal.Body>
          <h5>Recursos Adicionados</h5>
          {tempSelectedMaterials.map((material, index) => (
            <Row key={index} className="align-items-center">
              <Col>
                <p>
                  {material.name} - Quantidade: {material.quantity}
                </p>
              </Col>
              <Col>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveSelectedResource(material.id)}
                >
                  Remover
                </Button>
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
                  onChange={(e) =>
                    handleQuantityChange(resource, e.target.value)
                  }
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
      />
    </>
  );
};

export default ResourcesModal;
