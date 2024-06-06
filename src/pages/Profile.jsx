import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Avatar from "../multimedia/Images/Avatar.jpg";
import { findUserById, uploadUserPhoto } from "../services/userServices";
import Cookies from "js-cookie";
import userStore from "../stores/userStore";
import { PencilSquare } from "react-bootstrap-icons";
import "./Profile.css";
import { FiLock, FiUnlock } from "react-icons/fi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { user } = userStore.getState();
  const token = Cookies.get("authToken");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);

    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.onloadend = function (e) {
      const imagePreview = document.querySelector(".user-image");
      imagePreview.src = reader.result;
    };
  };

  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);

    uploadUserPhoto(image, token)
      .then((response) => {
        console.log(response);
        if (response.data) {
          userStore.update({ ...user, image: response.data.image });
        } else {
          console.error("Error uploading image:", response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (user && user.id) {
      findUserById(token, user.id)
        .then((userFromServer) => {
          console.log(userFromServer);
          setProfile(userFromServer);
        })
        .catch((error) => console.error(error));
    }
  }, [token, user]);

  return (
    <>
      <Header className="profile-header" />
      <div className="profile-flex-container">
        <div className="profile-sidebar">
          <Sidebar />
        </div>
        <div className="profile-main-content">
          <Container fluid>
            <Row>
              <Col md={12}>
                <Card className="profile-card">
                  <Card.Img
                    className="profile-card-img"
                    src={user?.image ? user.image : Avatar}
                  />
                  <Card.Header className="profile-card-header">
                    <Card.Img
                      className="profile-card-img"
                      src={user?.image ? user.image : Avatar}
                    />
                    <div className="profile-nameedit">
                      {`${user?.firstName} ${user?.lastName}`}

                      <Button
                        variant="outline-secondary"
                        onClick={() => setEditMode(!editMode)}
                        className="profile-edit-button"
                      >
                        <PencilSquare />
                      </Button>
                    </div>
                  </Card.Header>
                  <Row className="g-0">
                    <Col md={4}>
                      {editMode && (
                        <>
                          <input type="file" onChange={handleImageUpload} />
                        </>
                      )}
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <div>
                          {editMode ? (
                            <Form>
                              <Form.Group>
                                <Form.Label>First Name:</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="First Name"
                                  defaultValue={profile?.firstName}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Last Name:</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Last Name"
                                  defaultValue={profile?.lastName}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Nickname:</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Nickname"
                                  defaultValue={profile?.nickname}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Usual Work Place:</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Usual Work Place"
                                  defaultValue={profile?.labLocation}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Bio:</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Bio"
                                  defaultValue={profile?.bio}
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
                            <>
                              <Card.Text className="profile-info-text">
                                <strong>First Name:</strong>{" "}
                                {profile?.firstName || ""}
                              </Card.Text>
                              <Card.Text className="profile-info-text">
                                <strong>Last Name:</strong>{" "}
                                {profile?.lastName || ""}
                              </Card.Text>
                              <Card.Text className="profile-info-text">
                                <strong>Nickname:</strong>{" "}
                                {profile?.nickname || ""}
                              </Card.Text>
                              <Card.Text className="profile-info-text">
                                <strong>Usual Work Place:</strong>{" "}
                                {profile?.labLocation || ""}
                              </Card.Text>
                              <Card.Text className="profile-info-text">
                                <strong>Bio:</strong> {profile?.bio || ""}
                              </Card.Text>
                              <Card.Text className="profile-info-text">
                                <strong>Skills:</strong>{" "}
                                {profile?.skills.length > 0
                                  ? profile.skills.join(", ")
                                  : "No skills added"}
                              </Card.Text>
                              <Card.Text className="profile-info-text">
                                <strong>Interests:</strong>{" "}
                                {profile?.interests.length > 0
                                  ? profile.interests.join(", ")
                                  : "No interests added"}
                              </Card.Text>
                              <Card.Text className="profile-info-text">
                                <strong>Projects:</strong>{" "}
                                {profile?.projects.length > 0
                                  ? profile.projects.map((project, index) => (
                                      <div key={index}>
                                        <strong>{project.name}</strong>
                                        <p>{project.description}</p>
                                      </div>
                                    ))
                                  : "No projects added"}
                              </Card.Text>
                            </>
                          )}
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Profile;
