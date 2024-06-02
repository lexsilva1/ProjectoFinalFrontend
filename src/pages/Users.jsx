import Header from "../components/Header";
import React, { useEffect, useState } from 'react';
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";
import BannerUsers from "../components/BannerUsers";
import { findAllUsers } from "../services/userServices";
import UserCard from "../components/UserCard";
import Cookies from 'js-cookie';

const Users = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isLoggedIn = userStore(state => state.isLoggedIn); 
    const [users, setUsers] = useState([]);
    const token = Cookies.get('authToken');

    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await findAllUsers(token);
            setUsers(usersData);
        };
        fetchUsers();
    }, [token]);

    return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {isLoggedIn && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />} 
                <div className="content" style={{ flexGrow: 1 }}>
                    <BannerUsers />
                    {users.map(user => <UserCard key={user.id} user={user} />)}
                </div>
            </div>
        </>
    );
};

export default Users;