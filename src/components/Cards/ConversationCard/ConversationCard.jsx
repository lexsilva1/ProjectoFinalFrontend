import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Avatar from '../../../multimedia/Images/Avatar.jpg';
import { formatDistanceToNow } from 'date-fns';
import './ConversationCard.css';

const ConversationCard = ({ conversation, isCurrentUser }) => {
    const name = conversation.sender.firstName + ' ' + conversation.sender.lastName;
    const timeAgo = formatDistanceToNow(new Date(conversation.time), { addSuffix: true });
    const alignmentClass = isCurrentUser ? 'align-right' : 'align-left';
   
    const headerClass = isCurrentUser ? 'custom-flex-row-reverse' : '';

    return (
        <ListGroup.Item className={`custom-d-flex ${alignmentClass}`} style={{border: "none", backgroundColor: "transparent", padding: "0px"}}>
            <Card className="conversation-card">
                <Card.Header className={`d-flex justify-content-between align-items-center p-3 ${headerClass}`} style={{backgroundColor: "transparent"}}>
                    <div className="d-flex align-items-center">
                        <img src={conversation.sender.image || Avatar} alt="avatar"
                            className="custom-rounded-circle shadow-1-strong me-3" style={{ width: "30px", height: "30px", objectFit: "cover" }} />
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