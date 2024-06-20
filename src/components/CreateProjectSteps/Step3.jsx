import React from "react";
import { Row, Col, FormGroup, Label, Button } from "reactstrap";

const Step3 = ({ inputs, teamMembers, prevStep, handleSubmit }) => {
  return (
    <>
      <Row>
        <Col md={12}>
          <FormGroup className="my-form-group">
            <Label>Review Your Project</Label>
            <div className="review-section">
              <p><strong>Project Name:</strong> {inputs.name}</p>
              <p><strong>Location:</strong> {inputs.location}</p>
              <p><strong>Description:</strong> {inputs.description}</p>
              <p><strong>Number of Slots:</strong> {inputs.slots}</p>
              <p><strong>Skills:</strong> {inputs.skills.join(", ")}</p>
              <p><strong>Keywords:</strong> {inputs.keywords.join(", ")}</p>
              <p><strong>Team Members:</strong> {teamMembers.map((member) => `${member.firstName} ${member.lastName}`).join(", ")}</p>
              <p><strong>Materials:</strong> {inputs.materials.map((material) => `${material.name} - ${material.quantity}`).join(", ")}</p>
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Button onClick={prevStep} color="secondary" className="previous-button">
            Previous
          </Button>
        </Col>
        <Col md={6}>
          <Button onClick={handleSubmit} color="success" className="float-right submit-button">
            Submit
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Step3;
