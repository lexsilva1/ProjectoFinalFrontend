import React, { useEffect, useState } from 'react';
import { Offcanvas, Card } from 'react-bootstrap';
import NotificationCard from './Cards/NotificationCard';
import { getNotifications } from '../services/notificationService';
import Cookies from 'js-cookie';
import userstore from '../stores/userStore';

const NotificationsCanva = () => {
    const [show, setShow] = useState(false);
    const notifications = userstore((state) => state.notifications);

  

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <button onClick={handleShow}>Open Notifications</button>

            <Offcanvas show={show} onHide={handleClose}>
                
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Notifications</Offcanvas.Title>
                    <div className="d-flex align-items-center">
                        <input type="text" placeholder="Search" />
                        <label className="ml-3">
                            <input type="checkbox" />
                            Show Unread Only
                        </label>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {Array.isArray(notifications) && notifications.map((notification) => (
                        <NotificationCard key={notification.notificationId} notification={notification} />
                    ))}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default NotificationsCanva;