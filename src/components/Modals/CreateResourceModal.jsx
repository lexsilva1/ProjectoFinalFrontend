import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from "reactstrap";
import "./CreateResourceModal.css";
import { createResource } from "../../services/resourcesServices";
import Cookies from "js-cookie";

const initialState = {
  name: '',
  description: '',
  type: '',
  supplier: '',
  stock: '',
  brand: '',
  supplierContact: '',
  observations: ''
};

const CreateResourceModal = ({ isOpen, toggle, fetchResources }) => {
  const token = Cookies.get("authToken");
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

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
      const response = await createResource(token, formData);
      console.log("Response from createResource:", response);
      fetchResources(); 
      handleClose();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleClose = () => {
    toggle(); 
    setFormData(initialState); 
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal create-resource-modal">
      <ModalHeader toggle={toggle}>Create Resource</ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    invalid={!!errors.name}
                  />
                  <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="type">Type</Label>
                  <Input
                    type="select"
                    name="type"
                    value={formData.type}
                    onChange={onChange}
                    invalid={!!errors.type}
                  >
                    <option value="">Select...</option>
                    <option value="COMPONENT">Component</option>
                    <option value="RESOURCE">Resource</option>
                  </Input>
                  <FormFeedback>{errors.type}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="supplier">Supplier</Label>
                  <Input
                    name="supplier"
                    value={formData.supplier}
                    onChange={onChange}
                  />
                </FormGroup>
                <FormGroup>
  <Label for="stock">Quantity</Label>
  <Input
    type="number"
    name="stock"
    value={formData.stock}
    onChange={onChange}
    invalid={!!errors.stock}
    min="0" // This prevents negative numbers
  />
  <FormFeedback>{errors.stock}</FormFeedback>
</FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="brand">Brand</Label>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="supplierContact">Supplier Contact</Label>
                  <Input
                    name="supplierContact"
                    value={formData.supplierContact}
                    onChange={onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="observations">Observations</Label>
                  <Input
                    name="observations"
                    value={formData.observations}
                    onChange={onChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>
          <Button type="submit" color="primary">Submit</Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateResourceModal;


