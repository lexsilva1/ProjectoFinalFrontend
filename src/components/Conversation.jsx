import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import ConversationCard from '../components/Cards/ConversationCard'; // Adjust the import path as necessary

const Conversation = ({ conversations }) => {
  return (
    <Container>
      {conversations.map((conversation, index) => (
        <ConversationCard key={index} conversation={conversation} />
      ))}
      <Form>
        <Form.Group className="mb-3" controlId="textAreaExample">
          <Form.Control as="textarea" rows={4} placeholder="Message" />
        </Form.Group>
        <Button variant="info" className="float-end">Send</Button>
      </Form>
    </Container>
  );
};

export default Conversation;