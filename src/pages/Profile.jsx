import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Image } from "react-bootstrap";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Avatar from "../multimedia/Images/Avatar.jpg";
import ProjectList from "../components/ProjectList";
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
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Project from "./Project";

// Componente Profile: Responsável por exibir o perfil do utilizador logado e permitir a edição do mesmo

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
  const [resolveOnSkillTypeSelected, setResolveOnSkillTypeSelected] = useState(null);
  const isOwnProfile = user?.id == userId;
  const { t } = useTranslation();

 
  

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    labLocation: "",
    bio: "",
  });

  // Função para obter os dados do utilizador e preencher os campos do formulário
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

  // Função para preencher os campos do formulário com os dados do utilizador
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

  // Função para selecionar o tipo de skill ou interesse
  const onTypeSelect = (type) => {
    setSelectedType(type);
    if (resolveOnSkillTypeSelected) {
      resolveOnSkillTypeSelected(type);
      setResolveOnSkillTypeSelected(null);
    }
  };

  // Função para abrir o modal de adição de skill ou interesse (escolhendo o tipo de skill ou interesse)
  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Função para fechar o modal de adição de skill ou interesse
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Função para fazer o upload da imagem do utilizador
  const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    setImage(uploadedImage);

  // Preview da imagem (antes de ser feito o upload)
    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  // Função para guardar as alterações feitas no perfil do utilizador
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

  // Função para atualizar o estado dos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Função para adicionar ou remover skills
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
            skill.skillType = await skillTypeSelected;
            skill.projetcId = 0;
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
      for (const skill of removedSkills) {
        try {
          const result = await deleteSkill(token, skill);
        } catch (error) {
          console.error("Error deleting skill:", error);
        }
      }
    }
    setSelectedSkills(selected);
  };

  // Função para adicionar ou remover interesses
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
            interest.projectId = 0;
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
                    
                    <hr />
                    </Col>
                    <div style={{ display: "flex", justifyContent: "center" }}>
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
};

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
                        ? "Private Profile"
                        : "Public Profile"}
                    </span>
                  </div>
                )}
                <Row>
                  <Col md={3} className="text-center mb-3">
                    <Image
                      src={imagePreview || profile?.userPhoto || Avatar}
                      alt="Profile"
                      roundedCircle
                      className="profile-image"
                    />
                    {editMode && (
                      <div className="mt-3">
                        <Form.Group>
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
                        {editMode ? (
                          <Form>
                            <Form.Group>
                              <Form.Label>{t("First Name:")}</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                value={formValues.firstName}
                                onChange={handleChange}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>{t("Last Name:")}</Form.Label>
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
                              {t("Save")}
                            </Button>
                          </Form>
                        ) : (
                          <div>
                            <p>
                              <strong>{t("First Name:")}</strong> {profile?.firstName}
                            </p>
                            <p>
                              <strong>{t("Last Name:")}</strong> {profile?.lastName}
                            </p>
                            <p>
                              <strong>Nickname:</strong> {profile?.nickname}
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
                      <Col md={3} style={{ marginLeft: "0px" }}>
                        <h4 style={{ fontSize: "1rem" }}>{t("Skills")}</h4>
                        {isOwnProfile ? (
                          <Typeahead
                            id="skills-typeahead"
                            labelKey="name"
                            multiple
                            onChange={handleSkillsChange}
                            options={skills}
                            allowNew
                            newSelectionPrefix="Add a new skill: "
                            placeholder= {t("Choose your skills...")}
                            selected={selectedSkills}
                          />
                        ) : (
                          <div>
                            {selectedSkills.map((skill, index) => (
                              <span key={index} className="user-pill">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        <h4 style={{ fontSize: "1rem", marginTop: "40px" }}>
                          {t("Interests")}
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
                            placeholder= {t("Choose your interests...")}
                            selected={selectedInterests}
                          />
                        ) : (
                          <div>
                            {selectedInterests.map((interest, index) => (
                              <span key={index} className="user-pill">
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </Col>
                      <Col
                        md={5}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          paddingLeft: "2rem",
                        }}
                      >
                        <ProjectList userId={userId}/>
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
