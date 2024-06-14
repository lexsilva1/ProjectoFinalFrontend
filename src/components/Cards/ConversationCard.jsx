import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const ConversationCard = ({ conversation }) => {
    const name = conversation.sender.firstName + ' ' + conversation.sender.lastName;
    console.log(conversation);
    return (
        <ListGroup.Item className="d-flex justify-content-between mb-4">
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
            <img src={conversation.avatar} alt="avatar"
                className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60" />
        </ListGroup.Item>
    );
};

export default ConversationCard;