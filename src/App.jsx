import './App.css';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import NewProject from './pages/NewProject';
import Users from './pages/Users';
import Cookies from 'js-cookie';
import Confirmation from './pages/Confirmation';
import Profile from './pages/Profile';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/users" element={<Users />} />
        <Route path="/confirmation/:token" element={<Confirmation />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
