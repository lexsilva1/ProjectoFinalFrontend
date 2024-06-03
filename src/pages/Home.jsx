import Header from "../components/Header";
import LoginModal from "../components/LoginModal";
import React, { useState, useEffect } from 'react';
import RegisterModal from "../components/RegisterModal";
import Banner from "../components/Banner";
import Banner2 from "../components/Banner2";
import Banner3 from "../components/Banner3";
import Sidebar from "../components/SideBar";
import userStore from "../stores/userStore";
import { getProjects } from '../services/projectServices'; 
import ProjectCard from '../components/ProjectCard'; 
import { FaSearch } from 'react-icons/fa';
import InfoBox from "../components/InfoBox";
import Footer from "../components/Footer";

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isLoggedIn = userStore(state => state.isLoggedIn);
    const [banner, setBanner] = useState(1); 
    const [projects, setProjects] = useState([]); 
    const [hasFetchedProjects, setHasFetchedProjects] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setBanner(prevBanner => prevBanner === 3 ? 1 : prevBanner + 1); 
        }, 10000);
    
        return () => clearInterval(timer);
    }, []);
    
    useEffect(() => {
        getProjects()
            .then(setProjects)
            .catch(console.error);
    }, []);

    return (
        <>
              <Header />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            {!isLoggedIn ? <InfoBox /> : <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />} 
            <div className="content" style={{ flexGrow: 1 }}>
                <div className={`banner${banner}`}> 
                    {banner === 1 ? <Banner /> : banner === 2 ? <Banner2 /> : <Banner3 />} 
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0', justifyContent: 'flex-start', paddingLeft: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid', padding: '0.5rem', borderRadius: '10px', height: '2rem' }}>
                <FaSearch /> 
                <input 
    type="search" 
    placeholder="Search..." 
    style={{
        border: 'none', 
        marginLeft: '0.5rem', 
        height: '150%', 
        outline: 'none', 
        WebkitAppearance: 'none'
    }} 
/>
                </div>
                <select style={{ borderRadius: '10px', height: '2rem', width: '10rem', margin: '2rem' }}>
                <option value="">Sort by...</option>
                 {/* Add your sorting options here */}
                </select>
               </div>
           {projects.map(project => (
              <ProjectCard key={project.name} project={project} isLoggedIn={isLoggedIn} />
               ))}
            <LoginModal />
            <RegisterModal />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;