import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './MessageCard.css';
import useStore from '../../stores/userStore';
import Avatar from '../../multimedia/Images/Avatar.jpg';
import UserList from '../UserList';
import { set } from 'react-hook-form';

const MessageCard = ({ message }) => {

    const setSelectedUserMessages = useStore(state => state.setSelectedUserMessages);
    const userList=useStore(state=>state.userList);
    const setUserList=useStore(state=>state.setUserList);
    const handleClick = () => {
        setSelectedUserMessages(message.id);
        
        const newUserList = userList.map(user => {
            if (user.id === message.id) {
                return { ...user, isRead: true };
            }
            return user;
        });
        
        setUserList(newUserList);
        console.log(newUserList);
    }
    return (
        <Card className="mail-message-card" onClick={handleClick}>
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={3} className="d-flex align-items-center">
                        <img src={message.senderImage || Avatar} alt="avatar" className="rounded-circle shadow-1-strong mail-avatar" />
                        <Card.Title className="fw-bold mb-0 mail-sender">{message.sender}</Card.Title>
                    </Col>
                    <Col xs={6} className="mail-content">
                        <Card.Text className="small text-muted mail-message">{message.message}</Card.Text>
                    </Col>
                    <Col xs={2} className="text-end">
                        {message.isRead ? null : <span className="badge bg-danger mail-is-read">New</span>}
                    </Col>
                </Row>
                <Card.Subtitle className="small text-muted mb-1 mail-datetime">{message.dateTime}</Card.Subtitle>
            </Card.Body>
        </Card>
    );
}

export default MessageCard;