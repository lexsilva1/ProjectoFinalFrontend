import React from 'react';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'; 
import './Footer.css';
import logo3 from '../../multimedia/Images/logo3.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <img src={logo3} alt="Logo" style={{width: '8em', height: '8em', verticalAlign: 'middle'}} />
                    <div  className='rights'>
                        <h5>© 2024 ForgeXperimentalProjects. All rights reserved.</h5>
                        <p>Empowered by Critical Software</p>
                        </div>
                    
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