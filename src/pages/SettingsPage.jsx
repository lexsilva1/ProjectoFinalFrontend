import React, { useState, useEffect } from "react";
import {
  getSystemVariables,
  setSystemVariables,
} from "../services/systemServices";
import Cookies from "js-cookie";
import Header from "../components/Header/Header";
import { Container, Form, Button, Card } from "react-bootstrap";
import WarningModal from "../components/Modals/WarningModal/WarningModal";
import { useNavigate } from "react-router-dom";
import {findAllUsers} from "../services/userServices";
import "./SettingsPage.css";

const SettingsPage = () => {
  const [maxUsers, setMaxUsersState] = useState(0);
  const [timeout, settimeoutState] = useState(0);
  const token = Cookies.get("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);

  const handleMaxUsersChange = (e) => setMaxUsersState(e.target.value);
  const handleSessionTimeoutChange = (e) => settimeoutState(e.target.value);

  useEffect(() => {
    const fetchSystemVariables = async () => {
      const systemVariables = await getSystemVariables(token);
      setMaxUsersState(systemVariables.maxUsers);
      settimeoutState(systemVariables.timeout);
    };

    fetchSystemVariables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let systemVariablesDto = {
      maxUsers: maxUsers,
      timeout: timeout,
    };
    try {
      const response = await setSystemVariables(token, systemVariablesDto);
      if (response == "system variables set") {
        setModalMessage(response);
        setModalOpen(true);
      } else {
        setModalMessage("An error occurred while saving the settings");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onCancel = () => {
    setModalOpen(false);
  };

  const onConfirm = () => {
    setModalOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await findAllUsers(token); 
      const managers = allUsers.filter(user => user.role === "Manager");
      setManagers(managers);
    };
  
    fetchUsers();
  }, []);

  const ManagerCard = ({ manager }) => {
    const navigate = useNavigate();
  
    const handleCardClick = () => {
      navigate(`/profile/${manager.id}`);
    };
  
    return (
      <Card onClick={handleCardClick} style={{ cursor: 'pointer', width: '18rem', margin: '10px' }}>
        <Card.Img variant="top" src={manager.userPhoto} alt="Manager Photo" />
        <Card.Body>
          <Card.Title>{`${manager.firstName} ${manager.lastName}`}</Card.Title>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      <Header />
      <div style={{ display: "flex" }}>
        <Container className="settings-container">
          <Card className="settings-card">
            <Card.Header>
              <h1>Application Settings</h1>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formMaxUsers">
                  <Form.Label>Max Users</Form.Label>
                  <Form.Control
                    type="number"
                    value={maxUsers}
                    onChange={handleMaxUsersChange}
                  />
                </Form.Group>
                <Form.Group controlId="formSessionTimeout">
                  <Form.Label>Session Timeout (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={timeout}
                    onChange={handleSessionTimeoutChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Card>
          <div className="managers-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
  {managers.map(manager => (
    <ManagerCard key={manager.id} manager={manager} />
  ))}
</div>
          </Card>
          <WarningModal
            isOpen={modalOpen}
            message={modalMessage}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
          
        </Container>
        
      </div>
    </>
  );
};

export default SettingsPage;
