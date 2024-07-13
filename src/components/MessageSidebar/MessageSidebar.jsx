import React from 'react';
import { FaInbox, FaEnvelope } from 'react-icons/fa';
import './MessageSidebar.css';
import { getLastMessages } from '../../services/messageServices';



const MessageSidebar = ({ onSearch, onInboxClick, showUnread,search,setSearch }) => {

  
  return (
    <div className="message-sidebar">
      <h5>Messages</h5>
      <input className="search-users" type="text" placeholder="Search..." onChange={onSearch} value={search} />
      <div className="message-icons">
      <div className="inbox-icon" onClick={onInboxClick}><FaInbox /> Inbox</div>
        <div className="unread-icon" onClick={showUnread}><FaEnvelope /> Unread</div>
      </div>
    </div>
  );
};

export default MessageSidebar;