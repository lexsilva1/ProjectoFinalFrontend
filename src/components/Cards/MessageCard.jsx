import React from 'react';
import Card from 'react-bootstrap/Card';
import './MessageCard.css';

const MessageCard = ({ message }) => {
    return (
        <Card className="message-card">
            <Card.Body>
                <Card.Img variant="top" src={message.senderImage} />
                <Card.Title className="sender">{message.sender}</Card.Title>
                <Card.Text>{message.message}</Card.Text>
                <Card.Subtitle className="datetime mb-2 text-muted">{message.dateTime}</Card.Subtitle>
                <div className={message.isRead ? "is-read" : ""}></div>
            </Card.Body>
        </Card>
    );
};

export default MessageCard;