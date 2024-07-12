import React, { useEffect, useState } from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";
import Cookies from "js-cookie";
import Avatar from "../../../multimedia/Images/Avatar.jpg";
import userStore from "../../../stores/userStore";
import "./UsersModal.css";
import { useTranslation } from "react-i18next";

/* Users Modal component
The modal that is displayed when the user wants to add a user to a project. It shows the list of users
and a search bar to filter the users by name. The user can add a user to the project by clicking the add button */

const UsersModal = ({
  show,
  handleClose,
  inputs,
  setInputs,
  users,
  onAddUser,
}) => {
  const [search, setSearch] = useState("");
  const token = Cookies.get("authToken");
  const { t } = useTranslation();

  // Filter users by name
  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  //Function that adds a user to the project and updates the team members list
  const handleAdd = (userToAdd) => {
    if (onAddUser) {
      onAddUser(userToAdd);
    }

    console.log(userToAdd);
    const projectMember = {
      userId: userToAdd.userId,
      firstName: userToAdd.firstName,
      lastName: userToAdd.lastName,
      isProjectManager: false,
      userPhoto: userToAdd.userPhoto,
    };

    const updatedTeamMembers = [...(inputs.teamMembers || []), projectMember];
    setInputs({ ...inputs, teamMembers: updatedTeamMembers });
    users.splice(users.indexOf(userToAdd), 1);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} className="users-modal large-modal">
      <Modal.Header closeButton className="users-modal-header">
        <Modal.Title>{t("Users")}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="users-modal-body">
        <Form className="users-modal-form">
          <FormControl
            type="text"
            placeholder= {t("Search")}
            className="mr-sm-2 users-modal-search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form>
        {filteredUsers.map((user, index) => (
          <div key={index} className="users-modal-user">
            <img
              src={user.userPhoto ? user.userPhoto : Avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="users-modal-avatar"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "1rem",
              }}
            />
            <div className="users-modal-name">{`${user.firstName} ${user.lastName}`}</div>
            <Button
              variant="primary"
              className="users-modal-add"
              onClick={() => handleAdd(user)}
            >
              {t("Add")}
            </Button>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default UsersModal;
