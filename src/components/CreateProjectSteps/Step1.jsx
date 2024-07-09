import React, { useState } from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/* Componente Step1: Responsável pela primeira etapa de um formulário, recebe várias props 
escolha do nome, localizaçao do lab, imagem, data de início e data de fim*/

const Step1 = ({
  inputs, // Objeto contendo os valores dos inputs
  labs, // Array contendo os laboratórios disponíveis para seleção
  handleInputChange, // Função para tratar a mudança nos inputs
  handleImageUpload, // Função para tratar o upload de imagem
  nextStep, // Função para avançar para a próxima etapa do formulário
  avatar, // URL da imagem de avatar do projeto
}) => {
  const { t } = useTranslation();
  const [selectedFileName, setSelectedFileName] = useState(t("No file selected"));

  // Função para tratar o upload de imagem em inglês
  const handleCustomFileUpload = (event) => {
    handleImageUpload(event);
    const fileName = event.target.files[0] ? event.target.files[0].name : t("No file selected");
    setSelectedFileName(fileName);
  };

    // Função específica para manipular mudanças no ReactQuill
    const handleQuillChange = (value, name) => {
      handleInputChange({ target: { name, value } });
    };
    
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Row>
          <Col md={6}>
            <FormGroup className="my-form-group">
              <Label for="name">{t("Project Name")}</Label>
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
              <Label for="location">{t("Location")}</Label>
              <Input
                type="select"
                name="location"
                id="location"
                onChange={handleInputChange}
                className="short-input"
                value={inputs.location}
              >
                <option value="">{t("Select a laboratory")}</option>
                {labs.map((lab, index) => (
                  <option key={index} value={lab.location}>
                    {lab.location}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup className="my-form-group">
              <Label for="description">{t("Description")}</Label>
              <ReactQuill
                theme="snow"
                value={inputs.description}
                onChange={(content) => handleQuillChange(content, 'description')}
                style={{ height: "250px", resize: "none" }}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup className="my-form-group">
              <Label for="imageUpload">{t("Project Image")}</Label>
              <div className="custom-file-upload">
                <Button color="primary" onClick={() => document.getElementById('imageUpload').click()}>{t("Upload Image")}</Button>
                <span style={{ marginLeft: "10px" }}>{selectedFileName}</span>
                <Input
                  type="file"
                  name="imageUpload"
                  id="imageUpload"
                  onChange={handleCustomFileUpload}
                  className="short-input"
                  accept="image/*"
                  style={{ display: "none" }}
              />
              </div>
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  border: "1px dashed #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginTop: "10px",
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Project Avatar"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  <span style={{ color: "#ccc" }}>{t("No image selected")}</span>
                )}
              </div>
            </FormGroup>
            <FormGroup className="my-form-group">
              <Label for="startDate">{t("Start Date")}</Label>
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
              <Label for="endDate">{t("End Date")}</Label>
              <Input
                type="date"
                name="endDate"
                id="endDate"
                onChange={handleInputChange}
                className="short-input"
                value={inputs.endDate}
              />
            </FormGroup>
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={nextStep} color="primary">
                {t("Next")}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Step1;
