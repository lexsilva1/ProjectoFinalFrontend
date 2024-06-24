import React from "react";
import { Row, Col, FormGroup, Label, Button } from "reactstrap";
import { createProject } from "../../services/projectServices";
import Cookies from "js-cookie";

const Step3 = ({ inputs, prevStep, setInputs, setStep, setError }) => {
console.log(inputs);

const token = Cookies.get("authToken");
const handleSubmit = async (e) => {
  e.preventDefault();
  // Validation
  if (inputs.slots <= 0) {
    setError("Number of slots must be greater than zero.");
    return;
  }
  const response = await createProject(token, inputs);
  if (response.ok) {
    setInputs({
      name: "",
      location: "",
      description: "",
      slots: 0,
      skills: [],
      interests: [],
      materials: [],
      imageUpload: null,
      
      teamMembers: [],
    });
    setStep(1);
  } else {
    setError("An error occurred. Please try again.");

  }
};

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
