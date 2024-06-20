import React, { useState } from 'react';
import { Offcanvas, Card } from 'react-bootstrap';
import NotificationCard from './Cards/NotificationCard';

const NotificationsCanva = () => {
    const [show, setShow] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'INVITED', isRead: false, date: '2021-09-01', projectName: 'UserInterface'},
        { id: 2, message: 'Notification 2', isRead: true, date: '2021-09-02', projectName: 'FORGE X'},
        { id: 3, message: 'APPLY' , isRead: false, date: '2021-09-03', projectName: 'Project X'},
    ]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <button onClick={handleShow}>Open Notifications</button>

            <Offcanvas show={show} onHide={handleClose}>
                
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Notifications</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {notifications.map((notification) => (
                        <NotificationCard key={notification.projectName} notification={notification} />
                    ))}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default NotificationsCanva;