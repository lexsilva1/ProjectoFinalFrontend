import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import userStore from '../stores/userStore';
import './RegisterModal.css'; // Import your custom CSS file
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const RegisterModal = () => {
    const { t } = useTranslation(); // Use useTranslation hook to get t function
    const showRegister = userStore((state) => state.showRegister);
    const setShow = userStore((state) => state.setShowRegister);
    const handleClose = () => setShow(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your registration logic here
    };

    return (
        <Modal show={showRegister} onHide={handleClose} centered className="custom-modal">
            <Modal.Header closeButton>
                <div className="w-100 d-flex justify-content-center">
                    <Modal.Title>{t('Create an account')}</Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail" className="mb-4">
                        <Form.Label>{t('Email address')}</Form.Label>
                        <Form.Control type="email" placeholder={t('Enter email')} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mb-4">
                        <Form.Label>{t('Password')}</Form.Label>
                        <Form.Control type="password" placeholder={t('Password')} />
                    </Form.Group>

                    <Form.Group controlId="formBasicConfirmPassword" className="mb-4">
                        <Form.Label>{t('Confirm Password')}</Form.Label>
                        <Form.Control type="password" placeholder={t('Confirm Password')} />
                    </Form.Group>

                    <p className="info-text">{t('By clicking continue, you will need to check your email to confirm your account.')}</p>

                    <button type="submit" className="custom-button">
                        {t('Register')}
                    </button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterModal;