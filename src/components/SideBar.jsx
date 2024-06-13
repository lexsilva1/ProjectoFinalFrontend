import React from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css';
import { useTranslation } from 'react-i18next';
import userStore from '../stores/userStore';
import { use } from 'i18next';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { t } = useTranslation();
    const userId = userStore((state) => state.user.id);

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul className='lista'>
                    <li style={{ marginTop: '50px' }}>
                        <Link to="/">
                            <i className="fas fa-home"></i> 
                            <span className="link-text">{t('Home')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/new-project">
                            <i className="fas fa-plus-square"></i> 
                            <span className="link-text">{t('New Project')}</span>
                        </Link>
                    </li>
                    <li>
                    <Link to={`/profile/${userId}`}>
                            <i className="fas fa-user"></i> 
                            <span className="link-text">{t('Profile')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/messages">
                            <i className="fas fa-envelope"></i> 
                            <span className="link-text">{t('Messages')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/users">
                            <i className="fas fa-users"></i> 
                            <span className="link-text">{t('Users')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/inventory">
                            <i className="fas fa-clipboard-list"></i> 
                            <span className="link-text">{t('Inventory')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard">
                            <i className="fas fa-tachometer-alt"></i> 
                            <span className="link-text">{t('Dashboard')}</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>
        </>
    );
};

export default Sidebar;
