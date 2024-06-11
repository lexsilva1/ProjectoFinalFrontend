import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Avatar from "../multimedia/Images/Avatar.jpg";
import { findUserById, uploadUserPhoto, updateUser } from "../services/userServices";
import Cookies from "js-cookie";
import userStore from "../stores/userStore";
import { PencilSquare } from "react-bootstrap-icons";
import { getLabs } from "../services/labServices";
import { Typeahead } from 'react-bootstrap-typeahead';
import { getSkills, createSkill, deleteSkill } from "../services/skillServices";
import { getInterests, createInterest, deleteInterest } from "../services/interestServices";
import "./Profile.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { user } = userStore.getState();
  const token = Cookies.get("authToken");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [labs, setLabs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    labLocation: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormValues({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        nickname: profile.nickname || '',
        labLocation: profile.labLocation || '',
        bio: profile.bio || '',
      });
      setSelectedSkills(profile.skills || []);
      setSelectedInterests(profile.interests || []);
    }
  }, [profile]);

  useEffect(() => {
    getSkills(token)
      .then((skills) => setSkills(skills))
      .catch((error) => console.error(error));
  
    getInterests(token)
      .then((interests) => setInterests(interests))
      .catch((error) => console.error(error));
  }, [token]);

  useEffect(() => {
    getLabs(token)
      .then((labs) => setLabs(labs))
      .catch((error) => console.error(error));
  }, [token]);

  useEffect(() => {
    if (user && user.id) {
      findUserById(token, user.id)
        .then((userFromServer) => {
          setProfile(userFromServer);
        })
        .catch((error) => console.error(error));
    }
  }, [token, user]);

  const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    setImage(uploadedImage);

    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let finalImageURL = user.image;
  
    if (image) {
      try {
        const response = await uploadUserPhoto(image, token);
        finalImageURL = response.data.image; 
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  
    if (formValues.firstName && formValues.lastName && formValues.labLocation) {
      const userUpdate = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        labLocation: formValues.labLocation,
        nickname: formValues.nickname,
        userPhoto: finalImageURL,
        bio: formValues.bio,
        skills: selectedSkills.map(skill => skill.name),
        interests: selectedInterests.map(interest => interest.name),
      };
  
      try {
        await updateUser(user.id, userUpdate, token);
        setEditMode(false);
      } catch (error) {
        console.error("Error from updateUser:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSkillsChange = async (selected) => {
    const removedSkills = selectedSkills.filter(skill => !selected.some(s => s.name === skill.name));
  
    for (const skill of selected) {
      try {
        await createSkill(skill.name, token);
      } catch (error) {
        console.error("Error creating skill:", error);
      }
    }
  
    for (const skill of removedSkills) {
      try {
        await deleteSkill(skill.name, token);
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }
  
    setSelectedSkills(selected);
  };
  
  const handleInterestsChange = async (selected) => {
    const removedInterests = selectedInterests.filter(interest => !selected.some(i => i.name === interest.name));
  
    for (const interest of selected) {
      try {
        await createInterest(interest.name, token);
      } catch (error) {
        console.error("Error creating interest:", error);
      }
    }
  
    for (const interest of removedInterests) {
      try {
        await deleteInterest(interest.name, token);
      } catch (error) {
        console.error("Error deleting interest:", error);
      }
    }
  
    setSelectedInterests(selected);
  };

  return (
    <>
      <Header />
      <Container fluid className="profile-container">
        <Row className="profile-row">
          <Col md={3} className="profile-sidebar">
            <Sidebar />
          </Col>
          <Col md={9} className="profile-main-content">
            <Card className="profile-card">
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center mb-3">
                    <img
                      src={imagePreview || user?.image || Avatar}
                      alt="Profile"
                      className="profile-image"
                    />
                    {editMode && (
                      <div className="mt-3">
                        <Form.Group>
                          <Form.Label>Choose Image:</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={handleImageUpload}
                          />
                        </Form.Group>
                      </div>
                    )}
                  </Col>
                  <Col md={8}>
                    <h2 className="profile-name">
                      {user?.firstName} {user?.lastName}
                      <Button
                        variant="outline-secondary"
                        onClick={() => setEditMode(!editMode)}
                        className="profile-edit-button"
                      >
                        <PencilSquare />
                      </Button>
                    </h2>
                    <hr />
                    <div>
                      {editMode ? (
                        <Form>
                          <Form.Group>
                            <Form.Label>First Name:</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={formValues.firstName}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Last Name:</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={formValues.lastName}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Nickname:</Form.Label>
                            <Form.Control
                              type="text"
                              name="nickname"
                              value={formValues.nickname}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Usual Work Place:</Form.Label>
                            <Form.Control
                              as="select"
                              name="labLocation"
                              value={formValues.labLocation}
                              onChange={handleChange}
                            >
                              {labs.map((lab, index) => (
                                <option key={index} value={lab.location}>
                                  {lab.location}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Bio:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="bio"
                              value={formValues.bio}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Skills:</Form.Label>
                            <Typeahead
                              id="skills-typeahead"
                              labelKey="name"
                              multiple
                              onChange={handleSkillsChange}
                              options={skills}
                              allowNew
                              newSelectionPrefix="Add a new skill: "
                              placeholder="Choose your skills..."
                              selected={selectedSkills}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Interests:</Form.Label>
                            <Typeahead
                              id="interests-typeahead"
                              labelKey="name"
                              multiple
                              onChange={handleInterestsChange}
                              options={interests}
                              allowNew
                              newSelectionPrefix="Add a new interest: "
                              placeholder="Choose your interests..."
                              selected={selectedInterests}
                            />
                          </Form.Group>
                          <Button
                            variant="primary"
                            type="button"
                            onClick={handleSave}
                          >
                            Save
                          </Button>
                        </Form>
                      ) : (
                        <div>
                          <p>
                            <strong>First Name:</strong> {profile?.firstName}
                          </p>
                          <p>
                            <strong>Last Name:</strong> {profile?.lastName}
                          </p>
                          <p>
                            <strong>Nickname:</strong> {profile?.nickname}
                          </p>
                          <p>
                            <strong>Usual Work Place:</strong> {profile?.labLocation}
                          </p>
                          <p>
                            <strong>Bio:</strong> {profile?.bio}
                          </p>
                          <p>
                            <strong>Skills:</strong> 
                            {profile?.skills?.length > 0
                              ? profile.skills.join(", ")
                              : "No skills added"}
                          </p>
                          <p>
                            <strong>Interests:</strong> 
                            {profile?.interests?.length > 0
                              ? profile.interests.join(", ")
                              : "No interests added"}
                          </p>
                          <p>
                            <strong>Projects:</strong> 
                            {profile?.projects?.length > 0 ? (
                              profile.projects.map((project, index) => (
                                <div key={index}>
                                  <strong>{project.name}</strong>
                                  <p>{project.description}</p>
                                </div>
                              ))
                            ) : (
                              <p>No projects added</p>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
