import React from 'react';
import { FaInbox, FaEnvelope } from 'react-icons/fa';
import './MessageSidebar.css';



const MessageSidebar = ({ onSearch, onInboxClick }) => {
  return (
    <div className="message-sidebar">
      <input className="search-users" type="text" placeholder="Search..." onChange={onSearch} />
      <div className="message-icons">
      <div className="inbox-icon" onClick={onInboxClick}><FaInbox /> Inbox</div>
        <div className="unread-icon"><FaEnvelope /> Unread</div>
      </div>
    </div>
  );
};

export default MessageSidebar;