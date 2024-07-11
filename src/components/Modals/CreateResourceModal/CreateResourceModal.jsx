import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import { updateResource } from "../../../services/resourcesServices";
import Cookies from "js-cookie";
import "./CreateResourceModal.css";

const CreateResourceModal = ({ isOpen, toggle, fetchResources, initialResource }) => {
  const token = Cookies.get("authToken");
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    supplier: '',
    stock: '',
    brand: '',
    supplierContact: '',
    observations: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialResource) {
      setFormData({
        name: initialResource.name || '',
        description: initialResource.description || '',
        type: initialResource.type || '',
        supplier: initialResource.supplier || '',
        stock: initialResource.stock || '',
        brand: initialResource.brand || '',
        supplierContact: initialResource.supplierContact || '',
        observations: initialResource.observations || ''
      });
    }
  }, [initialResource]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "This field is required";
    if (!formData.type) newErrors.type = "Please select a type";
    if (!formData.stock || formData.stock < 0) newErrors.stock = "This field is required and should be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateResource(token, initialResource.id, formData);
      fetchResources(); 
      handleClose();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleClose = () => {
    toggle(); 
    setFormData({
      name: '',
      description: '',
      type: '',
      supplier: '',
      stock: '',
      brand: '',
      supplierContact: '',
      observations: ''
    }); 
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered className="custom-modal-create-resource">
      <Modal.Header closeButton>
        <Modal.Title>{initialResource ? "Edit Resource" : "Create Resource"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  value={formData.type}
                  onChange={onChange}
                  isInvalid={!!errors.type}
                >
                  <option value="">Select...</option>
                  <option value="COMPONENT">Component</option>
                  <option value="RESOURCE">Resource</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="supplier">
                <Form.Label>Supplier</Form.Label>
                <Form.Control
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Group controlId="stock">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={onChange}
                  isInvalid={!!errors.stock}
                  min="0"
                />
                <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="brand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Group controlId="supplierContact">
                <Form.Label>Supplier Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="supplierContact"
                  value={formData.supplierContact}
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Group controlId="observations">
                <Form.Label>Observations</Form.Label>
                <Form.Control
                  type="text"
                  name="observations"
                  value={formData.observations}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary">Save</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateResourceModal;
