import Header from "../components/Header";
import LoginModal from "../components/LoginModal";
import React, { useState } from 'react';
import RegisterModal from "../components/RegisterModal";
import Banner from "../components/Banner";
import Sidebar from "../components/SideBar";

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
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