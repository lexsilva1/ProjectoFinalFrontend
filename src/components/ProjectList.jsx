import React, { useState, useEffect } from 'react';
import { findUserById } from '../services/userServices';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/projectServices';
import Cookies from 'js-cookie';
import avatarProject from '../multimedia/Images/avatarProject.jpg';
import './ProjectList.css';
import { useTranslation } from 'react-i18next';

const ProjectList = ({ userId }) => {
  const [projectsDetails, setProjectsDetails] = useState([]);
  const [sortType, setSortType] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");
  const token = Cookies.get("authToken");
  const { t } = useTranslation();


  const getStatusClass = (status) => {
    switch (status) {
      case "Planning": return "project-card-status-profile project-card-status-profile-planning";
      case "Ready": return "project-card-status-profile project-card-status-profile-ready";
      case "Approved": return "project-card-status-profile project-card-status-profile-approved";
      case "In Progress": return "project-card-status-profile project-card-status-profile-in-progress";
      case "Cancelled": return "project-card-status-profile project-card-status-profile-cancelled";
      case "Finished": return "project-card-status-profile project-card-status-profile-finished";
      default: return "project-card-status-profile";
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const user = await findUserById(token, userId);
      const allProjects = await getProjects(token);
      let userProjectsDetails = allProjects
        .filter((project) => user.projects.includes(project.name))
        .map(({ name, image, creationDate, status }) => ({
          name,
          image,
          creationDate,
          status,
        }));

      userProjectsDetails.sort((a, b) => {
        let comparison = 0;
        if (sortType === "status") {
          comparison = a.status.localeCompare(b.status);
        } else if (sortType === "creationDate") {
          comparison = new Date(a.creationDate) - new Date(b.creationDate);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });

      setProjectsDetails(userProjectsDetails);
    };
    fetchProjects();
  }, [userId, token, sortType, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="project-list-card"> 
      <h4>Projectos:</h4>
      <div>
        <label>Ordenar por: </label>
        <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
          <option value="status">Status</option>
          <option value="creationDate">Data de Criação</option>
        </select>
        <button onClick={toggleSortOrder}>
          {sortOrder === "asc" ? "^" : "v"}
        </button>
      </div>
      {projectsDetails.map((project, index) => (
        <Link to={`/project/${project.name}`} style={{ textDecoration: 'none' }}>
        <div key={index} className="project-card-profile">
          <img src={project.image || avatarProject} alt="Project" className="project-image-profile" />
          <div className="project-details">
            <p>Nome: {project.name}</p>
            <div className={getStatusClass(project.status)}>
              {t(project.status)}
            </div>
          </div>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;