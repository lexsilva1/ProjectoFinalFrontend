import Header from "../components/Header";
import LoginModal from "../components/Modals/LoginModal";
import React, { useState, useEffect } from "react";
import RegisterModal from "../components/Modals/RegisterModal";
import Banner from "../components/Banners/Banner";
import Banner2 from "../components/Banners/Banner2";
import Banner3 from "../components/Banners/Banner3";
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";
import { getProjects } from "../services/projectServices";
import ProjectCard from "../components/Cards/ProjectCard";
import { FaSearch } from "react-icons/fa";
import InfoBox from "../components/InfoBox";
import Footer from "../components/Footer";
import ResetPasswordModal from "../components/Modals/ResetPasswordModal";
import SetPasswordModal from "../components/Modals/SetPasswordModal";
import { useNavigate, useLocation } from "react-router-dom";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = userStore((state) => state.isLoggedIn);
  const [banner, setBanner] = useState(1);
  const [projects, setProjects] = useState([]);
  const [hasFetchedProjects, setHasFetchedProjects] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = location.pathname.split("/")[2];
    if (location.pathname.startsWith('/PasswordReset/') && token) {
      setShowSetPasswordModal(true);
    }
  }, [location]);

  const handleCloseSetPasswordModal = () => {
    setShowSetPasswordModal(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setBanner((prevBanner) => (prevBanner === 3 ? 1 : prevBanner + 1));
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const handleOpenResetPasswordModal = () => {
    setShowLoginModal(false);
    setShowResetPasswordModal(true);
  };

  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
  };

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
        <Header />
      </div>
      {isLoggedIn && (
        <div
          style={{ paddingTop: "70px", position: "absolute", width: "100%" }}
        >
          <div style={{ position: "fixed" }}>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
      <div style={{ marginLeft: isLoggedIn ? "200px" : "0px" }}>
        <div className={`banner${banner}`} style={{ width: "100%" }}>
          {banner === 1 ? <Banner /> : banner === 2 ? <Banner2 /> : <Banner3 />}
        </div>
        {!isLoggedIn && <InfoBox />}
        <div className="content" style={{ flexGrow: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "1rem 0",
              justifyContent: "flex-start",
              paddingLeft: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                padding: "0.5rem",
                borderRadius: "10px",
                height: "2rem",
              }}
            >
              <FaSearch />
              <input
                type="search"
                placeholder="Search..."
                style={{
                  border: "none",
                  marginLeft: "0.5rem",
                  height: "150%",
                  outline: "none",
                  WebkitAppearance: "none",
                }}
              />
            </div>
            <select
              style={{
                borderRadius: "10px",
                height: "2rem",
                width: "10rem",
                margin: "2rem",
              }}
            >
              <option value="">Sort by...</option>
              {/* Add your sorting options here */}
            </select>
          </div>
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              isLoggedIn={isLoggedIn}
            />
          ))}
<LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} handleOpenResetPasswordModal={handleOpenResetPasswordModal} />      
      <ResetPasswordModal show={showResetPasswordModal} handleClose={handleCloseResetPasswordModal} />
      <SetPasswordModal show={showSetPasswordModal} handleClose={handleCloseSetPasswordModal} />
        <RegisterModal />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
