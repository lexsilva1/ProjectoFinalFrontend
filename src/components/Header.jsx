import { useTranslation } from 'react-i18next';
import userStore from '../stores/userStore';
import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './Header.css';
import Cookies from 'js-cookie';

const Header = () => {
    const { t, i18n } = useTranslation();
    const setShowLogin = userStore((state) => state.setShowLogin);
    const setShowRegister = userStore((state) => state.setShowRegister);
    const handleShow = () => setShowLogin(true);
    const handleShowRegister = () => setShowRegister(true);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        Cookies.set('i18nextLng', lng); // Altere 'i18next' para 'i18nextLng'
    };

    return (
        <Navbar expand="lg" className="header">
            <Navbar.Brand href="#">
                <img src="/favicon.ico" alt="Logo" width="30" height="30" className="d-inline-block align-top" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className='justify-content-end'>
            <Button variant="outline" className='button' onClick={handleShow} >{t('Login')}</Button>
            <Button variant="outline" className='button2' onClick={handleShowRegister} >{t('Sign Up')}</Button>
            <div className="language-buttons">
                <Button variant="outline" className='language-button' onClick={() => changeLanguage('pt')} >PT</Button>
                <Button variant="outline" className='language-button' onClick={() => changeLanguage('en')} >EN</Button>
            </div>
            </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;