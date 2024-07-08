import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import userStore from '../stores/userStore';
import Cookies from 'js-cookie';
import { logout } from '../services/userServices';
import Avatar from '../multimedia/Images/Avatar.jpg';
import { FaBell, FaUser } from 'react-icons/fa';
import { Button, Offcanvas } from 'react-bootstrap';
import useStartWebSocket from '../Websockets/notificationsWebsocket';
import NotificationsCanva from './NotificationsCanva';
import logo2 from '../multimedia/Images/logo2.png';
import { BsGraphUp, BsFileEarmarkText, BsPeople ,  BsEnvelope, BsJournals, BsJournalPlus   } from "react-icons/bs";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const isLoggedIn = userStore((state) => state.isLoggedIn);
  const setIsLoggedIn = userStore((state) => state.setIsLoggedIn);
  const setShowLogin = userStore((state) => state.setShowLogin);
  const setShowRegister = userStore((state) => state.setShowRegister);
  const navigate = useNavigate();
  const user = userStore((state) => state.user);
  const authToken = Cookies.get("authToken");
  const { startWebSocket } = useStartWebSocket(authToken);
  const setNotifications = userStore((state) => state.setNotifications);
  const notifications = userStore((state) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const userId = userStore((state) => state.user?.id);
  const [theme, setTheme] = useState('light'); // Estado para o tema

  useEffect(() => {
    if (isLoggedIn || authToken !== undefined) {
      startWebSocket(authToken);
    }
  }, [isLoggedIn, authToken]);

  

  const handleShow = () => setShowLogin(true);
  const handleShowRegister = () => setShowRegister(true);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleOffCanvas = () => setShowOffCanvas(!showOffCanvas);
  const toggleThemeSubmenu = () => setShowThemeSubmenu(!showThemeSubmenu);

  const handleLogout = () => {
    logout();
    Cookies.remove("authToken");
    Cookies.remove("i18nextLng");
    userStore.setState({ user: null });
    setIsLoggedIn(false);
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    Cookies.set("i18nextLng", lng);
  };

  return (
    <div className="header">
      <div className="logo"></div>
      <div className="actions">
        {!authToken && (
          <>
            <Button
              className="button2"
              onClick={handleShowRegister}
            >
              {t("Sign Up")}
            </Button>
            <Button className="button-login" onClick={handleShow}>
              {t("Login")}
            </Button>
          </>
        )}
        {authToken && user && (
          <>
            <div className="icon-links">
              <OverlayTrigger
                key="projects"
                placement="bottom"
                style={{ backgroundColor: "var(--contrast-color)" }}
                overlay={
                  <Tooltip id={`tooltip-journals`}>{t("Projects")}</Tooltip>
                }
              >
                <Link to="/">
                  <BsJournals className="header-icon" />
                </Link>
              </OverlayTrigger>

              <OverlayTrigger
                key="createProject"
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-journals`}>
                    {t("Create Project")}{" "}
                    {/* Substitua "Journals" pela tradução ou texto desejado */}
                  </Tooltip>
                }
              >
                <Link to="/new-project">
                  <BsJournalPlus className="header-icon" />
                </Link>
              </OverlayTrigger>
              <OverlayTrigger
                key="users"
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-journals`}>{t("Users")}</Tooltip>
                }
              >
                <Link to="/users">
                  <BsPeople className="header-icon" />
                </Link>
              </OverlayTrigger>
              <OverlayTrigger
                key="inventory"
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-journals`}>
                    {t("Inventory")}{" "}
                    {/* Substitua "Journals" pela tradução ou texto desejado */}
                  </Tooltip>
                }
              >
                <Link to="/inventory">
                  <BsFileEarmarkText className="header-icon" />
                </Link>
              </OverlayTrigger>
              <OverlayTrigger
                key="dashboard"
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-journals`}>{t("Dashboard")}</Tooltip>
                }
              >
                <Link to="/dashboard">
                  <BsGraphUp className="header-icon" />
                </Link>
              </OverlayTrigger>
              <OverlayTrigger
  key="messages"
  placement="bottom"
  overlay={
    <Tooltip id={`tooltip-messages`}>{t("Messages")}</Tooltip>
  }
>
  <span onClick={() => navigate("/messages")}>
    <BsEnvelope className="header-icon" />
  </span>
</OverlayTrigger>
            </div>
            <div className="user-info" onClick={toggleOffCanvas}>
              <img
                src={user.image ? user.image : Avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="user-avatar"
              />
              <span className="user-name-header">{`${user.firstName}`}</span>
            </div>
            <FaBell
              className="header-icon-notification"
              onClick={toggleNotifications}
            />
          </>
        )}
        <div className="language-buttons">
          <Button
            variant="outline"
            className="language-button"
            onClick={() => changeLanguage("pt")}
          >
            PT
          </Button>
          <Button
            variant="outline"
            className="language-button"
            onClick={() => changeLanguage("en")}
          >
            EN
          </Button>
        </div>
      </div>
      {isLoggedIn && (
        <NotificationsCanva
          show={showNotifications}
          handleClose={() => setShowNotifications(false)}
        />
      )}
      {isLoggedIn && (
        <Offcanvas
          show={showOffCanvas}
          onHide={toggleOffCanvas}
          placement="end"
          style={{
            width: "300px",
            borderBottomLeftRadius: "20px",
            borderTopLeftRadius: "20px",
            top: "70px",
            height: "80%",
          }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{`${user.firstName} ${user.lastName}`}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ul className="offcanvas-menu">
              <li>
                <Link to={`/profile/${userId}`}>
                  <FaUser className="header-icon" />
                  {t("Profile & Visibility")}
                </Link>
              </li>
              <li>
                <button onClick={toggleThemeSubmenu}>
                  {t("Theme")}
                  {showThemeSubmenu && (
                    <ul className="theme-submenu">
                      <li>
                        <button onClick={() => alert("Luz")}>
                          {t("Light")}
                        </button>
                      </li>
                      <li>
                        <button onClick={() => alert("Escuro")}>
                          {t("Dark")}
                        </button>
                      </li>
                    </ul>
                  )}
                </button>
              </li>
              <li>
                <Link to="/help">{t("Help")}</Link>
              </li>
              <li>
                <Button onClick={handleLogout}>{t("Logout")}</Button>
              </li>
            </ul>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};

export default Header;
