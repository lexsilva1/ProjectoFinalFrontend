import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import BannerUsers from "../components/Banners/BannerUsers";
import UserCard from "../components/Cards/UserCard";
import Cookies from "js-cookie";
import userStore from "../stores/userStore";
import { findAllUsers } from "../services/userServices";
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("name");
  const token = Cookies.get("authToken");
  const user = userStore((state) => state.user);

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
    const currentUserId = user.id;
    return users.filter((user) => {
      if (user.userId === currentUserId) {
        return false;
      }
      switch (filterOption) {
        case "name":
          return (
            (user.firstName &&
             user.firstName.toLowerCase().includes(lowercasedFilter)) ||
            (user.lastName &&
             user.lastName.toLowerCase().includes(lowercasedFilter))
          );
        case "skill":
          return (
            user.skills &&
            user.skills.some(
              (skill) => skill && skill.toLowerCase().includes(lowercasedFilter)
            )
          );
        case "interest":
          return (
            user.interests &&
            user.interests.some(
              (interest) =>
                interest && interest.toLowerCase().includes(lowercasedFilter)
            )
          );
        default:
          return false;
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <div style={{ display: "flex", flex: "1" }}>
        <div style={{ flex: "1", overflow: "auto" }}>
          <BannerUsers />
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
              />
            </div>
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="filter-select"
            >
              <option value="name">Search by Name</option>
              <option value="skill">Search by Skill</option>
              <option value="interest">Search by Interest</option>
            </select>
          </form>
          <div className="users-grid">
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
