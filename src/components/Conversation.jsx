import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import ConversationCard from '../components/Cards/ConversationCard'; 
import userstore from '../stores/userStore';
import { sendMessage } from '../services/messageServices';
import './Conversation.css';
import Cookies from 'js-cookie';

const Conversation = ({ conversations }) => {

  const token = Cookies.get('authToken');
  const [newMessage, setNewMessage] = useState('');
  const senderId = userstore((state) => state.user.id);
  const senderName = userstore((state) => state.user.name);
  const receiverId = userstore((state) => state.selectedUserMessages.id);
  const receiverName = userstore((state) => state.selectedUserMessages.name);

  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage.trim() === '') return;
  
    
    try {
      
      const sender = {
     
        id: senderId,
        name: senderName,
        
      };
  
      const receiver = {
       
        id: receiverId,
        name: receiverName,
       
      };
  
      const messageDto = {
        message: newMessage,
        sender: sender,
        receiver: receiver,
        time: new Date().toISOString(), // tempo atual em formato ISO
        isRead: false, // supondo que a mensagem não foi lida
      };
      await sendMessage(token, messageDto);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  
    setNewMessage('');
  };

  return (
    <Container fluid className="conversation">
      <div className="conversation-cards">
        {conversations.map((conversation, index) => (
          <ConversationCard key={index} conversation={conversation} />
        ))}
      </div>
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