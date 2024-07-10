import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './MessageCard.css';
import useStore from '../../stores/userStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importando js-cookie

const MessageCard = ({ message }) => {
    const setSelectedUserMessages = useStore(state => state.setSelectedUserMessages);
    const userList = useStore(state => state.userList);
    const setUserList = useStore(state => state.setUserList);
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedUserMessages(message.id);

        const newUserList = userList.map(user => {
            if (user.id === message.id) {
                return { ...user, isRead: true };
            } else {
                return user;
            }
        });
        navigate(`/messages/${message.id}`);
        setUserList(newUserList);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <Card className="mail-message-card" onClick={handleClick}>
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={4} className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px' }} />
                        <p style={{ marginTop: "4%" }}>From:</p>
                        <Card.Title className="fw-bold mb-0 mail-sender">{message.sender}</Card.Title>
                    </Col>
                    <Col xs={6} className="mail-content">
                        <Card.Text className="small text-muted mail-message">{message.message}</Card.Text>
                    </Col>
                    <Col xs={2} className="text-end">
                        {message.isRead ? null : <span className="badge bg-danger mail-is-read">New</span>}
                    </Col>
                </Row>
                <Card.Subtitle className="small text-muted mb-1 mail-datetime">
                    {formatDate(message.dateTime)}
                </Card.Subtitle>
            </Card.Body>
        </Card>
    );
}

export default MessageCard;