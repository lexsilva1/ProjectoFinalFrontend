import React from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";

const Step1 = ({ inputs, labs, handleInputChange, handleImageUpload, nextStep, avatar }) => {
  return (
    <>
      <Row>
        <Col md={6}>
          <FormGroup className="my-form-group">
            <Label for="name">Project Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
              className="short-input"
              value={inputs.name}

            />
          </FormGroup>
          <FormGroup className="my-form-group">
            <Label for="location">Location</Label>
            <Input
              type="select"
              name="location"
              id="location"
              onChange={handleInputChange}
              className="short-input"
              value={inputs.location}
            >
              <option value="">Select a laboratory</option>
              {labs.map((lab, index) => (
                <option key={index} value={lab.location}>
                  {lab.location}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup className="my-form-group">
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              onChange={handleInputChange}
              className="short-input textarea-input"
              value={inputs.description}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup className="my-form-group">
            <Label for="imageUpload">Project Image</Label>
            <Input
              type="file"
              name="imageUpload"
              id="imageUpload"
              onChange={handleImageUpload}
              className="short-input"
              accept="image/*"
              style={{ maxWidth: "100%" }}
            />
            <img
              src={avatar}
              alt="Project Avatar"
              className="avatar"
              style={{ maxWidth: "100%" }}
            />
          </FormGroup>
          <FormGroup className="my-form-group">
            <Label for="startDate">Start Date</Label>
            <Input
            type="date"
            name="startDate"
            id="startDate"
            onChange={handleInputChange}
            className="short-input"
            value={inputs.startDate}
            />
          </FormGroup>
          <FormGroup className="my-form-group">
            <Label for="endDate">End Date</Label>
            <Input
            type="date"
            name="endDate"
            id="endDate"
            onChange={handleInputChange}
            className="short-input"
            value={inputs.endDate}
            />
          </FormGroup>
          
          <Button
            onClick={nextStep}
            color="primary"
            className="next-button"
          >
            Next
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Step1;
