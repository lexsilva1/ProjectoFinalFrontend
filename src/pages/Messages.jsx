import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import Conversation from '../components/Conversation';
import UserList from '../components/UserList';
import { useState, useEffect } from 'react';
import { getMessages, getLastMessages, sendMessage } from '../services/messageServices';
import userStore from '../stores/userStore';
import Cookies from 'js-cookie';
import MessageSidebar from '../components/MessageSidebar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

const Messages = () => {
  const userList = userStore((state) => state.userList);
  const setSelectedMessages = userStore((state) => state.setSelectedMessages);
  const selectedUserMessages = userStore((state) => state.selectedUserMessages);
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  const resetSelectedUserMessages = () => {
    navigate("/messages");
    userStore.setState({ selectedUserMessages: null });
  };
  console.log(selectedUserMessages);



  useEffect(() => {
    getLastMessages(token).then((messages) => {
      userStore.setState({ userList: messages });
    });
  }, []);


  return (
    <>
      <Header />
      <Row>
        <Col xs={3}>
          <Sidebar />
        </Col>
        <Container className='messages-container'>
          <div>
            <Row>
              <Col md={2} style={{ backgroundColor: "var(--details-color)",  border: "none", borderRadius: "10px", margin: "0" }}>
              <MessageSidebar onInboxClick={resetSelectedUserMessages} />
              </Col>
              <Col md={10}>
                {selectedUserMessages === null ? (
                  <UserList users={userList} />
                ) : (
                  <Conversation />
                )}
              </Col>
            </Row>
          </div>
        </Container>
      </Row>
    </>
  );
};

export default Messages;