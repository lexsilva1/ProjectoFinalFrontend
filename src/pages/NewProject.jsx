import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import { getLabs } from '../services/labServices';
import Cookies from 'js-cookie';
import avatarProject from '../multimedia/Images/avatarProject.png';
import UsersModal from '../components/UsersModal';
import ResourcesModal from '../components/ResourcesModal';
import userStore from '../stores/userStore';
import Avatar from '../multimedia/Images/Avatar.jpg';
import './NewProject.css';

const NewProject = () => {
  const [inputs, setInputs] = useState({
    name: "",
    location: "",
    description: "",
    slots: "",
    skills: [""],
    keywords: [""],
    materials: [],
  });
  const [labs, setLabs] = useState([]);
  const token = Cookies.get("authToken");
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(avatarProject);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const currentUser = userStore((state) => state.user);
  const [teamMembers, setTeamMembers] = useState([]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    getLabs(token)
      .then((labs) => setLabs(labs))
      .catch((error) => console.error(error));
  }, [token]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleInputChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const handleArrayChange = (event, index, field) => {
    const newValues = [...inputs[field]];
    newValues[index] = event.target.value;
    setInputs({ ...inputs, [field]: newValues });
  };

  const addField = (field) => {
    if (inputs[field][inputs[field].length - 1] !== "") {
      setInputs({ ...inputs, [field]: [...inputs[field], ""] });
    }
  };

  const handleDelete = (index, field) => {
    const newValues = [...inputs[field]];
    newValues.splice(index, 1);
    setInputs({ ...inputs, [field]: newValues });
  };

  const handleOpenUserModal = () => {
    if (!inputs.slots) {
      setError("Please define the number of slots first.");
    } else {
      setShowUsersModal(true);
      setError("");
    }
  };

  const handleCloseUsersModal = () => {
    setShowUsersModal(false);
  };

  const handleOpenResourcesModal = () => {
    setShowResourcesModal(true);
  };

  const handleCloseResourcesModal = () => {
    setShowResourcesModal(false);
  };

  const handleUserSelect = (selectedUser) => {
    if (teamMembers.length >= parseInt(inputs.slots)) {
      setError("You have reached the maximum number of slots.");
    } else {
      setTeamMembers([...teamMembers, selectedUser]);
      handleCloseUsersModal();
      setError("");
    }
  };

  const handleResourcesSelect = (selectedMaterials) => {
    setInputs({ ...inputs, materials: selectedMaterials });
    handleCloseResourcesModal();
  };

  const removeTeamMember = (index) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers.splice(index, 1);
    setTeamMembers(newTeamMembers);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <>
      <UsersModal
        show={showUsersModal}
        handleClose={handleCloseUsersModal}
        onAdd={handleUserSelect}
      />
      <ResourcesModal
  show={showResourcesModal}
  handleClose={handleCloseResourcesModal}
  handleSelect={handleResourcesSelect} // Adicione esta linha
/>
      <Header className="header" />
      <div className="new-project">
        <Sidebar className="sidebar" />
        <div className="content-wrapper">
          <Container fluid className="content-new-project">
            <Card className="project-card">
              <CardHeader>
                <h2 className="centered-title">Create New Project</h2>
              </CardHeader>
              <CardBody>
                <Form>
                  {step === 1 && (
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
                            />
                            <img
                              src={avatar}
                              alt="Project Avatar"
                              className="avatar"
                            />
                          </FormGroup>
                          <Button
                            onClick={nextStep}
                            color="primary"
                            className="next-button float-right"
                          >
                            Next
                          </Button>
                          </Col>
                        </Row>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <Row>
                          <Col md={6}>
                            {['skills', 'keywords'].map((field) => (
                              <React.Fragment key={field}>
                                {inputs[field].map((value, index) => (
                                  <Row key={`${field}-${index}`}>
                                    <Col md={12}>
                                      <FormGroup className="my-form-group">
                                        <Label for={`${field}-${index}`}>
                                          {index === 0
                                            ? field.charAt(0).toUpperCase() +
                                              field.slice(1)
                                            : ''}
                                        </Label>
                                        {index < inputs[field].length - 1 ? (
                                          <div className="array-field">
                                            {value}
                                            <Button
                                              onClick={() =>
                                                handleDelete(index, field)
                                              }
                                              color="danger"
                                              size="sm"
                                              className="array-remove-button"
                                            >
                                              Remove
                                            </Button>
                                          </div>
                                        ) : (
                                          <Input
                                            type="text"
                                            name={`${field}-${index}`}
                                            id={`${field}-${index}`}
                                            value={value}
                                            onChange={(e) =>
                                              handleArrayChange(
                                                e,
                                                index,
                                                field
                                              )
                                            }
                                            className="short-input"
                                          />
                                        )}
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                ))}
                                {inputs[field][inputs[field].length - 1] !== '' && (
                                  <Row>
                                    <Col md={12}>
                                      <Button onClick={() => addField(field)}>
                                        Add
                                      </Button>
                                    </Col>
                                  </Row>
                                )}
                              </React.Fragment>
                            ))}
                          </Col>
                          <Col md={6}>
                            <FormGroup className="my-form-group">
                              <Label for="slots">Number of Slots</Label>
                              <Input
  type="number"
  name="slots"
  id="slots"
  onChange={handleInputChange}
  className="short-input"
  min="0" // Adicionando o atributo min="0"
/>
                            </FormGroup>
                            <FormGroup>
                              <Label>Team Members</Label>
                              <Button
  onClick={handleOpenUserModal}
  color="primary"
  className="modal-button"
>
  Add Team Members
</Button>
{error && <p className="error-message">{error}</p>}
                              <ul className="list-group">
                                {teamMembers.map((member, index) => (
                                  <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                  >
                                    <img
                                      src={member.userPhoto || Avatar}
                                      alt={`${member.firstName} ${member.lastName}`}
                                      className="rounded-circle"
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        marginRight: '10px',
                                      }}
                                    />
                                    {member.firstName} {member.lastName}
                                    <Button
                                      onClick={() => removeTeamMember(index)}
                                      color="danger"
                                      size="sm"
                                      className="ml-2"
                                    >
                                      Remove
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </FormGroup>
                            <FormGroup>
                              <Label>Materials</Label>
                              <Button
                                onClick={handleOpenResourcesModal}
                                color="primary"
                                className="modal-button"
                              >
                                Add Materials
                              </Button>
                              <ul className="list-group">
                                {inputs.materials.map((material, index) => (
                                  <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                  >
                                    {material.name} - {material.quantity}
                                    <Button
                                      onClick={() => {
                                        const newMaterials = [
                                          ...inputs.materials,
                                        ];
                                        newMaterials.splice(index, 1);
                                        setInputs({
                                          ...inputs,
                                          materials: newMaterials,
                                        });
                                      }}
                                      color="danger"
                                      size="sm"
                                    >
                                      Remove
                                    </Button>
                                  </li>
                                ))}
                              </ul>
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
                              Previous
                            </Button>
                          </Col>
                          <Col md={6}>
                            <Button
                              onClick={nextStep}
                              color="primary"
                              className="next-button float-right"
                            >
                              Next
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <Row>
                          <Col md={12}>
                            <FormGroup className="my-form-group">
                              <Label>Review Your Project</Label>
                              <div className="review-section">
                                <p>
                                  <strong>Project Name:</strong> {inputs.name}
                                </p>
                                <p>
                                  <strong>Location:</strong> {inputs.location}
                                </p>
                                <p>
                                  <strong>Description:</strong>{' '}
                                  {inputs.description}
                                </p>
                                <p>
                                  <strong>Number of Slots:</strong>{' '}
                                  {inputs.slots}
                                </p>
                                <p>
                                  <strong>Skills:</strong>{' '}
                                  {inputs.skills.join(', ')}
                                </p>
                                <p>
                                  <strong>Keywords:</strong>{' '}
                                  {inputs.keywords.join(', ')}
                                </p>
                                <p>
                                  <strong>Team Members:</strong>{' '}
                                  {teamMembers
                                    .map(
                                      (member) =>
                                        `${member.firstName} ${member.lastName}`
                                    )
                                    .join(', ')}
                                </p>
                                <p>
                                  <strong>Materials:</strong>{' '}
                                  {inputs.materials
                                    .map(
                                      (material) =>
                                        `${material.name} - ${material.quantity}`
                                    )
                                    .join(', ')}
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
                              Previous
                            </Button>
                          </Col>
                          <Col md={6}>
                            <Button color="success" className="float-right">
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      </>
    );
  };

  export default NewProject;
