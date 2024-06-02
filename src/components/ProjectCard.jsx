import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProjectCard = ({ project, isLoggedIn }) => {
    return (
        <div className="card shadow-lg" style={{ width: '22rem', margin: '1rem' }}>
            <div className="card-body">
                <img src={project.image} alt={project.name} style={{ width: '100%', height: 'auto' }} /> {/* Adiciona a imagem do projeto */}
                <h5 className="card-title" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Name: {project.name}</h5>
                <p className="card-text" style={{ fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Status:</span> {project.status}
                </p>
                <p className="card-text" style={{ fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Keywords:</span> 
                    {project.interests && project.interests.map((interest, index) => (
                        <span key={`${project.id}-keyword-${index}`} className="badge badge-pill badge-dark" style={{ marginRight: '0.3rem', marginBottom: '0.3rem', color: 'black', fontWeight: 'normal', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)' }}>{interest}</span>
                    ))}
                </p>
                <p className="card-text" style={{ fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Skills:</span> 
                    {project.skills && project.skills.map((skill, index) => (
                        <span key={`${project.id}-skill-${index}`} className="badge badge-pill badge-light" style={{ marginRight: '0.3rem', marginBottom: '0.3rem', color: 'black', fontWeight: 'normal', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)' }}>{skill}</span>
                    ))}
                </p>
                <p className="card-text" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ fontWeight: 'bold' }}>Description:</span> 
                    {project.description}
                </p>
                {isLoggedIn && (
                    <button className="btn btn-primary">Open Project</button>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;