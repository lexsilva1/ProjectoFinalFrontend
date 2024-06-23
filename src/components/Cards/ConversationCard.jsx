import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Avatar from '../../multimedia/Images/Avatar.jpg';
import './ConversationCard.css';

const ConversationCard = ({ conversation }) => {
    const name = conversation.sender.firstName + ' ' + conversation.sender.lastName;

    return (
        <ListGroup.Item className="custom-d-flex">
            <Card className="w-100">
                <Card.Header className="d-flex align-items-center p-3">
                    <img src={conversation.sender.image || Avatar} alt="avatar"
                        className="custom-rounded-circle shadow-1-strong me-3" width="30" />
                    <div>
                        <p className="fw-bold mb-0">{name}</p>
                        <p className="text-muted small mb-0"><i className="far fa-clock"></i> {conversation.time}</p>
                    </div>
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