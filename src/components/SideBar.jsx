import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import userStore from '../stores/userStore';
import './SideBar.css';

const Sidebar = () => {
    const { t } = useTranslation();
    const userId = userStore((state) => state.user.id);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '◀' : '▶'}
            </div>
            <ul className='sidebar-menu'>
                <li>
                    <Link to="/">
                        <i className="fas fa-home"></i>
                        {isOpen && <span className="link-text">{t('Home')}</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/new-project">
                        <i className="fas fa-plus-square"></i>
                        {isOpen && <span className="link-text">{t('New Project')}</span>}
                    </Link>
                </li>
                <li>
                    <Link to={`/profile/${userId}`}>
                        <i className="fas fa-user"></i>
                        {isOpen && <span className="link-text">{t('Profile')}</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/users">
                        <i className="fas fa-users"></i>
                        {isOpen && <span className="link-text">{t('Users')}</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/inventory">
                        <i className="fas fa-clipboard-list"></i>
                        {isOpen && <span className="link-text">{t('Inventory')}</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard">
                        <i className="fas fa-tachometer-alt"></i>
                        {isOpen && <span className="link-text">{t('Dashboard')}</span>}
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
