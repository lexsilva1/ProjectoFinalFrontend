import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NewProject from './pages/NewProject';
import Users from './pages/Users';
import Cookies from 'js-cookie';
import Confirmation from './pages/Confirmation';
import Profile from './pages/Profile';
import Project from './pages/Project';
import Inventory from './pages/Inventory';
import userStore from './stores/userStore';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard';
import ResourcesStats from './pages/ResourcesStats';
import SettingsPage from './pages/SettingsPage';

function App() {
  const theme = Cookies.get('theme') || 'light';

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/users" element={<Users />} />
        <Route path="/confirmation/:token" element={<Confirmation />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/project/:projectName" element={<Project />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/PasswordReset/:token" element={<Home />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:userId" element={<Messages />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources-stats" element={<ResourcesStats />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}

export default App;
