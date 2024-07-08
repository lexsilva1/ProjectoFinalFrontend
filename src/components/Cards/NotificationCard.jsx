import React from 'react';
import {Card, Button, ButtonGroup} from 'react-bootstrap';
import './NotificationCard.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {manageInvitesApplications, rejectInvitesApplications} from '../../services/projectServices';
import Cookies from 'js-cookie';
import userStore from '../../stores/userStore';
import { set } from 'react-hook-form';

const NotificationCard = ({ notification }) => {
    const { projectName, date, type, isRead, notificationId, otherUserid } = notification;
    const navigate = useNavigate();
    const token = Cookies.get("authToken");
    const user = userStore((state) => state.user);
    const notifications = userStore((state) => state.notifications);
    const setNotifications = userStore((state) => state.setNotifications);
    
const handleClick = (event) =>{
    if(projectName.includes(' ')) {
        const formattedProjectName = projectName.replace(' ', '%20');    
        navigate(`/project/${formattedProjectName}`);
        notification.isRead = true;

    }
    else {
        navigate(`/project/${projectName}`);
    }
    
}
    const handleAccept = async (event) => {
        event.stopPropagation();
        let operation = 'ACCEPT_INVITATION'
        if (type === 'INVITE') {
           const newNotification = await manageInvitesApplications(token,projectName,user.id,operation,notificationId);
           newNotification.isRead = true;
              const newNotifications = notifications.filter((notification) => notification.notificationId !== notificationId);
                setNotifications([...newNotifications, newNotification]);
        }
        
    }
    const handleDecline = async (event) => {
        event.stopPropagation();
        let operation = 'ACCEPT_INVITATION'
        if(type === 'INVITE') {
           const newNotification = await rejectInvitesApplications(token,projectName,user.id,operation,notificationId);
              newNotification.isRead = true;
                  const newNotifications = notifications.filter((notification) => notification.notificationId !== notificationId);
                 setNotifications([...newNotifications, newNotification]);
        } 
}


    return (
        <Card className={isRead ? "Read":"Unread"} onClick={handleClick}>
            <Card.Body>
                <Card.Title>{projectName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
                <Card.Text>{type}</Card.Text>
                <Card.Text>{isRead ? 'Read' : 'Unread'}</Card.Text>
            </Card.Body>
            {type === 'INVITE'  ? <ButtonGroup><Button variant="primary" onClick={handleAccept}>Accept</Button> <Button variant="danger" onClick={handleDecline}>Decline</Button></ButtonGroup> : null}
        </Card>
    );
};

export default NotificationCard;