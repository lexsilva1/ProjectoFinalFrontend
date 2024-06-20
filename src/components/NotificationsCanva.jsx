import React, { useEffect, useState } from 'react';
import { Offcanvas, Card } from 'react-bootstrap';
import NotificationCard from './Cards/NotificationCard';
import { getNotifications } from '../services/notificationService';
import Cookies from 'js-cookie';

const NotificationsCanva = () => {
    const [show, setShow] = useState(false);
    const [notifications, setNotifications] = useState([]);
    console.log(notifications);
    useEffect(() => {
        const token = Cookies.get("authToken");
        const fetchNotifications = async () => {
            const notifications = await getNotifications(token);
            setNotifications(notifications);
        };
        fetchNotifications();
    }, []);

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
                        <NotificationCard key={notification.notificationId} notification={notification} />
                    ))}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default NotificationsCanva;