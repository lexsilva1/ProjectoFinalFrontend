import React, { useState, useEffect } from "react";
import {Container,Row, Col, Card, Button, Form, Image,} from "react-bootstrap";
import Sidebar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import ProjectList from "../../components/ProjectList/ProjectList";
import {findUserById,uploadUserPhoto, updateUser, setPrivacy,} from "../../services/userServices";
import Cookies from "js-cookie";
import userStore from "../../stores/userStore";
import { PencilSquare, LockFill, UnlockFill } from "react-bootstrap-icons";
import { getLabs } from "../../services/labServices";
import { Typeahead } from "react-bootstrap-typeahead";
import {getSkills,createSkill,deleteSkill,getSkillTypes,} from "../../services/skillServices";
import {getInterests,createInterest,deleteInterest,getInterestTypes,
} from "../../services/interestServices";
import "./Profile.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import TypeModal from "../../components/Modals/TypeModal/TypeModal";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


// Profile Component: Responsible for displaying the profile of the logged-in user and allowing editing

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
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    labLocation: "",
    bio: "",
  });

  // Function to fetch user data and populate form fields
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const userFromServer = await findUserById(token, userId);
          console.log(userFromServer);
          setProfile(userFromServer);

          const [
            allLabs,
            allSkills,
            allInterests,
            fetchedSkillTypes,
            fetchedInterestTypes,
          ] = await Promise.all([
            getLabs(token),
            getSkills(token),
            getInterests(token),
            getSkillTypes(),
            getInterestTypes(),
          ]);

          setLabs(allLabs);
          setSkills(
            allSkills.filter(
              (skill) => !userFromServer.skills.some((s) => s.id === skill.id)
            )
          );
          setInterests(
            allInterests.filter(
              (interest) =>
                !userFromServer.interests.some((i) => i.id === interest.id)
            )
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

  // Function to populate the form fields with user data
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

  // Function to handle the selection of a skill or interest type
  const onTypeSelect = (type) => {
    setSelectedType(type);
    if (resolveOnSkillTypeSelected) {
      resolveOnSkillTypeSelected(type);
      setResolveOnSkillTypeSelected(null);
    }
  };

  // Function to open the modal for adding a skill or interest
  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Function to close the modal for adding a skill or interest
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to upload an image
  const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    setImage(uploadedImage);

    // preview the image before uploading
    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  // Function to save the user profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    let finalImageURL = profile.userPhoto || Avatar;

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

        userStore.setState((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            firstName: userUpdate.firstName,
            lastName: userUpdate.lastName,
            image: userUpdate.userPhoto + `?${new Date().getTime()}`,
          },
        }));

        const updatedUser = await findUserById(token, userId);
        setProfile(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  // Funtion to handle changes in the form fields and update the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Function to add or remove skills
  const handleSkillsChange = async (selected) => {
    debugger;
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
            skill.skillType = await skillTypeSelected;
            skill.projectName = null;
            skill.id = null;
            delete skill.customOption;
            const result = await createSkill(token, skill);
            setSkills((prevSkills) => [...prevSkills, result]);
            setSelectedType("");
          } else {
            const result = await createSkill(token, skill);
          }
        } catch (error) {
          console.error("Error creating skill:", error);
        }
      }
    } else if (selected.length < selectedSkills.length) {
      const removedSkills = selectedSkills.filter(
        (skill) => !selected.some((s) => s.name === skill.name)
      );
      console.log("removedSkills", removedSkills);
      console.log("selectedSkills", selectedSkills);
      console.log("selected", selected);
      for (const skill of removedSkills) {
        try {
          console.log("skill", skill);
          const result = await deleteSkill(token, skill);
        } catch (error) {
          console.error("Error deleting skill:", error);
        }
      }
    }
    setSelectedSkills(selected);
  };

  // Function to add or remove interests
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
            interest.interestType = await interestTypeSelected;
            interest.projectName = null;
            interest.id = null;
            delete interest.customOption;
            const result = await createInterest(token, interest);
            setInterests((prevInterests) => [...prevInterests, result]);
            setSelectedType("");
          } else {
            const result = await createInterest(token, interest);
          }
        } catch (error) {
          console.error("Error creating interest:", error);
        }
      }
    } else if (selected.length < selectedInterests.length) {
      const removedInterests = selectedInterests.filter(
        (interest) => !selected.some((i) => i.name === interest.name)
      );

      for (const interest of removedInterests) {
        try {
          const result = await deleteInterest(token, interest);
        } catch (error) {
          console.error("Error deleting interest:", error);
        }
      }
    }
    setSelectedInterests(selected);
    console.log("profile selectedInterests", selectedInterests);
    console.log("profile selected", selected);
  };

  const togglePrivacy = async () => {
    try {
      const newPrivacyStatus = profile.privacy ? false : true;
      await setPrivacy(token, newPrivacyStatus);
      setProfile((prevProfile) => ({
        ...prevProfile,
        privacy: newPrivacyStatus,
      }));
    } catch (error) {
      console.error("Error changing privacy status:", error);
    }
  };

  if (profile) {
    // Ensure profile is defined before accessing its properties
    if (profile.privacy === true && !isOwnProfile) {
      return (
        <>
          <Header />
          <Container fluid className="profile-container">
            <Row className="profile-row">
              <div>
                <Sidebar />
              </div>

              <Col md={12} className="profile-main-content">
                <Card className="profile-card">
                  <Card.Body>
                    <Row>
                      <Col md={3} className="text-center mb-3">
                        <Image
                          src={imagePreview || profile?.userPhoto || Avatar}
                          alt="Profile"
                          roundedCircle
                          className="profile-image"
                        />
                      </Col>
                      <Col md={8}>
                        <h2 className="profile-name">
                          {profile?.firstName} {profile?.lastName}
                        </h2>
                      </Col>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <p>{t("This profile is private.")}</p>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      );
    }
  }

  return (
    <>
      <Header />
      <Container fluid className="profile-container">
        <Row className="profile-row">
          <Col md={12} className="profile-main-content">
            <Card className="profile-card">
              <div
                style={{
                  backgroundColor: "var(--details-color)",
                  height: "110px",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                  marginTop: "-32px",
                }}
              ></div>
              <Card.Body style={{ marginTop: "-71px" }}>
                {isOwnProfile && (
                  <div className="privacy-icon">
                    <Button
                      className="iconPrivacy"
                      variant="outline-secondary"
                      onClick={togglePrivacy}
                    >
                      {profile?.privacy ? <LockFill /> : <UnlockFill />}
                    </Button>
                    <span className="privacy-text">
                      {profile?.privacy
                        ? t("Private Profile")
                        : t("Public Profile")}
                    </span>
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
                    {isOwnProfile && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => setEditMode(!editMode)}
                        className="profile-edit-button"
                      >
                        <PencilSquare />
                      </Button>
                    )}
                    {editMode && (
                      <div className="mt-3" style={{ textAlign: "center" }}>
                        <Form.Group>
                          <Form.Control
                            type="file"
                            style={{
                              width: "60%",
                              textAlign: "center",
                              marginLeft: "20%",
                            }}
                            onChange={handleImageUpload}
                          />
                        </Form.Group>
                      </div>
                    )}
                    {editMode ? (
                      <Form>
                        <Form.Group className="edit-profile">
                          <Form.Label>{t("First Name:")}</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formValues.firstName}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="edit-profile">
                          <Form.Label>{t("Last Name:")}</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formValues.lastName}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="edit-profile">
                          <Form.Label>Nickname:</Form.Label>
                          <Form.Control
                            type="text"
                            name="nickname"
                            value={formValues.nickname}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="edit-profile">
                          <Form.Label>{t("Usual Work Place:")}</Form.Label>
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
                        <Form.Group className="edit-profile">
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
                          style={{ width: "40%", marginTop: "10px" }}
                          onClick={handleSave}
                        >
                          {t("Save")}
                        </Button>
                      </Form>
                    ) : (
                      <div className="user-info-profile">
                        <p>
                          <strong>{t("First Name:")}</strong>{" "}
                          {profile?.firstName}
                        </p>
                        <p>
                          <strong>{t("Last Name:")}</strong> {profile?.lastName}
                        </p>
                        <p>
                          <strong>{t("Nickname")}:</strong> {profile?.nickname}
                        </p>
                        <p>
                          <strong>{t("Usual Work Place:")}</strong>{" "}
                          {profile?.labLocation}
                        </p>
                        <p>
                          <strong>Bio:</strong> {profile?.bio}
                        </p>
                      </div>
                    )}
                  </Col>

                  <Col md={8}>
                    <h2 className="profile-name">
                      {profile?.firstName} {profile?.lastName}
                    </h2>

                    <Row>
                      <Col
                        md={6}
                        style={{ marginLeft: "0px", marginTop: "3%" }}
                      >
                        <h4 style={{ fontSize: "1rem" }}>
                          <strong>{t("Skills")}:</strong>
                        </h4>
                        {isOwnProfile ? (
                          <Typeahead
                            id="skills-typeahead"
                            labelKey="name"
                            multiple
                            onChange={handleSkillsChange}
                            options={skills}
                            allowNew
                            newSelectionPrefix="Add a new skill: "
                            placeholder={t("Choose your skills...")}
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
                        <h4 style={{ fontSize: "1rem", marginTop: "40px" }}>
                          <strong>{t("Interests")}:</strong>
                        </h4>
                        {isOwnProfile ? (
                          <Typeahead
                            id="interests-typeahead"
                            labelKey="name"
                            multiple
                            onChange={handleInterestsChange}
                            options={interests}
                            allowNew
                            newSelectionPrefix="Add a new interest: "
                            placeholder={t("Choose your interests...")}
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
                      <Col
                        md={6}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          paddingLeft: "2rem",
                          marginTop: "3%",
                        }}
                      >
                        <ProjectList userId={userId} />
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
