import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Image } from "react-bootstrap";
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
import { useParams } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { user } = userStore.getState();
  const { userId } = useParams();
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
  const [selectedType, setSelectedType] = useState("");
  const [projects, setProjects] = useState([]);
  const [resolveOnSkillTypeSelected, setResolveOnSkillTypeSelected] =
    useState(null);
  const isOwnProfile = user?.id == userId;

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    labLocation: "",
    bio: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const userFromServer = await findUserById(token, userId);
          setProfile(userFromServer);

          const [allLabs, allSkills, allInterests, fetchedSkillTypes, fetchedInterestTypes] =
            await Promise.all([
              getLabs(token),
              getSkills(token),
              getInterests(token),
              getSkillTypes(),
              getInterestTypes(),
            ]);

          setLabs(allLabs);
          setSkills(
            allSkills.filter((skill) => !userFromServer.skills.some((s) => s.id === skill.id))
          );
          setInterests(
            allInterests.filter((interest) => !userFromServer.interests.some((i) => i.id === interest.id))
          );
          setSkillTypes(fetchedSkillTypes);
          setInterestTypes(fetchedInterestTypes);

          if (user?.id !== userFromServer.id) {
            setEditMode(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId, user, token]);

  useEffect(() => {
    if (profile) {
      setFormValues({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        nickname: profile.nickname || "",
        labLocation: profile.labLocation || "",
        bio: profile.bio || "",
      });
      setSelectedSkills(profile.skills || []);
      setSelectedInterests(profile.interests || []);
      setProjects(profile.projects || []);
    }
  }, [profile]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const onTypeSelect = (type) => {
    setSelectedType(type);
    if (resolveOnSkillTypeSelected) {
      resolveOnSkillTypeSelected(type);
      setResolveOnSkillTypeSelected(null);
    }
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
        finalImageURL = response;
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
        const updatedUser = await findUserById(token, userId);
        setProfile(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
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
    if (selected.length > selectedSkills.length) {
      const newSkills = selected.filter(
        (skill) => !selectedSkills.some((s) => s.name === skill.name)
      );
      for (const skill of newSkills) {
        try {
          if (!skills.some((s) => s.name === skill.name)) {
            setModalType(skill.name);
            const skillTypeSelected = new Promise((resolve) => {
              setResolveOnSkillTypeSelected(() => resolve);
            });
            handleOpenModal("skill");
            const skillType = await skillTypeSelected;
            await createSkill(token, { name: skill.name, type: skillType });
          }
        } catch (error) {
          console.error("Error creating skill:", error);
        }
      }
    } else {
      const removedSkills = selectedSkills.filter(
        (skill) => !selected.some((s) => s.name === skill.name)
      );
      for (const skill of removedSkills) {
        try {
          await deleteSkill(token, skill.id);
        } catch (error) {
          console.error("Error deleting skill:", error);
        }
      }
    }
    const updatedSkills = await getSkills(token);
    setSkills(updatedSkills.filter((skill) => !selected.some((s) => s.name === skill.name)));
    setSelectedSkills(selected);
  };

  const handleInterestsChange = async (selected) => {
    if (selected.length > selectedInterests.length) {
      const newInterests = selected.filter(
        (interest) => !selectedInterests.some((i) => i.name === interest.name)
      );
      for (const interest of newInterests) {
        try {
          if (!interests.some((i) => i.name === interest.name)) {
            setModalType(interest.name);
            const interestTypeSelected = new Promise((resolve) => {
              setResolveOnSkillTypeSelected(() => resolve);
            });
            handleOpenModal("interest");
            const interestType = await interestTypeSelected;
            await createInterest(token, { name: interest.name, type: interestType });
          }
        } catch (error) {
          console.error("Error creating interest:", error);
        }
      }
    } else {
      const removedInterests = selectedInterests.filter(
        (interest) => !selected.some((i) => i.name === interest.name)
      );
      for (const interest of removedInterests) {
        try {
          await deleteInterest(token, interest.id);
        } catch (error) {
          console.error("Error deleting interest:", error);
        }
      }
    }
    const updatedInterests = await getInterests(token);
    setInterests(updatedInterests.filter((interest) => !selected.some((i) => i.name === interest.name)));
    setSelectedInterests(selected);
  };

  const togglePrivacy = async () => {
    try {
      const newPrivacyStatus = profile.isPrivate ? 0 : 1;
      await setPrivacy(token, newPrivacyStatus);
      setProfile((prevProfile) => ({
        ...prevProfile,
        isPrivate: newPrivacyStatus,
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
          <div>
            <Sidebar />
          </div>
          
          <Col md={9} className="profile-main-content">
            <Card className="profile-card">
              <Card.Body>
                {isOwnProfile && (
                  <div className="privacy-icon">
                    <Button variant="outline-secondary" onClick={togglePrivacy}>
                      {profile?.isPrivate ? <LockFill /> : <UnlockFill />}
                    </Button>
                  </div>
                )}
                <Row>
                  <Col md={4} className="text-center mb-3">
                    <Image
                      src={imagePreview || profile?.userPhoto || Avatar}
                      alt="Profile"
                      roundedCircle
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
                      {profile?.firstName} {profile?.lastName}
                      {isOwnProfile && (
                        <Button
                          variant="outline-secondary"
                          onClick={() => setEditMode(!editMode)}
                          className="profile-edit-button"
                        >
                          <PencilSquare />
                        </Button>
                      )}
                    </h2>
                    <hr />
                    <Row>
                      <Col md={4}>
                        <h4>Profile Information</h4>
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
                            <p><strong>First Name:</strong> {profile?.firstName}</p>
                            <p><strong>Last Name:</strong> {profile?.lastName}</p>
                            <p><strong>Nickname:</strong> {profile?.nickname}</p>
                            <p><strong>Usual Work Place:</strong> {profile?.labLocation}</p>
                            <p><strong>Bio:</strong> {profile?.bio}</p>
                          </div>
                        )}
                      </Col>
                      <Col md={4}>
                        <h4>Skills</h4>
                        {isOwnProfile ? (
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
                        ) : (
                          <div>
                            {selectedSkills.map((skill, index) => (
                              <span key={index} className="user-pill">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <h4>Interests</h4>
                        {isOwnProfile ? (
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
                        ) : (
                          <div>
                            {selectedInterests.map((interest, index) => (
                              <span key={index} className="user-pill">
                                {interest.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </Col>
                      <Col md={4}>
                        <h4>Projects</h4>
                        {profile?.projects?.length > 0 ? (
                          profile.projects.map((project, index) => (
                            <div key={index}>
                              <strong>{project.name}</strong>
                            </div>
                          ))
                        ) : (
                          <p>No projects added</p>
                        )}
                      </Col>
                    </Row>
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
        types={modalType === "skill" ? skillTypes : interestTypes}
        onTypeSelect={onTypeSelect}
      />
    </>
  );
};

export default Profile;
