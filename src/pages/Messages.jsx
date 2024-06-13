import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import MessageCard from '../components/Cards/MessageCard';
import UserList from '../components/UserLIst';
import { useState } from 'react';
import { use } from 'i18next';
import { useEffect } from 'react';

const Messages = () => {
    // Dummy data for messages
    const messages = [
        { id: 1, sender: 'User A', message: 'Hello!', dateTime: '2021-09-01 12:00:00', isRead: true},
        { id: 2, sender: 'User B', content: 'Hi there!', dateTime: '2021-09-01 12:01:00', isRead: false},
        { id: 3, sender: 'User A', content: 'How are you?, dateTime: 2021-09-01 12:02:00', isRead: true},
        { id: 4, sender: 'User B', content: 'I am good, thanks!', dateTime: '2021-09-01 12:03:00', isRead: false},
    ];
    const [userList, setUserList] = useState([]);
    const [selectedMessages, setSelectedMessages] = useState([]);

    useEffect(() => {
        setUserList(messages)
    }
    , []);
    return (
        <><Header />
        <Row>
                <Col xs={3}>
                    <Sidebar />
                </Col>
                <Col>
        <Container>
            <Row>
                <Col>
                    <h1>Messages</h1>
                </Col>

            </Row>
            <Row>
<Col>
<UserList users={userList}/>
</Col>
                <Col>
                    {selectedMessages.map((message) => (
                        <Card key={message.id} className="mb-3">
                         <MessageCard message={message} />
                        </Card>
                    ))}
                </Col>
            </Row>
        
        </Container>
        </Col>
        </Row>
        </>
    );
};

export default Messages;