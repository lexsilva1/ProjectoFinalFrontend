import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import userStore from "../../stores/userStore";
import Cookies from "js-cookie";
import { logout } from "../../services/userServices";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import { FaBell, FaUser, FaCog, FaPaintBrush, FaGlobeAmericas, FaSignOutAlt } from "react-icons/fa";
import { Button, Offcanvas } from "react-bootstrap";
import useStartWebSocket from "../../Websockets/notificationsWebsocket";
import NotificationsCanva from "../NotificationsCanva/NotificationsCanva";
import logo2 from "../../multimedia/Images/logo2.png";
import { BsGraphUp, BsFileEarmarkText, BsPeople, BsEnvelope, BsJournals, BsJournalPlus,} from "react-icons/bs";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { markAsSeen } from "../../services/notificationService";
import "./Header.css";
import { use } from "i18next";
import { set } from "date-fns";

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
  const notifications = userStore((state) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const userId = userStore((state) => state.user?.id);
  const [theme, setTheme] = useState(Cookies.get("theme") || "light");
  const unreadMessages = userStore((state) => state.unreadMessages);
  console.log(unreadMessages);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false);
  const toggleLanguageMenu = () => setShowLanguageMenu(!showLanguageMenu);
  const userRole = userStore((state) => state.user?.role);
  const setUnreadMessages = userStore((state) => state.setUnreadMessages);
  const userList = userStore((state) => state.userList);
  const [unseenNotifications, setUnseenNotifications] = useState(false);
  const isCurrentUserAppManager = userRole < 2;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Limpeza do event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const unreadCount = userList.filter(user =>!user.read).length;
    if (unreadCount > 0) {
      setUnreadMessages(true);
    } else {
      setUnreadMessages(false);
    }
  }, [userList]);
  useEffect(() => {
    if (isLoggedIn || authToken !== undefined) {
      startWebSocket(authToken);
    }
    document.body.className = theme;
    setShowOffCanvas(false);
  }, [isLoggedIn, authToken, theme]);

  const handleShow = () => setShowLogin(true);
  const handleShowRegister = () => setShowRegister(true);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleOffCanvas = () => setShowOffCanvas(!showOffCanvas);
  const toggleThemeSubmenu = () => setShowThemeSubmenu(!showThemeSubmenu);
  const markNotificationsAsSeen = async () => {
    toggleNotifications();
    markAsSeen(authToken);
    notifications.forEach((notification) => (notification.isSeen = true));
    setUnseenNotifications(false);
  };

  const handleLogout = () => {
    logout();
    Cookies.remove("authToken"); // Remove token cookie
    Cookies.remove("i18nextLng"); // Remove language cookie
    sessionStorage.clear(); // Clear session storage
    localStorage.clear(); // Clear local storage
    userStore.getState().logout(); // Reset the store
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    Cookies.set("i18nextLng", lng);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    Cookies.set("theme", newTheme);
  };

  useEffect(() => {
  const hasUnseenNotifications = () => {
    return notifications.some((notification) => !notification.isSeen);
  };
  hasUnseenNotifications() ? setUnseenNotifications(true) : setUnseenNotifications(false);
}, [notifications]);

  return (
    <div className="header">
      <div className="logo"></div>
      <div className="actions">
        {!authToken && (
          <>
            <Button className="button2" onClick={handleShowRegister}>
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
                    {t("Create Project")}
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
                  <Tooltip id={`tooltip-journals`}>{t("Inventory")}</Tooltip>
                }
              >
                <Link to="/inventory">
                  <BsFileEarmarkText className="header-icon" />
                </Link>
              </OverlayTrigger>
              {isCurrentUserAppManager && (
                <OverlayTrigger
                  key="dashboard"
                  placement="bottom"
                  overlay={
                    <Tooltip id={`tooltip-dashboard`}>{t("Dashboard")}</Tooltip>
                  }
                >
                  <Link to="/dashboard">
                    <BsGraphUp className="header-icon" />
                  </Link>
                </OverlayTrigger>
              )}
              <OverlayTrigger
                key="messages"
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-messages`}>{t("Messages")}</Tooltip>
                }
              >
                <span
                  onClick={() => navigate("/messages")}
                  style={{ position: "relative" }}
                >
                  <BsEnvelope className="header-icon" />
                  {unreadMessages > 0 ? (
                    <span className="notification-badge"></span>
                  ) : null}
                </span>
              </OverlayTrigger>
            </div>
            <OverlayTrigger
              key="notifications"
              placement="bottom"
              overlay={
                <Tooltip id={`tooltip-notification`}>
                  {t("Notifications")}
                </Tooltip>
              }
            >
              <div>
                <div
                  className="notification-icon-wrapper"
                  onClick={markNotificationsAsSeen}
                >
                  <FaBell className="header-icon-notification" />
                  {unseenNotifications && (
                    <span className="notification-badge"></span>
                  )}
                </div>
              </div>
            </OverlayTrigger>
            <div className="user-info" onClick={toggleOffCanvas}>
              <img
                src={user.image ? user.image : Avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="user-avatar"
              />
              <span className="user-name-header">{`${user.firstName}`}</span>
            </div>
          </>
        )}
        {(!authToken || (authToken && windowWidth >= 810)) && (
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
        )}
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
            <div>
              <h6>{t("Account")}</h6>
            </div>
          </Offcanvas.Header>
          <div style={{ marginLeft: "15px" }}>
            <Offcanvas.Title>
              <img
                src={user.image ? user.image : Avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="user-avatar"
              />
              {` ${user.firstName} ${user.lastName}`}
            </Offcanvas.Title>
          </div>
          <Offcanvas.Body>
            <ul className="offcanvas-menu">
              <li className="offcanvas-option">
                <Link to={`/profile/${userId}`}>
                <FaUser className="offcanvas-icon" /> {t("Profile & Visibility")}
                </Link>
              </li>
              <li className="offcanvas-option">
                <button onClick={toggleThemeSubmenu}>
                <FaPaintBrush className="offcanvas-icon" /> {t("Theme")}
                  {showThemeSubmenu && (
                    <ul className="theme-submenu">
                      <li>
                        <button
                          className="temas"
                          onClick={() => changeTheme("light")}
                        >
                          {t("Light")}
                        </button>
                      </li>
                      <li>
                        <button
                          className="temas"
                          onClick={() => changeTheme("dark")}
                        >
                          {t("Dark")}
                        </button>
                      </li>
                    </ul>
                  )}
                </button>
              </li>
              {windowWidth < 810 && (
                <li className="offcanvas-option">
                  <button
                    onClick={() => setShowLanguageSubmenu(!showLanguageSubmenu)}
                  >
                   <FaGlobeAmericas className="offcanvas-icon" /> {t("Language")}
                    {showLanguageSubmenu && (
                      <ul className="language-submenu">
                        <li>
                          <button
                            className="idiomas"
                            onClick={() => changeLanguage("pt")}
                          >
                            {t("PT")}
                          </button>
                        </li>
                        <li>
                          <button
                            className="idiomas"
                            onClick={() => changeLanguage("en")}
                          >
                            {t("EN")}
                          </button>
                        </li>
                      </ul>
                    )}
                  </button>
                </li>
              )}
              {userRole === 0 && (
                <li className="offcanvas-option">
                  <Link to="/settings"><FaCog className="offcanvas-icon" />{t(" Application Settings")}</Link>
                </li>
              )}
              <div className= "logout-container">
              <li className="offcanvas-option">
                <button onClick={handleLogout}><FaSignOutAlt className="offcanvas-icon" />{t("Logout")}</button>
              </li>
              </div>
            </ul>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};

export default Header;
