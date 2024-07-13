import React from 'react';
import './WarningPage.css';
import { useNavigate } from 'react-router-dom';
const WarningPage = () => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/');
    };
    return (
        <div className="access-denied-container">
            <h1>403 - Acesso Negado</h1>
            <p>Desculpe, você não tem permissão para acessar esta página.</p>
            <button onClick={handleNavigate} >voltar</button>
        </div>
    );
};

export default WarningPage;