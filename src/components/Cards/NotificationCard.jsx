import React from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import "./NotificationCard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  manageInvitesApplications,
  rejectInvitesApplications,
  getProjectByName,
} from "../../services/projectServices";
import Cookies from "js-cookie";
import userStore from "../../stores/userStore";
import avatarProject from "../../multimedia/Images/avatarProject.jpg";
import { set } from "react-hook-form";

const NotificationCard = ({ notification }) => {
  const { projectName, date, type, isRead, notificationId, otherUserid } =
    notification;
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const user = userStore((state) => state.user);
  const notifications = userStore((state) => state.notifications);
  const setNotifications = userStore((state) => state.setNotifications);
  const [projectImage, setProjectImage] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      const encodedProjectName = encodeURIComponent(projectName);
      const projectData = await getProjectByName(token, encodedProjectName);
      setProjectImage(projectData.image);
    };
    fetchProject();
  }, [projectName, token]);

  const handleClick = () => {
    if (projectName.includes(" ")) {
      const formattedProjectName = projectName.replace(" ", "%20");
      navigate(`/project/${formattedProjectName}`);
    } else {
      navigate(`/project/${projectName}`);
    }
  };
  const handleAccept = async (event) => {
    event.stopPropagation();
    let operation = "ACCEPT_INVITATION";
    if (type === "INVITE") {
      const newNotification = await manageInvitesApplications(
        token,
        projectName,
        user.id,
        operation,
        notificationId
      );
      newNotification.isRead = true;
      const newNotifications = notifications.filter(
        (notification) => notification.notificationId !== notificationId
      );
      setNotifications([...newNotifications, newNotification]);
      console.log(newNotifications);
    }
  };
  const handleDecline = async (event) => {
    event.stopPropagation();
    let operation = "ACCEPT_INVITATION";
    if (type === "INVITE") {
      const newNotification = await rejectInvitesApplications(
        token,
        projectName,
        user.id,
        operation,
        notificationId
      );
      newNotification.isRead = true;
      const newNotifications = notifications.filter(
        (notification) => notification.notificationId !== notificationId
      );
      setNotifications([...newNotifications, newNotification]);
    }
  };

  return (
    <Card className={isRead ? "Read" : "Unread"} onClick={handleClick}>
        <Card.Text style={{fontSize: "12px"}}>{type}</Card.Text>
        {type === "INVITE" && (
            <p style={{margin: "2px", fontWeight: "normal", fontSize: "small"}}>You have been invited to join this project</p>
        )}
      <Card.Body style={{width: "100%", height: "100%"}}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Card.Title className="notification-title">
          <img
            src={projectImage ? projectImage : avatarProject}
            alt="Project"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              marginRight: "10px",
              objectFit: "cover",

            }}
          />
          {projectName}
        </Card.Title>
        </div>
        <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
      </Card.Body>
      {type === "INVITE" ? (
        <div>
          <ButtonGroup>
            <Button variant="primary" style = {{marginRight: "10px", borderRadius: "20px"}} onClick={handleAccept}>
              Accept
            </Button>
            <Button variant="danger" style = {{marginLeft: "10px", borderRadius: "20px"}}  onClick={handleDecline}>
              Decline
            </Button>
          </ButtonGroup>
        </div>
      ) : null}
    </Card>
  );
};

export default NotificationCard;
