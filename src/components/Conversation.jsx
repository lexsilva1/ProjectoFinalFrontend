import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import ConversationCard from '../components/Cards/ConversationCard'; 
import userStore from '../stores/userStore';
import { getMessages } from '../services/messageServices';

import './Conversation.css';
import Cookies from 'js-cookie';
import useMsgSocket from '../Websockets/messagesWebsocket';

const Conversation = () => {

  const token = Cookies.get('authToken');
  const [newMessage, setNewMessage] = useState('');
  const senderId = userStore((state) => state.user.id);
  const senderName = userStore((state) => state.user.name);
  const receiverId = userStore((state) => state.selectedUserMessages);
  console.log(receiverId);
    
  const {sendMessage, setMessages, messages} = useMsgSocket(token, receiverId);
 console.log(messages);
  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };
  useEffect(() => {
    getMessages(token, receiverId).then((messages) => {
      setMessages(messages);
    });
    
  }, [receiverId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
        sendMessage(newMessage);
      
    } catch (error) {
        console.error(error);
        }
  
    setNewMessage('');
  };

  return (
    <Container fluid className="conversation">
      {(Array.isArray(messages) && <div className="conversation-cards">
        {messages.map((conversation, index) => (
          <ConversationCard key={index} conversation={conversation} />
        ))}
      </div>)}
      <Form onSubmit={handleSubmit} className="message-form">
        <Form.Group controlId="textAreaExample">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Message"
            value={newMessage}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="info" type="submit" className="float-end">
          Send
        </Button>
      </Form>
    </Container>
  );
};

export default Conversation;