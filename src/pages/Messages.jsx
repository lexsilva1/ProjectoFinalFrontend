import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import Conversation from '../components/Conversation';
import UserList from '../components/UserList';
import { useState, useEffect } from 'react';
import { getMessages, getLastMessages, sendMessage } from '../services/messageServices';
import userstore from '../stores/userStore';
import Cookies from 'js-cookie';
import MessageSidebar from '../components/MessageSidebar';

const Messages = () => {
  const userList = userstore((state) => state.userList);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const selectedUserMessages = userstore((state) => state.selectedUserMessages);
  const token = Cookies.get("authToken");
  const resetSelectedUserMessages = () => {
    userstore.setState({ selectedUserMessages: null });
  };

  useEffect(() => {
    return () => {
      userstore.setState({ selectedUserMessages: null });
    };
  }, []);

  useEffect(() => {
    getLastMessages(token).then((messages) => {
      userstore.setState({ userList: messages });
    });
  }, []);

  useEffect(() => {
    if (selectedUserMessages !== null) {
      getMessages(token, selectedUserMessages).then((messages) => {
        setSelectedMessages(messages);
      });
    }
  }, [selectedUserMessages]);

  return (
    <>
      <Header />
      <Row>
        <Col xs={3}>
          <Sidebar />
        </Col>
        <Container>
          <Row>
            <h1>Messages</h1>
          </Row>
          <div>
            
            <Row>
              <Col md={2} style={{ backgroundColor: "var(--primary-color)" }}>
              <MessageSidebar onInboxClick={resetSelectedUserMessages} />
              </Col>
              <Col md={8}>
                {selectedUserMessages === null ? (
                  <UserList users={userList} />
                ) : (
                  <Conversation conversations={selectedMessages} />
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