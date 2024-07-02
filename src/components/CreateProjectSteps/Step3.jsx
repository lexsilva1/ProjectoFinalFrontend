import React from "react";
import { Row, Col, FormGroup, Label, Button } from "reactstrap";
import { createProject } from "../../services/projectServices";
import Cookies from "js-cookie";
import userstore from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Componente step3: responsável por exibir um resumo do projeto e permitir a submissão do mesmo
const Step3 = ({ inputs, prevStep, setInputs, setStep, setError }) => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const user = userstore((state) => state.user);
  const { t } = useTranslation();

  // Função para submeter o projeto, cria um objeto 'projectDto' com as informações do projeto 
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

    // Cria um array 'projectUsers' com os membros do projeto
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

    // Cria um objeto 'projectDto' com as informações do projeto
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
    debugger;
    try {
      const response = await createProject(token, projectDto);
      if (response !== "created") {
        setError("An error occurred. Please try again.");
      } else {
        console.log("Project created successfully.", response);
        navigate("/");
      }
    } catch (error) {
      console.error("HTTP error!", error);
      setError(`An error occurred: ${error.message}`);
    }
  };

  // Função para criar uma lista de interesses e skills
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
            <Label>{t("Review Your Project")}</Label>
            <div className="review-section">
              <p>
                <strong>{t("Project Name")}:</strong> {inputs.name}
              </p>
              <p>
                <strong>{t("Location")}:</strong> {inputs.location}
              </p>
              <p>
                <strong>{t("Description")}:</strong> {inputs.description}
              </p>
              <p>
                <strong>{t("Start Date")}:</strong>
                {inputs.startDate}
              </p>
              <p>
                <strong>{t("End Date")}:</strong>
                {inputs.endDate}
              </p>
              <p>
                <strong>{t("Number of Slots")}:</strong> {inputs.slots}
              </p>
              <p>
                <strong>{t("Skills")}:</strong> {skillList.join(", ")}
              </p>
              <p>
                <strong>{t("Keywords")}:</strong> {interestList.join(", ")}
              </p>
              <ul className="list-group">
                {inputs &&
                  inputs.teamMembers.map((member, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <img
                        src={member.userPhoto} 
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
              <p>
                <strong>{t("Materials")}:</strong>{" "}
                {inputs.materials
                  .map((material) => `${material.name} - ${material.quantity}`)
                  .join(", ")}
              </p>
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
        <Col md={6}>
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

