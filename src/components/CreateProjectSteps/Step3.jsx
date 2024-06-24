import React from "react";
import { Row, Col, FormGroup, Label, Button } from "reactstrap";

const Step3 = ({ inputs, prevStep, handleSubmit }) => {



  const interestList = [];
  if(inputs.interests){
  inputs.interests.forEach((interest) => {
    interestList.push(interest.name);
  });
}
  const skillList = [];
  if(inputs.skills){
  inputs.skills.forEach((skill) => {
    skillList.push(skill.name);
  });
}
  

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
              <p><strong>Skills:</strong> {skillList.join(", ")}</p>
              <p><strong>Keywords:</strong> { interestList.join(", ")}</p>
              <ul className="list-group">
              {inputs && inputs.teamMembers.map((member, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <img
                  src={member.userPhoto} // Ensure this is a string URL
                  alt={`${member.firstName} ${member.lastName}`} // Ensure firstName and lastName are strings
                  className="rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                />
                {member.firstName} {member.lastName}
              </li>
            ))}
              </ul>
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
