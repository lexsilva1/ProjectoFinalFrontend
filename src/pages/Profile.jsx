import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import Avatar from '../multimedia/Images/Avatar.jpg';
import { findUserById } from '../services/userServices';
import Cookies from 'js-cookie';
import userStore from '../stores/userStore';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const { user } = userStore.getState();
    const token = Cookies.get('authToken');

    useEffect(() => {
        if (user && user.id) { // only call findUserById if id is not undefined
            findUserById(token, user.id)
                .then(userFromServer => {
                    console.log(userFromServer); // log the user data
                    setProfile(userFromServer);
                })
                .catch(error => console.error(error));
        }
    }, [token, user]); // add user to the dependency array

    return (
        <>
            <Header style={{ position: 'fixed', top: 0, width: '100%', height: '60px', zIndex: 1000 }} />
            <Sidebar />
            <Container style={{ marginLeft: '200px' }}>
                <Row>
                    <Col>
                        <img src={user?.image ? user.image : Avatar} alt={`${user?.firstName} ${user?.lastName}`} className="user-image" />
                        <h2 className="user-name">{`${user?.firstName} ${user?.lastName}`}</h2>
                    </Col>
                    <Col>
                        <h3>First Name: {user?.firstName || ''}</h3>
                        <h3>Last Name: {user?.lastName || ''}</h3>
                        <h3>Nickname: {user?.nickname || ''}</h3>
                        <h3>Role: {user?.role || ''}</h3>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile;