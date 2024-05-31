import Header from "../components/Header";
import React, { useState } from 'react';
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";
import BannerUsers from "../components/BannerUsers";

const Users = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isLoggedIn = userStore(state => state.isLoggedIn); 

    return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {isLoggedIn && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />} 
                <div className="content" style={{ flexGrow: 1 }}>
                    <BannerUsers />
                </div>
            </div>
        </>
    );
};

export default Users;