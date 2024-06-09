import React, { useEffect, useState } from "react";
import { Modal, Button, Form, FormControl } from "react-bootstrap";
import { findAllUsers } from "../../services/userServices";
import Cookies from "js-cookie";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import userStore from "../../stores/userStore";
import "./UsersModal.css";

const UsersModal = ({ show, handleClose, onAdd }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const token = Cookies.get("authToken");
  const currentUser = userStore((state) => state.user);

  useEffect(() => {
    findAllUsers(token).then((allUsers) => {
      const otherUsers = allUsers.filter((user) => user.id !== currentUser.id);
      setUsers(otherUsers);
    });
  }, [currentUser]);

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAdd = (userToAdd) => {
    onAdd(userToAdd);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} className="users-modal large-modal">
      <Modal.Header closeButton className="users-modal-header">
        <Modal.Title>Users</Modal.Title>
      </Modal.Header>
      <Modal.Body className="users-modal-body">
        <Form className="users-modal-form">
          <FormControl
            type="text"
            placeholder="Search"
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
              Add
            </Button>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default UsersModal;
