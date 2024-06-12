import { useTranslation } from 'react-i18next';
import userStore from '../stores/userStore';
import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './Header.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; 
import { logout } from '../services/userServices';
import Avatar from '../multimedia/Images/Avatar.jpg';
import logo2 from '../multimedia/Images/logo2.png';


const Header = () => {
  const { t, i18n } = useTranslation();
  const isLoggedIn = userStore((state) => state.isLoggedIn);
  const setIsLoggedIn = userStore((state) => state.setIsLoggedIn);
  const setShowLogin = userStore((state) => state.setShowLogin);
  const setShowRegister = userStore((state) => state.setShowRegister);
  const navigate = useNavigate();
  const user = userStore((state) => state.user);
  const authToken = Cookies.get("authToken");

  const handleShow = () => setShowLogin(true);
  const handleShowRegister = () => setShowRegister(true);

  const handleLogout = () => {
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
    <Navbar expand="lg" className="header">
      <Navbar.Brand href="#">
        {isLoggedIn && (
          <img
            src={logo2}
            alt="Logo"
            width="145"
            height="40"
            className="d-inline-block align-top"
            style={{ marginLeft: "20px" }}
          />
        )}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="justify-content-end">
          {!authToken && (
            <>
              <Button variant="outline" className="button" onClick={handleShow}>
                {t("Login")}
              </Button>
              <Button
                variant="outline"
                className="button2"
                onClick={handleShowRegister}
              >
                {t("Sign Up")}
              </Button>
            </>
          )}
          {authToken && user && (
            <>
              <div className="user-info">
                <img
                  src={user.image ? user.image : Avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="userImageHeader"
                />
                <span className="user-name">{`${user.firstName} ${user.lastName}`}</span>
              </div>
              <Button
                variant="outline"
                className="button"
                onClick={handleLogout}
              >
                {t("Logout")}
              </Button>
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
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;