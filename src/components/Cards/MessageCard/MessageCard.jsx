import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './MessageCard.css';
import useStore from '../../../stores/userStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 
import { useTranslation } from 'react-i18next';


const MessageCard = ({ message }) => {
    const setSelectedUserMessages = useStore(state => state.setSelectedUserMessages);
    const userList = useStore(state => state.userList);
    const setUserList = useStore(state => state.setUserList);
    const navigate = useNavigate();
    const currentUser = Cookies.get('userId'); 
    const isCurrentUser = message.senderId === currentUser;
    const { t } = useTranslation();

    const handleClick = (messageid) => {
        console.log('userlist', userList);
        console.log('message', message);
        setSelectedUserMessages(message.id);

        const newUserList = userList.map(user => {
            console.log('fora do if' + user);
            if (user.sender.id === message.id) {
                console.log('dentro do if' + message.id);
                console.log('dentro do if 2' + user.id);
                return { ...user, read: true };
            } else {
                console.log('dentro do if mas else' + message.id);
                return user;
            }
        });
        console.log('newUserList', newUserList);
        setUserList(newUserList);
        navigate(`/messages/${message.id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <Card className="mail-message-card" onClick={() => handleClick(message.id)}>
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={4} className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px' }} />
                        <p style={{ marginBottom: "0px" }}>{t("From")}:</p>
                        <Card.Title className="fw-bold mb-0 mail-sender">{message.sender}</Card.Title>
                    </Col>
                    <Col xs={6} className="mail-content">
                        <Card.Text className="small text-muted mail-message">{message.message}</Card.Text>
                    </Col>
                    <Col xs={2} className="text-end">
                        {(message.isRead || message.read) ? null : <span className="badge bg-danger mail-is-read">New</span>}
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