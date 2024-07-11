import Header from "../components/Header";
import LoginModal from "../components/Modals/LoginModal/LoginModal";
import React, { useState, useEffect } from "react";
import RegisterModal from "../components/Modals/RegisterModal/RegisterModal";
import Banner from "../components/Banners/Banner";
import Banner2 from "../components/Banners/Banner2";
import Banner3 from "../components/Banners/Banner3";
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";
import { getProjects } from "../services/projectServices";
import ProjectCard from "../components/Cards/ProjectCard";
import { FaSearch, FaChevronUp, FaChevronDown } from "react-icons/fa";
import InfoBox from "../components/InfoBoxs/InfoBox";
import Footer from "../components/Footer";
import ResetPasswordModal from "../components/Modals/ResetPasswordModal";
import SetPasswordModal from "../components/Modals/SetPasswordModal";
import { useLocation } from "react-router-dom";
import InfoBox2 from "../components/InfoBoxs/InfoBox2";
import InfoBox3 from "../components/InfoBoxs/InfoBox3";
import InfoBox4 from "../components/InfoBoxs/InfoBox4";
import { useTranslation } from "react-i18next";
import "./Home.css";

const Home = () => {
  const isLoggedIn = userStore((state) => state.isLoggedIn);
  const [banner, setBanner] = useState(1);
  const [projects, setProjects] = useState([]);
  const [hasFetchedProjects, setHasFetchedProjects] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(9); // Novo estado
  const location = useLocation();
  const [sortDirection, setSortDirection] = useState("");
  const currentUser = userStore((state) => state.user);
  

  useEffect(() => {
    const token = location.pathname.split("/")[2];
    if (location.pathname.startsWith("/PasswordReset/") && token) {
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
    if (isLoggedIn) {
      getProjects()
        .then((projectsData) => {
          const userProjects = projectsData.filter((project) =>
            project.teamMembers.some((member) =>
              member.userId === currentUser.id && (member.approvalStatus === "MEMBER" || member.approvalStatus === "CREATOR")
            )
          );
  
          const otherProjects = projectsData.filter((project) =>
            !project.teamMembers.some((member) =>
              member.userId === currentUser.id && (member.approvalStatus === "MEMBER" || member.approvalStatus === "CREATOR")
            )
          );
  
          const combinedProjects = [...userProjects, ...otherProjects];
          setProjects(combinedProjects);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      getProjects()
        .then((projectsData) => {
          setProjects(projectsData);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [currentUser, isLoggedIn]);

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

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);

    if (sortOption === selectedOption && sortDirection !== "desc") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortProjects = (projects) => {
    switch (sortOption) {
      case "creationDate":
        return projects.sort((a, b) =>
          sortDirection === "asc"
            ? new Date(a.creationDate) - new Date(b.creationDate)
            : new Date(b.creationDate) - new Date(a.creationDate)
        );
      case "openSlots":
        return projects.sort((a, b) => {
          const aOpenSlots =
            a.maxTeamMembers -
            a.teamMembers.filter((member) => member.approvalStatus === "MEMBER")
              .length;
          const bOpenSlots =
            b.maxTeamMembers -
            b.teamMembers.filter((member) => member.approvalStatus === "MEMBER")
              .length;
          return sortDirection === "asc"
            ? aOpenSlots - bOpenSlots
            : bOpenSlots - aOpenSlots;
        });
      case "status":
        const statusOrder = [
          "Planning",
          "Ready",
          "Approved",
          "In Progress",
          "Finished",
          "Cancelled",
        ];
        return projects.sort((a, b) =>
          sortDirection === "asc"
            ? statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
            : statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status)
        );
      default:
        return projects;
    }
  };

  const filterProjects = (projects) => {
    return projects.filter((project) => {
      const matchesSearchTerm =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.interests.some((interest) =>
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        project.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesSearchTerm;
    });
  };

  const displayedProjects = sortProjects(filterProjects(projects)).slice(
    0,
    visibleProjectsCount
  );

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      ></div>
      <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
        <Header />
      </div>
      <div>
        <div style={{ display: "flex" }}>
          {!isLoggedIn && <InfoBox />}
          <div
            className={`banner${banner} ${
              isLoggedIn ? "banner-logged-in" : "banner-logged-out"
            }`}
            style={{ width: "100%", zIndex: "-1000" }}
          >
            {banner === 1 ? (
              <Banner isLoggedIn={isLoggedIn} />
            ) : banner === 2 ? (
              <Banner2 />
            ) : (
              <Banner3 />
            )}
          </div>
        </div>
        {!isLoggedIn && <InfoBox2 />}
        {!isLoggedIn && <InfoBox3 />}
        {!isLoggedIn && <InfoBox4 />}
        <div className="content" style={{ flexGrow: 1 }}>
          <div className="search-bar-home">
            <div className="sort-bar-home">
              <FaSearch />
              <input
                type="search"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                style={{
                  border: "none",
                  marginLeft: "0.5rem",
                  height: "2.5rem",
                  outline: "none",
                  WebkitAppearance: "none",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <select
                value={sortOption}
                onChange={handleSortChange}
                style={{
                  borderRadius: "20px",
                  height: "2.5rem",
                  width: "10rem",
                  margin: "2rem",
                  backgroundColor: "white",
                }}
              >
                <option value="">Sort by...</option>
                <option value="createdDate">Date Created</option>
                <option value="openSlots">Open Slots</option>
                <option value="status">Project Status</option>
              </select>
              {sortOption && (
                <>
                  <FaChevronUp
                    onClick={() => setSortDirection("asc")}
                    style={{ marginLeft: "0.5rem", cursor: "pointer" }}
                  />
                  <FaChevronDown
                    onClick={() => setSortDirection("desc")}
                    style={{ marginLeft: "0.5rem", cursor: "pointer" }}
                  />
                </>
              )}
            </div>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <div className="project-grid">
                {displayedProjects.map((project) => (
                  <div className="project-card-container" key={project.name}>
                    <ProjectCard project={project} isLoggedIn={isLoggedIn} />
                  </div>
                ))}
              </div>
              {visibleProjectsCount < projects.length && (
                <div className="show-more-container">
                  <button
                    className="show-more-button"
                    onClick={() =>
                      setVisibleProjectsCount(visibleProjectsCount + 9)
                    }
                  >
                    Show more
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <LoginModal
          show={showLoginModal}
          handleClose={handleCloseLoginModal}
          handleOpenResetPasswordModal={handleOpenResetPasswordModal}
        />
        <ResetPasswordModal
          show={showResetPasswordModal}
          handleClose={handleCloseResetPasswordModal}
        />
        <SetPasswordModal
          show={showSetPasswordModal}
          handleClose={handleCloseSetPasswordModal}
        />
        <RegisterModal />
      </div>
      <Footer style={{ position: "fixed", bottom: 0, width: "100%" }} />
    </>
  );
};

export default Home;
