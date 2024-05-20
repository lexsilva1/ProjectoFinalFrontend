import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './Header.css';

const Header = () => {
    return (
        <Navbar bg="light" expand="lg" >
            <Navbar.Brand href="#">
                <img src="/favicon.ico" alt="Logo" width="30" height="30" className="d-inline-block align-top" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className='justify-content-end'>
                    <Button className='button' >Login</Button>
                    <Button className='button' >Sign Up</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header