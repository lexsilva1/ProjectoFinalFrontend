import Header from "../components/Header";
import LoginModal from "../components/LoginModal";
import React, { useState } from 'react';
import RegisterModal from "../components/RegisterModal";
import Banner from "../components/Banner";
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isLoggedIn = userStore(state => state.isLoggedIn); 

    return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {isLoggedIn && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />} 
                <div className="content" style={{ flexGrow: 1 }}>
                    <Banner />
                    <LoginModal />
                    <RegisterModal />
                </div>
            </div>
        </>
    );
};

export default Home;