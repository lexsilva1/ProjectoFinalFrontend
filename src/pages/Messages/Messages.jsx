
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Conversation from "../../components/Conversation/Conversation";
import UserList from "../../components/UserList";
import { useState, useEffect } from "react";
import {
  getMessages,
  getLastMessages,
  sendMessage,
} from "../../services/messageServices";
import userStore from "../../stores/userStore";
import Cookies from "js-cookie";
import MessageSidebar from "../../components/MessageSidebar/MessageSidebar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Messages.css";
import { set } from "date-fns";


const Messages = () => {
  const userList = userStore((state) => state.userList);
  const setUserList = userStore((state) => state.setUserList);
  const setSelectedMessages = userStore((state) => state.setSelectedMessages);
  const selectedUserMessages = userStore((state) => state.selectedUserMessages);
  const token = Cookies.get("authToken");
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(true);

  const resetSelectedUserMessages = async () => {
    navigate("/messages");
    userStore.setState({ selectedUserMessages: null });
    setSelectedMessages(null);
    setUnreadMessages(false);
const response = await getLastMessages(token);
    setUserList(response);
  };
  console.log('selectedMessages',selectedUserMessages);
  console.log('userList',userList);
const handleUnreadMessages = async () => {
  setUnreadMessages(true);
  const unread = userList.filter((user) => user.read === false);
  setUserList(unread);
  setSearch('');
};


const handleSearch = async (e) => {
  const value = e.target.value;
  setSearch(value); // This sets the state for future renders, not for immediate use below

  if (value.trim() === '') {
    // If search input is empty, reset the userList to its original state
    const response = await getLastMessages(token);
    setUserList(response);
  } else {
    // If search is not empty, filter the userList
    const filteredUsers = userList.filter((user) =>
      user.sender.firstName.toLowerCase().includes(value.toLowerCase()) || 
      user.sender.lastName.toLowerCase().includes(value.toLowerCase())
    );
    setUserList(filteredUsers);
  }
};

  return (
    <>
      <Header />
      <Row>
        <Container
          className="messages-container"
          style={{ marginTop: "120px" }}
        >
          <div>
            <Row>
              <Col md={2} className="side-bar-column">
                <MessageSidebar onInboxClick={() => {resetSelectedUserMessages();setSearch('')}}
                 onSearch={handleSearch} 
                 showUnread={handleUnreadMessages} 
                 unreadMessages={unreadMessages} 
                 setUnreadMessages={setUnreadMessages} 
                 search={search} setSearch={setSearch}/>
              </Col>
              <Col md={10}>
                {selectedUserMessages === null ? (
                  <UserList />
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
