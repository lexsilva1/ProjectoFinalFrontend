import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Avatar from "../multimedia/Images/Avatar.jpg";
import { findUserById, uploadUserPhoto } from "../services/userServices";
import Cookies from "js-cookie";
import userStore from "../stores/userStore";
import { PencilSquare } from "react-bootstrap-icons";

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
        })
        .catch((error) => console.error(error));
    }
  }, [token, user]);

  return (
    <>
      <Header style={{ top: 0, width: "100%", height: "60px", zIndex: 1000 }} />
      <div style={{ display: "flex" }}>
        <div style={{ flex: "0 0 200px" }}>
          <Sidebar />
        </div>
        <div style={{ flex: "1" }}>
          <Container fluid>
            <Row>
              <Col md={12}>
                <Card
                  style={{ width: "80%", height: "120%", position: "relative" }}
                >
                  <Card.Img
                    src={user?.image ? user.image : Avatar}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "20px",
                      left: "20%",
                      transform: "translateX(-50%)",
                    }}
                  />
                  <Card.Header
                    style={{
                      backgroundColor: "var(--bs-body-color)",
                      color: "white",
                      paddingTop: "120px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ position: 'absolute', top: '220px', left: '20%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
                      <Card.Title className="user-name2">
                        {`${user?.firstName} ${user?.lastName}`}
                      </Card.Title>
                      <Button variant="outline-secondary" onClick={() => setEditMode(!editMode)} style={{ marginLeft: '10px' }}>
                        <PencilSquare />
                      </Button>
                    </div>
                  </Card.Header>
                  <Row className="g-0">
                    <Col md={4}>
                      {editMode && (
                        <>
                          <input type="file" onChange={handleImageUpload} />
                          <Button variant="outline-secondary" className="mt-2">
                            Change profile photo
                          </Button>
                        </>
                      )}
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <div style={{ marginTop: "20px" }}>
                          {editMode ? (
                            <Form>
                              <Form.Group>
                                <Form.Label>First Name:</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="First Name"
                                  defaultValue={user?.firstName}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Last Name:</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Last Name"
                                  defaultValue={user?.lastName}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Nickname:</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Nickname"
                                  defaultValue={user?.nickname}
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
                              <Card.Text>
                                <strong>First Name:</strong>{" "}
                                {user?.firstName || ""}
                              </Card.Text>
                              <Card.Text>
                                <strong>Last Name:</strong>{" "}
                                {user?.lastName || ""}
                              </Card.Text>
                              <Card.Text>
                                <strong>Nickname:</strong>{" "}
                                {user?.nickname || ""}
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
}
  
  export default Profile;