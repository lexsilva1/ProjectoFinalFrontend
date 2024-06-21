import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import BannerUsers from "../components/Banners/BannerUsers";
import UserCard from "../components/Cards/UserCard";
import Cookies from "js-cookie";
import userStore from "../stores/userStore";
import { findAllUsers } from "../services/userServices";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("name");
  const token = Cookies.get("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await findAllUsers(token);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterUsers = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return users.filter((user) => {
      switch (filterOption) {
        case "name":
          return user.firstName && user.firstName.toLowerCase().includes(lowercasedFilter);
        case "skill":
          return user.skills && user.skills.some((skill) => skill && skill.toLowerCase().includes(lowercasedFilter));
        case "interest":
          return user.interests && user.interests.some((interest) => interest && interest.toLowerCase().includes(lowercasedFilter));
        default:
          return false;
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de submissão (se necessário)
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: "1" }}>
        <Sidebar />
        <div style={{ flex: "1", overflow: "auto" }}>
          <BannerUsers />
          <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", alignItems: "center", gap: "10px", paddingLeft: "10%" }}>
            <div style={{ width: "40%", position: "relative", maxWidth: "300px" }}>
              <FaSearch style={{ position: "absolute", top: "15px", left: "10px" }} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ width: "100%", padding: "10px 10px 10px 40px", borderRadius: "20px" }}
                autoFocus
              />
            </div>
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              style={{ width: "60%", padding: "10px", maxWidth: "200px", borderRadius: "20px", marginLeft: "20px" }}
            >
              <option value="name">Search by Name</option>
              <option value="skill">Search by Skill</option>
              <option value="interest">Search by Interest</option>
            </select>
            <button type="submit" style={{ display: "none" }}>Submit</button>
          </form>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              padding: "10px",
              paddingLeft: "120px",
            }}
          >
            {filterUsers().map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
