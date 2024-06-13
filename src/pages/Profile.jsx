import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Avatar from "../multimedia/Images/Avatar.jpg";
import { findUserById, uploadUserPhoto, updateUser, setPrivacy } from "../services/userServices";
import Cookies from "js-cookie";
import userStore from "../stores/userStore";
import { PencilSquare, LockFill, UnlockFill } from "react-bootstrap-icons";
import { getLabs } from "../services/labServices";
import { Typeahead } from 'react-bootstrap-typeahead';
import { getSkills, createSkill, deleteSkill, getSkillTypes } from "../services/skillServices";
import { getInterests, createInterest, deleteInterest, getInterestTypes } from "../services/interestServices";
import "./Profile.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import TypeModal from "../components/Modals/TypeModal";
import { set } from "react-hook-form";

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
  const [interestTypes, setInterestTypes] = useState([]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [projects, setProjects] = useState([]);
  const [resolveOnSkillTypeSelected, setResolveOnSkillTypeSelected] = useState(null); // Add this line
  const [formValues, setFormValues] = useState({
    
    firstName: '',
    lastName: '',
    nickname: '',
    labLocation: '',
    bio: '',
  });

  // Fetch user data and set initial profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.id) {
          const userFromServer = await findUserById(token, user.id);
          setProfile(userFromServer);

          const [allLabs, allSkills, allInterests, skillTypes, interestTypes] = await Promise.all([
            getLabs(token),
            getSkills(token),
            getInterests(token),
            getSkillTypes(),
            getInterestTypes()
          ]);

          setLabs(allLabs);
          setSkills(allSkills.filter(skill => !userFromServer.skills.includes(skill)));
          setInterests(allInterests.filter(interest => !userFromServer.interests.includes(interest)));
          setSkillTypes(skillTypes);
          setInterestTypes(interestTypes);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [token, user]);

  // Update form values and selected skills/interests when profile changes
  useEffect(() => {
    if (profile) {
      console.log(profile); // This will be called every time profile is updated
      setFormValues({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        nickname: profile.nickname || '',
        labLocation: profile.labLocation || '',
        bio: profile.bio || '',
      });
      setSelectedSkills(profile.skills || []);
      setSelectedInterests(profile.interests || []);
      setProjects(profile.projects || []); // Add this line
    }
  }, [profile]);

  const [showModal, setShowModal] = useState(false);
const [modalType, setModalType] = useState('');
const onTypeSelect = (type) => {
  setSelectedType(type);
  if (resolveOnSkillTypeSelected) {
    resolveOnSkillTypeSelected(type);
    setResolveOnSkillTypeSelected(null);
  }
  // Add the selected type to the skill or interest here
};
const handleOpenModal = (type) => {
  setModalType(type);
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
};

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
    console.log('Selected:', selected); // Check the selected array
    console.log('Token:', token); // Check the token
  
    if (selected.length > selectedSkills.length) {
      const newSkills = selected.filter(skill => !selectedSkills.some(s => s.name === skill.name));
      for (const skill of newSkills) {
        console.log('New skill:', skill); // Check the skill object
        try {
          if (!skills.some(s => s.name === skill.name)) {
            setModalType(skill.name);
            const skillTypeSelected = new Promise(resolve => {
              setResolveOnSkillTypeSelected(() => resolve);
            });
            handleOpenModal('skill');
            skill.skillType = await skillTypeSelected;
            skill.projetcId = 0;
            skill.id = null;
            delete skill.customOption;
            console.log('Skill with type:', skill); // Check the skill object
            const result = await createSkill(token, skill);
            setSkills(prevSkills => [...prevSkills, result]);
            console.log('Create skill result:', result);
            setSelectedType('') // Check the result of createSkill
          } else { // Check the result of createSkill
          
          try{
            const result = await createSkill(token, skill);
            console.log('Create skill result:', result); // Check the result of createSkill
          }
          catch (error) {
            console.error("Error creating skill:", error);
          }
        }
        } catch (error) {
          console.error("Error creating skill:", error);
        }
      }

    } else if (selected.length < selectedSkills.length) {
      const removedSkills = selectedSkills.filter(skill => !selected.some(s => s.name === skill.name));
      for (const skill of removedSkills) {
        console.log('Removed skill:', skill); // Check the skill object
        try {
          const result = await deleteSkill(token, skill);
          console.log('Delete skill result:', result); // Check the result of deleteSkill
        } catch (error) {
          console.error("Error deleting skill:", error);
        }
      }
    }

    setSelectedSkills(selected);
}

  const handleInterestsChange = async (selected) => {
    if (selected.length > selectedInterests.length) {
      const newInterests = selected.filter(interest => !selectedInterests.some(i => i.name === interest.name));
      for (const interest of newInterests) {
        try {
          if(!interests.some(i => i.name === interest.name)){
            setModalType(interest.name);
            const interestTypeSelected = new Promise(resolve => {
              setResolveOnSkillTypeSelected(() => resolve);
            });
            handleOpenModal('interest');
            interest.interestType = await interestTypeSelected;
            interest.projectId = 0;
            interest.id = null;
            delete interest.customOption;
            console.log('Interest with type:', interest); // Check the interest object
            const result = await createInterest(token, interest);
            setInterests(prevInterests => [...prevInterests, result]);
            console.log('Create interest result:', result); // Check the result of createInterest
            setSelectedType('') // Check the result of createInterest
          } else {
            try{
            const result = await createInterest(token, interest);
          console.log('Create interest result:', result); 
          // Check the result of createInterest
          } catch (error) {
            console.error("Error creating interest:", error);
          
          }
        }
        } catch (error) {
          console.error("Error creating interest:", error);
        }
      }
    } else if (selected.length < selectedInterests.length) {
      const removedInterests = selectedInterests.filter(interest => !selected.some(i => i.name === interest.name));
      for (const interest of removedInterests) {
        console.log('Removed interest:', interest); // Check the interest object
        try {
         const result = await deleteInterest(token, interest);
         console.log('Delete interest result:', result); // Check the result of deleteInterest
        } catch (error) {
          console.error("Error deleting interest:", error);
        }
      }
    }
    setSelectedInterests(selected);
  };

  const togglePrivacy = async () => {
    try {
      const newPrivacyStatus = profile.isPrivate ? 0 : 1;
      await setPrivacy(token);
      setProfile(prevProfile => ({
        ...prevProfile,
        isPrivate: newPrivacyStatus
      }));
    } catch (error) {
      console.error("Error changing privacy status:", error);
    }
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
                <div className="privacy-icon">
                  <Button variant="outline-secondary" onClick={togglePrivacy}>
                    {profile?.isPrivate ? <LockFill /> : <UnlockFill />}
                  </Button>
                </div>
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
                          <p>
                            <strong>Projects:</strong> 
                          </p>
                          {profile?.projects?.length > 0 ? (
                            profile.projects.map((project, index) => (
                              <div key={index}>
                                <strong>{project}</strong>
                              
                              </div>
                            ))
                          ) : (
                            <p>No projects added</p>
                          )}
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
      <TypeModal
  show={showModal}
  onHide={handleCloseModal}
  title={`Add ${modalType}`}
  type={modalType}
  types={modalType === 'skill' ? skillTypes : interestTypes}
  onTypeSelect={onTypeSelect}
/>
    </>
  );
};

export default Profile;
