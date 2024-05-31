import Header from "../components/Header";
import LoginModal from "../components/LoginModal";
import React, { useState, useEffect } from 'react';
import RegisterModal from "../components/RegisterModal";
import Banner from "../components/Banner";
import Banner2 from "../components/Banner2";
import Banner3 from "../components/Banner3";
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isLoggedIn = userStore(state => state.isLoggedIn);
    const [banner, setBanner] = useState(1); // Altere o estado inicial para 1

    useEffect(() => {
        const timer = setInterval(() => {
            setBanner(prevBanner => prevBanner === 3 ? 1 : prevBanner + 1); // Altere para o próximo banner ou volte para o primeiro
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {isLoggedIn && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />} 
                <div className="content" style={{ flexGrow: 1 }}>
                    <div className={`banner${banner}`}> 
                        {banner === 1 ? <Banner /> : banner === 2 ? <Banner2 /> : <Banner3 />} 
                    </div>
                    <LoginModal />
                    <RegisterModal />
                </div>
            </div>
        </>
    );
};

export default Home;