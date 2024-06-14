import React from 'react';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'; 
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h5>ForgeXperimental Projects</h5>
                    <p>© 2024 ForgeXperimentalProjects</p>
                </div>
                <div className="footer-section">
                    <h5>Laboratories:</h5>
                    <ul>
                        <li>Lisboa</li>
                        <li>Coimbra</li>
                        <li>Porto</li>
                        <li>Tomar</li>
                        <li>Viseu</li>
                        <li>Vila Real</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h5>Legal Information:</h5>
                    <ul>
                        <li>Cookie Policy</li>
                        <li>Copyright Notice</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h5>Contact Us:</h5>
                    <p><AiOutlinePhone /> 239 101 001</p> 
                    <p><AiOutlineMail /> forgexperimentalprojects@mail.com</p> 
                </div>
            </div>
        </footer>
    );
};

export default Footer;