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
    
const handleClick = () =>{
    if(projectName.includes(' ')) {
        const formattedProjectName = projectName.replace(' ', '%20');    
        navigate(`/project/${formattedProjectName}`);
    }
    else {
        navigate(`/project/${projectName}`);
    }
    
}
    const handleAccept = () => {
        let operation = 'ACCEPT_INVITATION'
        if (type === 'INVITE') {
           const newNotification =  manageInvitesApplications(token,projectName,user.id,operation,notificationId);
           
              //const newNotifications = notifications.filter(notification => notification.id !== id);
                //setNotifications([...newNotifications,newNotification]);
        } else if (type === 'APPLY') {
            operation = 'ACCEPT_APPLICATION';
            manageInvitesApplications(token,projectName,otherUserid,operation,notificationId);
        }
        
    }
    const handleDecline = () => {
        let operation = 'REJECT_INVITATION'
        if(type === 'INVITE') {
            rejectInvitesApplications(token,projectName,user.id,operation,notificationId);
        } else if (type === 'APPLY') {
            operation = 'REJECT_APPLICATION';
            rejectInvitesApplications(token,projectName,otherUserid,operation,notificationId);
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