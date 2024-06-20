import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Avatar from '../../multimedia/Images/Avatar.jpg';
import userStore from '../../stores/userStore';
import './ConversationCard.css';

const ConversationCard = ({ conversation }) => {
    const name = conversation.sender.firstName + ' ' + conversation.sender.lastName;

    return (
        <ListGroup.Item className="custom-d-flex">
            <img src={conversation.sender.image || Avatar} alt="avatar"
                className="custom-rounded-circle align-self-start ms-3 shadow-1-strong" width="60" />
            <Card className="w-100">
                <Card.Header className="d-flex justify-content-between p-3">
                    <p className="fw-bold mb-0">{name}</p>
                    <p className="text-muted small mb-0"><i className="far fa-clock"></i> {conversation.time}</p>
                </Card.Header>
                <Card.Body>
                    <p className="mb-0">
                        {conversation.message}
                    </p>
                </Card.Body>
            </Card>
        </ListGroup.Item>
    );
};

export default ConversationCard;