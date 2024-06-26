import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Avatar from '../../multimedia/Images/Avatar.jpg';
import { formatDistanceToNow } from 'date-fns';
import './ConversationCard.css';

const ConversationCard = ({ conversation }) => {
    const name = conversation.sender.firstName + ' ' + conversation.sender.lastName;
    const timeAgo = formatDistanceToNow(new Date(conversation.time), { addSuffix: true });

    return (
        <ListGroup.Item className="custom-d-flex">
            <Card className="w-100">
                <Card.Header className="d-flex justify-content-between align-items-center p-3" >
                    <div className="d-flex align-items-center" >
                        <img src={conversation.sender.image || Avatar} alt="avatar"
                            className="custom-rounded-circle shadow-1-strong me-3" style={{ width: "30px", height: "30px", objectFit: "cover" }}  />
                        <p className="fw-bold mb-0">{name}</p>
                    </div>
                    <p className="text-muted small mb-0">{timeAgo}</p>
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