import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import registerImage from "../multimedia/Images/registerImage.jpg";
import './Confirmation.css';
import { useParams } from 'react-router-dom';

const Confirmation = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [workPlace, setWorkPlace] = useState('');
    const [nickname, setNickname] = useState('');
    const [image, setImage] = useState(null);
    const [bio, setBio] = useState('');
    const { token } = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        
    };

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="register-container">
            <div className="register-image">
                <img src={registerImage} alt="Register" />
                <div className="register-text">
                    <h1>Welcome to ForgeXperimental Projects!</h1>
                    <p>Let's forge ahead together in project management excellence.</p>
                </div>
            </div>
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" onChange={e => setFirstName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" onChange={e => setLastName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formWorkPlace">
                <Form.Label>Usual Work Place</Form.Label>
                <Form.Control type="text" placeholder="Enter usual work place" onChange={e => setWorkPlace(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formNickname">
                <Form.Label>Nickname</Form.Label>
                <Form.Control type="text" placeholder="Enter nickname" onChange={e => setNickname(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formImage">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={handleImageUpload} />
            </Form.Group>

            <Form.Group controlId="formBio">
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter bio" onChange={e => setBio(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        </div>
    );
};

export default Confirmation;
