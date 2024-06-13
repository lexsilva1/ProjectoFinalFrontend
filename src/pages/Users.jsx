import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";
import BannerUsers from "../components/Banners/BannerUsers";
import { findAllUsers } from "../services/userServices";
import UserCard from "../components/Cards/UserCard";
import Cookies from "js-cookie";

const Users = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = userStore((state) => state.isLoggedIn);
  const [users, setUsers] = useState([]);
  const token = Cookies.get("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await findAllUsers(token);
      setUsers(usersData);
    };
    fetchUsers();
  }, [token]);
  
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: "1" }}>
        <Sidebar />
        <div style={{ flex: "1", overflow: "auto" }}>
          <BannerUsers />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              padding: "10px",
              paddingLeft: "220px",
            }}
          >
            {users.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
