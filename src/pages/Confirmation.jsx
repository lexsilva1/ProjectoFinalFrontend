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
    const [submitted, setSubmitted] = useState(false);
    const { token } = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (firstName && lastName && workPlace) {
            
        } else {
            setSubmitted(true);
        }
    };

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="register-container" style={{backgroundColor: 'var(--primary-color)'}}>
            <div className="register-image">
                <img src={registerImage} alt="Register" />
                <div className="register-text">
                    <h1>Welcome to ForgeXperimental Projects!</h1>
                    <p>Let's forge ahead together in project management excellence.</p>
                </div>
            </div>
            <div className="register-spacer"></div>
            <div className="register-form-container">
                <div className="register-form-header">
                    <h1>Create your account</h1>
                </div>
                <Form className="register-form" onSubmit={handleSubmit}>
                    <Form.Group className="custom-form-group" controlId="formFirstName">
                        <Form.Label><span className="required">*</span>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" onChange={e => setFirstName(e.target.value)} />
                        {submitted && !firstName && <div className="error">First Name is required</div>}
                    </Form.Group>

                    <Form.Group className="custom-form-group" controlId="formLastName">
                        <Form.Label><span className="required">*</span>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" onChange={e => setLastName(e.target.value)} />
                        {submitted && !lastName && <div className="error">Last Name is required</div>}
                    </Form.Group>

                    <Form.Group className="custom-form-group" controlId="formWorkPlace">
                        <Form.Label><span className="required">*</span>Usual Work Place</Form.Label>
                        <Form.Control type="text" placeholder="Enter usual work place" onChange={e => setWorkPlace(e.target.value)} />
                        {submitted && !workPlace && <div className="error">Usual Work Place is required</div>}
                    </Form.Group>

                    <Form.Group className="custom-form-group" controlId="formNickname">
                        <Form.Label>Nickname</Form.Label>
                        <Form.Control type="text" placeholder="Enter nickname" onChange={e => setNickname(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="custom-form-group" controlId="formImage">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageUpload} />
                    </Form.Group>

                    <Form.Group className="custom-form-group" controlId="formBio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter bio" onChange={e => setBio(e.target.value)} />
                    </Form.Group>

                    <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button variant="primary" type="create" style={{backgroundColor: 'rgb(0, 0, 0)', width: '60%', marginTop: '20px'}}>
                    Create
                    </Button>
                   </div>
                </Form>
            </div>
        </div>
    );
};

export default Confirmation;