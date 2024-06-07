import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import { getLabs } from '../services/labServices';
import Cookies from 'js-cookie';
import avatarProject from '../multimedia/Images/avatarProject.png';
import './NewProject.css';
import UsersModal from '../components/UsersModal';
import userStore from '../stores/userStore';

const NewProject = () => {
  const [inputs, setInputs] = useState({
    name: "",
    location: "",
    description: "",
    slots: "",
    skills: [""],
    keywords: [""],
    materials: [""],
  });
  const [labs, setLabs] = useState([]);
  const token = Cookies.get("authToken");
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(avatarProject);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const currentUser = userStore((state) => state.user);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    getLabs(token)
      .then((labs) => setLabs(labs))
      .catch((error) => console.error(error));
  }, [token]);

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
    setShowUsersModal(true);
  };

  const handleCloseUsersModal = () => {
    setShowUsersModal(false);
  };

  return (
    <>
      <UsersModal show={showUsersModal} handleClose={handleCloseUsersModal} currentUser={currentUser} />
      <Header className="header" />
      <div className="new-project">
        <Sidebar className="sidebar" />
        <div className="content-wrapper">
          <Container className="content-new-project">
            <h2 className="centered-title">Create New Project</h2>
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup className="my-form-group">
                    <Label for="name">Project Name:</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      onChange={handleInputChange}
                      className="short-input"
                    />
                  </FormGroup>
                  <FormGroup className="my-form-group">
                    <Label for="location">Location:</Label>
                    <Input
                      type="select"
                      name="location"
                      id="location"
                      onChange={handleInputChange}
                      className="short-input"
                    >
                      <option value="">Select a laboratory:</option>
                      {labs.map((lab, index) => (
                        <option key={index} value={lab.location}>
                          {lab.location}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  <FormGroup className="my-form-group">
                    <Label for="description">Description:</Label>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      onChange={handleInputChange}
                      className="short-input textarea-input"
                    />{" "}
                  </FormGroup>
                  <FormGroup className="my-form-group">
                    <Label for="imageUpload">Project Image</Label>
                    <Input
                      type="file"
                      name="imageUpload"
                      id="imageUpload"
                      onChange={handleImageUpload}
                      className="short-input"
                    />
                    <img src={avatar} alt="Project Avatar" className="avatar" />
                  </FormGroup>
                  <div>
                    <label>Team:</label>
                    <Button onClick={handleOpenUserModal}>Add</Button>
                  </div>
                </Col>
                <Col md={6}>
                  <FormGroup className="my-form-group">
                    <Label for="slots">Number of Slots:</Label>
                    <Input
                      type="number"
                      name="slots"
                      id="slots"
                      onChange={handleInputChange}
                      className="short-input"
                    />
                  </FormGroup>
                  {["skills", "keywords"].map((field) => (
                    <React.Fragment key={field}>
                      {inputs[field].map((value, index) => (
                        <Row key={`${field}-${index}`}>
                          <Col md={6}>
                            <FormGroup className="my-form-group">
                              <Label for={`${field}-${index}`}>
                                {index === 0
                                  ? field.charAt(0).toUpperCase() +
                                    field.slice(1) +
                                    ":"
                                  : ""}
                              </Label>
                              {index < inputs[field].length - 1 ? (
                                <div>
                                  {value}
                                  <Button
                                    style={{
                                      marginLeft: "20px",
                                      padding: "2px",
                                      fontSize: "15px",
                                    }}
                                    onClick={() => handleDelete(index, field)}
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
                                    handleArrayChange(e, index, field)
                                  }
                                  className="short-input"
                                />
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                      ))}
                      {inputs[field][inputs[field].length - 1] !== "" && (
                        <Row>
                          <Col md={6}>
                            <Button onClick={() => addField(field)}>Add</Button>
                          </Col>
                        </Row>
                      )}
                    </React.Fragment>
                  ))}

                  <React.Fragment>
                    {inputs["materials"].map((value, index) => (
                      <Row key={`materials-${index}`}>
                        <Col md={12}>
                          <FormGroup className="my-form-group">
                            <Label for={`materials-${index}`}>
                              {index === 0 ? "Materials" : ""}
                            </Label>
                            {index < inputs["materials"].length - 1 ? (
                              <div>
                                {value}
                                <Button
                                  style={{
                                    marginLeft: "20px",
                                    padding: "2px",
                                    fontSize: "15px",
                                  }}
                                  onClick={() => handleDelete(index, "materials")}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <Input
                                type="text"
                                name={`materials-${index}`}
                                id={`materials-${index}`}
                                value={value}
                                onChange={(event) =>
                                  handleArrayChange(event, index, "materials")
                                }
                                placeholder="Materials"
                                className="short-input"
                              />
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    ))}
                    {inputs["materials"][inputs["materials"].length - 1] !== "" && (
                      <Row>
                        <Col md={12}>
                          <Button onClick={() => addField("materials")}>
                            Add
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </React.Fragment>
                </Col>
              </Row>
              <Button type="submit" color="primary" className="submit-button">
                Submit
              </Button>
            </Form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default NewProject;
