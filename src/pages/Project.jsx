import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import avatarProject from "../multimedia/Images/avatarProject.png";
import { getProjectByName } from "../services/projectServices";
import Cookies from "js-cookie";
import "./Project.css";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import Avatar from "../multimedia/Images/Avatar.jpg";
import userStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const [project, setProject] = useState({});
  const { projectName } = useParams();
  const token = Cookies.get("authToken");
  const currentUser = userStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const encodedProjectName = encodeURIComponent(projectName);
      console.log(encodedProjectName);
      const projectData = await getProjectByName(token, encodedProjectName);
      setProject(projectData);
    };

    fetchProject();
  }, [projectName]);

  return (
    <>
      <Header />
      <div className="app-container">
        <Sidebar />
        <div className="project-container">
          <div className="container mt-5">
            <div className="card shadow-lg">
              <img
                src={project.image ? project.image : avatarProject}
                alt={project.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h2 className="card-title"> {project.name}</h2>
                <p className="card-text-project">
                  <strong>Status:</strong> {project.status}
                </p>
                <p className="card-text-project">
                  <strong>Laboratory:</strong> {project.lab}
                </p>
                <p className="card-text-project">
                  <strong>Description: </strong>
                  {project.description}
                </p>
                <p className="card-text-project">
                  <strong>Keywords: </strong>
                  {project.interests &&
                    project.interests.map((interest, index) => (
                      <span
                        key={`${project.id}-keyword-${index}`}
                        className="badge badge-dark mr-2 mb-2"
                      >
                        {interest}
                      </span>
                    ))}
                </p>
                <p className="card-text-project">
                  <strong>Skills: </strong>
                  {project.skills &&
                    project.skills.map((skill, index) => (
                      <span
                        key={`${project.id}-skill-${index}`}
                        className="badge badge-light mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                </p>
                <p className="card-text-project">
                  <strong>Team Members:</strong>
                </p>
                {project.teamMembers &&
                  [...new Set(project.teamMembers)].map((member, index) => (
                    <div
                      key={`${project.id}-member-${index}`}
                      className="project-team-member"
                    >
                      <div className="member-container">
                        <img
                          src={member.userPhoto ? member.userPhoto : Avatar}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="project-team-member-image"
                        />
                        <span>
                          {member.firstName} {member.lastName}
                        </span>
                      </div>
                    </div>
                  ))}
                <p className="card-text-project">
                  <strong>Slots available:</strong>{" "}
                  {project &&
                    project.teamMembers &&
                    project.maxTeamMembers &&
                    `${project.maxTeamMembers - project.teamMembers.length}/${
                      project.maxTeamMembers
                    }`}
                </p>
                {project &&
                project.teamMembers &&
                project.maxTeamMembers &&
                project.maxTeamMembers > project.teamMembers.length &&
                !project.teamMembers.some(
                  (member) => member.userId === currentUser.id
                ) ? (
                  <button className="btn btn-primary">Apply</button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;