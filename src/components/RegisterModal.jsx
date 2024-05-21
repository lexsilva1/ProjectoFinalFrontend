import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import userStore from '../stores/userStore';

const RegisterModal = () => {
    const showRegister = userStore((state) => state.showRegister);
    const setShow = userStore((state) => state.setShowRegister);
    const handleClose = () => setShow(false);
   

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your registration logic here
    };

    return (
        <>


            <Modal show={showRegister} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RegisterModal;