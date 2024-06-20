import React from 'react';
import {Card, Button, ButtonGroup} from 'react-bootstrap';
import './NotificationCard.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {manageInvitesApplications, rejectInvitesApplications} from '../../services/projectServices';
import Cookies from 'js-cookie';
import userStore from '../../stores/userStore';

const NotificationCard = ({ notification }) => {
    const { projectName, date, message, isRead, id } = notification;
    const navigate = useNavigate();
    const token = Cookies.get("authToken");
    const user = userStore((state) => state.user);

    
const handleClick = () =>{
    if(projectName.includes(' ')) {
        const formattedProjectName = projectName.replace(' ', '%20');
        navigate(`/project/${formattedProjectName}`);
    }
}
    const handleAccept = () => {
        let operation = 'ACCEPT_INVITATION'
        if(message === 'INVITED') {
            manageInvitesApplications.acceptInvite(token,projectName,user.id,operation);
        } else if (message === 'APPLY') {
            operation = 'ACCEPT_APPLICATION';
            manageInvitesApplications.acceptApplication(token,projectName,id,operation);
        }
        
    }
    const handleDecline = () => {
        let operation = 'REJECT_INVITATION'
        if(message === 'INVITED') {
            rejectInvitesApplications.rejectInvite(token,projectName,user.id,operation);
        } else if (message === 'APPLY') {
            operation = 'REJECT_APPLICATION';
            rejectInvitesApplications.rejectApplication(token,projectName,id,operation);
        }
}


    return (
        <Card className={isRead ? "Read":"Unread"} onClick={handleClick}>
            <Card.Body>
                <Card.Title>{projectName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
                <Card.Text>{message}</Card.Text>
                <Card.Text>{isRead ? 'Read' : 'Unread'}</Card.Text>
            
            </Card.Body>
            {message === 'INVITED' || message === 'APPLY' ? <ButtonGroup><Button variant="primary">Accept</Button> <Button variant="danger">Decline</Button></ButtonGroup> : null}
        </Card>
    );
};

export default NotificationCard;