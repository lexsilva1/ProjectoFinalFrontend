import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'; 
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5>ForgeXperimental Projects</h5>
                        <p>© 2024 ForgeXperimentalProjects</p>
                    </Col>
                    <Col md={4}>
                        <h5>Laboratories:</h5>
                        <ul>
                            <li>Lisboa</li>
                            <li>Coimbra</li>
                            <li>Porto</li>
                            <li>Tomar</li>
                            <li>Viseu</li>
                            <li>Vila Real</li>
                        </ul>
                    </Col>
                    <Col md={2}>
                        <h5>Legal Information:</h5>
                        <ul>
                            <li>Cookie Policy</li>
                            <li>Copyright Notice</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </Col>
                    <Col md={2}>
                        <h5>Contact Us:</h5>
                        <p><AiOutlinePhone /> 239 101 001</p> 
                        <p><AiOutlineMail /> forgexperimentalprojects@mail.com</p> 
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;