import './Header.css';
import userStore from '../stores/userStore';
import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';



const Header = () => {
    const setShowLogin = userStore((state) => state.setShowLogin);
    const setShowRegister = userStore((state) => state.setShowRegister);
    const handleShow = () => setShowLogin(true);
    const handleShowRegister = () => setShowRegister(true);
    return (
        <Navbar bg="light" expand="lg" >
            <Navbar.Brand href="#">
                <img src="/favicon.ico" alt="Logo" width="30" height="30" className="d-inline-block align-top" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className='justify-content-end'>
                    <Button className='button' onClick={handleShow} >Login</Button>
                    <Button className='button2' onClick={handleShowRegister} >Sign Up</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header