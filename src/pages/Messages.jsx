import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import Conversation from '../components/Conversation';
import UserList from '../components/UserLIst';
import { useState } from 'react';
import { use } from 'i18next';
import { useEffect } from 'react';
import { getMessages, getLastMessages, sendMessage } from '../services/messageServices';
import userstore from '../stores/userStore';
import Cookies from 'js-cookie';
import { Fa0 } from 'react-icons/fa6';

const Messages = () => {

    const [userList, setUserList] = useState([]);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const selectedUserMessages = userstore((state) => state.selectedUserMessages);
    const token = Cookies.get('authToken');
    console.log (selectedMessages)

    useEffect(() => {
        getLastMessages(token).then((messages) => {
            setUserList(messages);
            console.log(messages);
        });
    }
    , []);
    useEffect(() => {
        if (selectedUserMessages !== null) {
            getMessages(token, selectedUserMessages).then((messages) => {
                setSelectedMessages(messages);
                console.log(messages);
            ;
            });
        }
    }, [selectedUserMessages]);
    return (
        <><Header />
        <Row>
                <Col xs={3}>
                    <Sidebar />
                </Col>
                
        <Container>
            <Row>
                    <h1>Messages</h1>
            </Row>
            <Row>

                <Col>
                {selectedUserMessages === null ? (
                <UserList users={userList}/>
                ) : (
                    <Conversation conversations={selectedMessages} />
                    
                )}
                </Col>
            </Row>
        
        </Container>
        </Row>
        </>
    );
};

export default Messages;