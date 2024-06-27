import React, { useState } from 'react';
import Modal from 'react-modal';
import Avatar from '../../multimedia/Images/Avatar.jpg';
import { FaSearch } from "react-icons/fa";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    padding: '20px',
    borderRadius: '10px', 
    position: 'relative', 
  },
};

const MembersModal = ({ isOpen, onRequestClose, members, handleSelectUser, selectionType }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar membros com base no termo de pesquisa
  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      ariaHideApp={false} 
      style={customStyles}
    >
      <h2>Project Members</h2>
      <button 
        onClick={onRequestClose} 
        className="close-button" 
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          cursor: 'pointer'
        }}
      >
        &times;
      </button>
      
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: '20px 0' }}>
        <FaSearch style={{ position: 'absolute', marginLeft: '10px', color: '#ccc' }} />
        <input
          type="text"
          placeholder="Search members..."
          style={{
            paddingLeft: '40px', 
            width: '60%', 
            height: '40px', 
            borderRadius: '20px', 
            border: '1px solid #ccc', 
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div style={{marginTop: '20px'}}>
        {filteredMembers.map((member) => (
          <div key={member.id} style={{marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
            <img 
              src={member.photo || Avatar} 
              alt={`${member.firstName} ${member.lastName}`} 
              style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}
            />
            <span style={{marginRight: 'auto'}}>{member.firstName} {member.lastName}</span>
            <button onClick={() => handleSelectUser(member, selectionType)}>Add</button> 
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default MembersModal;
