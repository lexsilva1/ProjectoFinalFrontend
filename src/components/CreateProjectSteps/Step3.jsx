import React from "react";
import { Row, Col, FormGroup, Label, Button } from "reactstrap";
import { createProject } from "../../services/projectServices";
import Cookies from "js-cookie";
import userstore from "../../stores/userStore";
import { useNavigate } from "react-router-dom";

const Step3 = ({ inputs, prevStep, setInputs, setStep, setError }) => {

  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const user = userstore((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (inputs.slots <= 0) {
      setError("Number of slots must be greater than zero.");
      return;
    }
    if (inputs.startDate >= inputs.endDate) {
      setError("End date must be after start date.");
      return;
    }
    if (inputs.teamMembers.length === 0) {
      setError("You must add at least one team member.");
      return;
    }

    let projectUsers = [];
    inputs.teamMembers.forEach((member) => {
      if (member.userId === user.id) {
        projectUsers.push(member);
      } else {
        let projectUser = {
          userId: member.userId,
          isProjectManager: false,
          approvalStatus: "INVITED",
          firstName: member.firstName,
          lastName: member.lastName,
          userPhoto: member.userPhoto,
          nickname: member.nickname,
        };
        projectUsers.push(projectUser);
      }
    });

    let projectDto = {
      name: inputs.name,
      lab: inputs.location,
      description: inputs.description,
      startDate: new Date(new Date(inputs.startDate).setHours(23, 59, 59, 999)).toISOString(),
      endDate: new Date(new Date(inputs.endDate).setHours(23, 59, 59, 999)).toISOString(),
      slots: inputs.slots,
      skills: inputs.skills,
      interests: inputs.interests,
      billOfMaterials: inputs.materials,
      image: inputs.projectPhoto,
      teamMembers: projectUsers,
    };

    console.log("Submitting Project DTO:", projectDto);
debugger;
    try {
      const response = await createProject(token, projectDto);
      if (response !== 'created') {
        setError("An error occurred. Please try again.");
      } else {
        console.log("Project created successfully.", response);
        navigate("/")
      }
    } catch (error) {
      console.error("HTTP error!", error);
      setError(`An error occurred: ${error.message}`);
    }
  };

  const interestList = [];
  if (inputs.interests) {
    inputs.interests.forEach((interest) => {
      interestList.push(interest.name);
    });
  }
  const skillList = [];
  if (inputs.skills) {
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
              <p><strong>Start Date:</strong>{inputs.startDate}</p>
              <p><strong>End Date:</strong>{inputs.endDate}</p>
              <p><strong>Number of Slots:</strong> {inputs.slots}</p>
              <p><strong>Skills:</strong> {skillList.join(", ")}</p>
              <p><strong>Keywords:</strong> {interestList.join(", ")}</p>
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

