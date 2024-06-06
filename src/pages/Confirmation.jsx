import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import registerImage from "../multimedia/Images/registerImage.jpg";
import "./Confirmation.css";
import { useParams } from "react-router-dom";
import Avatar from "../multimedia/Images/Avatar.jpg";
import { getLabs } from "../services/labServices";
import { confirmUser } from "../services/userServices";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import userStore from "../stores/userStore";
import { uploadUserPhoto } from "../services/userServices";

const Confirmation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workPlace, setWorkPlace] = useState("");
  const [nickname, setNickname] = useState("");
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { token } = useParams();
  const [avatar, setAvatar] = useState(Avatar);
  const [labs, setLabs] = useState([]);
  const navigate = useNavigate();
  const [imageURL, setImageURL] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageURL = Avatar;
    console.log("image:", image);
    if (image !== null) {
      try {
        const response = await uploadUserPhoto(image, token);
        console.log("Upload successful:", response);
        finalImageURL = response;
        console.log("finalImageURL:", finalImageURL);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    if (firstName && lastName && workPlace) {
      const userConfirmation = {
        firstName,
        lastName,
        labLocation: workPlace,
        nickname,
        userPhoto: finalImageURL,
        bio,
      };

      await confirmUser(token, userConfirmation)
        .then((response) => {
          console.log("userConfirmation:", userConfirmation);
          Cookies.set("authToken", response);
          userStore.setState({ isLoggedIn: true });
          navigate("/");
        })
        .catch((error) => {
          console.error("Error from confirmUser:", error);
        });
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      <div className="register-image">
        <img src={registerImage} alt="Register" />
        <div className="register-text">
          <h1>Welcome to ForgeXperimental Projects!</h1>
          <p>Let's forge ahead together in project management excellence.</p>
        </div>
      </div>
      <div className="register-spacer"></div>
      <div className="register-form-container">
        <div className="register-form-header">
          <h1>Create your account</h1>
        </div>
        <Form className="register-form" onSubmit={handleSubmit}>
          <Form.Group className="custom-form-group" controlId="formFirstName">
            <Form.Label>
              <span className="required">*</span>First Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            {submitted && !firstName && (
              <div className="error">First Name is required</div>
            )}
          </Form.Group>

          <Form.Group className="custom-form-group" controlId="formLastName">
            <Form.Label>
              <span className="required">*</span>Last Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              onChange={(e) => setLastName(e.target.value)}
            />
            {submitted && !lastName && (
              <div className="error">Last Name is required</div>
            )}
          </Form.Group>

          <Form.Group className="custom-form-group" controlId="formWorkPlace">
            <Form.Label>
              <span className="required">*</span>Usual Work Place
            </Form.Label>
            <Form.Control
              style={{ height: "auto", fontSize: "1em", fontWeight: "normal" }}
              as="select"
              placeholder="Enter usual work place"
              onChange={(e) => setWorkPlace(e.target.value)}
            >
              <option value="">Select a lab</option>
              {labs.map((lab, index) => (
                <option key={index} value={lab.location}>
                  {lab.location}
                </option>
              ))}
            </Form.Control>
            {submitted && !workPlace && (
              <div className="error">Usual Work Place is required</div>
            )}
          </Form.Group>

          <Form.Group className="custom-form-group" controlId="formNickname">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter nickname"
              onChange={(e) => setNickname(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="custom-form-group" controlId="formImage">
            <Form.Label>Image</Form.Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Control
                type="file"
                onChange={handleImageUpload}
                style={{ marginRight: "10px" }}
              />
              <img
                src={avatar}
                alt="Avatar"
                style={{ borderRadius: "50%", width: "100px", height: "100px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="custom-form-group" controlId="formBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter bio"
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: "rgb(0, 0, 0)",
                width: "60%",
                marginTop: "20px",
              }}
            >
              Create
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Confirmation;
