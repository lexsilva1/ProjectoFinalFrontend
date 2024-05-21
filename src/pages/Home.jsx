import Header from "../components/Header";
import LoginModal from "../components/LoginModal";
import React from 'react';
import RegisterModal from "../components/RegisterModal";


const Home = () => {
    return (
        <>
        <div>
            <Header />
        </div>
        <LoginModal />
        <RegisterModal />
        </>
    );
};

export default Home;