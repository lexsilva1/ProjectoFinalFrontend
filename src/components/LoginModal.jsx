import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import userStore from '../stores/userStore';
import './LoginModal.css';

const LoginModal = () => {
    const show = userStore((state) => state.showLogin);
    const setShowLogin = userStore((state) => state.setShowLogin);
    const handleClose = () => setShowLogin(false);
   

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='modal-title'>Get started by logging in to your account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LoginModal;