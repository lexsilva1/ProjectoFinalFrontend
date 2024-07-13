import React from "react";
import { Row, Col, FormGroup, Label, Button } from "reactstrap";
import { createProject } from "../../services/projectServices";
import Cookies from "js-cookie";
import userstore from "../../stores/userStore";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* Step3 component: responsible for displaying a project summary and allowing its submission
It receives the following props: inputs, prevStep, setInputs, setStep, setError 
so that it can be used in the CreateProject component */

const Step3 = ({ inputs, prevStep, setInputs, setStep, setError }) => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const user = userstore((state) => state.user);
  const { t } = useTranslation();

  // Function to handle the submission of the project, it creates a projectDto object with the project information
  const handleSubmit = async (e) => {
    e.preventDefault();
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

    // Creates an array 'projectUsers' with the project team members
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

    // Creates a projectDto object with the project information
    let projectDto = {
      name: inputs.name,
      lab: inputs.location,
      description: inputs.description,
      startDate: new Date(
        new Date(inputs.startDate).setHours(23, 59, 59, 999)
      ).toISOString(),
      endDate: new Date(
        new Date(inputs.endDate).setHours(23, 59, 59, 999)
      ).toISOString(),
      slots: inputs.slots,
      skills: inputs.skills,
      interests: inputs.interests,
      billOfMaterials: inputs.materials,
      image: inputs.projectPhoto,
      teamMembers: projectUsers,
    };

    console.log("Submitting Project DTO:", projectDto);
    
  
      createProject(token, projectDto)
  .then(response => {
    if (response !== "created") {
      setError("An error occurred. Please try again.");
    } else {
      console.log("Project created successfully.", response);
      navigate(`/project/${encodeURIComponent(inputs.name)}`);
    }
  })
  .catch(error => {
    console.error("HTTP error!", error);
    setError(`An error occurred: ${error.message}`);
  });
};
  

  // Function to create a list of interests and skills
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
        <Col md={12} className="text-center">
          <FormGroup className="my-form-group">
            <h4>{t("Review Your Project")}</h4>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup className="my-form-group">
            <div className="review-section">
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Project Name")}:</strong> {inputs.name}
              </p>
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Location")}:</strong> {inputs.location}
              </p>
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Description")}:</strong> {inputs.description}
              </p>
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Start Date")}:</strong>
                {inputs.startDate}
              </p>
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("End Date")}:</strong>
                {inputs.endDate}
              </p>
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Skills")}:</strong> {skillList.join(", ")}
              </p>
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Keywords")}:</strong> {interestList.join(", ")}
              </p>
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Materials")}:</strong>{" "}
                {inputs.materials
                  .map((material) => `${material.name} - ${material.quantity}`)
                  .join(", ")}
              </p>
            </div>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup className="my-form-group">
            <div className="review-section">
            <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Number of Slots")}:</strong> {inputs.slots}
              </p>

              <ul className="list-group">
              <p style={{marginTop: "10px", marginBottom: "30px"}}>
                <strong>{t("Team Members")}:</strong>
              </p>
                {inputs &&
                  inputs.teamMembers.map((member, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <img
                        src={member.userPhoto ? member.userPhoto : Avatar}
                        alt={`${member.firstName} ${member.lastName}`}
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
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Button
            onClick={prevStep}
            color="secondary"
            className="previous-button"
          >
            {t("Previous")}
          </Button>
        </Col>
        <Col md={6}  style={{marginTop: "20px"}}>
          <Button
            onClick={handleSubmit}
            color="success"
            className="float-right submit-button"
          >
            {t("Submit")}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Step3;

