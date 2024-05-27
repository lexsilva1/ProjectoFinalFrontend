import React from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>
            <ul className='lista'>
                <li style={{marginTop: '50px'}}><Link to="/"><i className="fas fa-home"></i> <span className="link-text">Home</span></Link></li>
                <li><Link to="/new-project"><i className="fas fa-plus-square"></i> <span className="link-text">New Project</span></Link></li>
                <li><Link to="/profile"><i className="fas fa-user"></i> <span className="link-text">Profile</span></Link></li>
                <li><Link to="/messages"><i className="fas fa-envelope"></i> <span className="link-text">Messages</span></Link></li>
                <li><Link to="/users"><i className="fas fa-users"></i> <span className="link-text">Users</span></Link></li>
                <li><Link to="/inventory"><i className="fas fa-clipboard-list"></i> <span className="link-text">Inventory</span></Link></li>
                <li><Link to="/dashboard"><i className="fas fa-tachometer-alt"></i> <span className="link-text">Dashboard</span></Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;