import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './MessageCard.css';
import useStore from '../../stores/userStore';


const MessageCard = ({ message }) => {

    const setSelectedUserMessages = useStore(state => state.setSelectedUserMessages);

    const handleClick = () => {
        console.log();
        setSelectedUserMessages(message.id);
    }
    return (
        <Card className="message-card mb-2"   onClick={handleClick}>
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={2} className="d-flex justify-content-center">
                        <img src={message.senderImage} alt="avatar" className="rounded-circle shadow-1-strong" style={{ width: '60px' }} />
                    </Col>
                    <Col xs={8}>
                        <Card.Title className="fw-bold mb-0">{message.sender}</Card.Title>
                        <Card.Text className="small text-muted">{message.message}</Card.Text>
                    </Col>
                    <Col xs={2} className="text-end">
                        <Card.Subtitle className="small text-muted mb-1">{message.dateTime}</Card.Subtitle>
                        {message.isRead ? null : <span className="badge bg-danger">New</span>}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default MessageCard;