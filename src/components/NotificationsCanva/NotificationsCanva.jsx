import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import NotificationCard from "../Cards/NotificationCard/NotificationCard";
import userstore from "../../stores/userStore";

const NotificationsCanva = ({ show, handleClose }) => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Step 1
  const notifications = userstore((state) => state.notifications);

  const handleCheckboxChange = (e) => {
    setShowUnreadOnly(e.target.checked);
  };

  const handleSearchChange = (e) => {
    // Handler for search input
    setSearchQuery(e.target.value);
  };

  const filteredNotifications = notifications
    .filter((notification) => !showUnreadOnly || !notification.isRead)
    .filter((notification) => {
      const query = searchQuery.toLowerCase();
      // Ensure properties are not undefined before calling toLowerCase
      const projectName = notification.projectName
        ? notification.projectName.toLowerCase()
        : "";
      const date = notification.date ? notification.date.toLowerCase() : "";
      const type = notification.type ? notification.type.toLowerCase() : "";
      return (
        projectName.includes(query) ||
        date.includes(query) ||
        type.includes(query)
      );
    });

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        style={{
          maxWidth: "320px",
          backgroundColor: "var(--primary-color)",
          borderBottomRightRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <Offcanvas.Header
          closeButton
          className="offcanvas-header"
          style={{
            backgroundColor: "var(--contrast-color)",
            color: "var(--primary-color)",
            textAlign: "center",
            borderTopRightRadius: "20px",
          }}
        >
          <div
            className="d-flex align-items-center"
            style={{ marginLeft: "20%" }}
          >
            <Offcanvas.Title>Notifications</Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <div>
          <input
            type="text"
            placeholder="Search"
            style={{ borderRadius: "10px", margin: "10px" }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <label className="ml-3">
            <input
              type="checkbox"
              style={{ margin: "10px" }}
              onChange={handleCheckboxChange}
            />
            Show Unread Only
          </label>
        </div>
        <Offcanvas.Body>
          {Array.isArray(filteredNotifications) &&
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.notificationId}
                notification={notification}
              />
            ))}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NotificationsCanva;
