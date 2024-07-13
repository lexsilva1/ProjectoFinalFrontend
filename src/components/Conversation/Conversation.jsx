import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import ConversationCard from '../Cards/ConversationCard/ConversationCard';
import userStore from '../../stores/userStore';
import { getMessages } from '../../services/messageServices';
import './Conversation.css';
import Cookies from 'js-cookie';
import useMsgSocket from '../../Websockets/messagesWebsocket';

/* Conversation component is responsible for rendering the messages between two users. 
It uses the useMsgSocket hook to establish a connection with the server and send and receive messages. 
It also uses the getMessages function to fetch the messages between the two users. */

const Conversation = () => {

  const token = Cookies.get('authToken');
  const [newMessage, setNewMessage] = useState('');
  const senderId = userStore((state) => state.user.id);
  const senderName = userStore((state) => state.user.name);
  const receiverId = userStore((state) => state.selectedUserMessages);

    
  const {sendMessage, setMessages, messages} = useMsgSocket(token, receiverId);

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
  <div className="conversation-message"> 
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
    </Form>   
    <Button variant="info" type="submit" className="float-end send-button">
      Send
    </Button>
  </div>
</Container>
  );
};

export default Conversation;