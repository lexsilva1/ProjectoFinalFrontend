import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import ConversationCard from '../components/Cards/ConversationCard'; 
import userstore from '../stores/userStore';
import './Conversation.css';

const Conversation = ({ conversations }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newMessage.trim() === '') return;
    // Implementar a lógica de envio de mensagem aqui
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