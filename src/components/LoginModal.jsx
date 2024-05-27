import React from 'react';
import { Modal, Form } from 'react-bootstrap';
import userStore from '../stores/userStore';
import './RegisterModal.css'; // Import your custom CSS file
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const LoginModal = () => {
    const { t } = useTranslation(); // Use useTranslation hook to get t function
    const showLogin = userStore((state) => state.showLogin);
    const setShow = userStore((state) => state.setShowLogin);
    const handleClose = () => setShow(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
    };

    return (
        <Modal show={showLogin} onHide={handleClose} centered className="custom-modal">
            <Modal.Header closeButton>
                <div className="w-100 d-flex justify-content-center">
                    <Modal.Title className='modal-title'>{t('Get started by logging in to your account')}</Modal.Title>
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

                    <button type="submit" className="custom-button">
                        {t('Login')}
                    </button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;