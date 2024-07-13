import React from 'react';
import { FaInbox, FaEnvelope } from 'react-icons/fa';
import './MessageSidebar.css';
import { getLastMessages } from '../../services/messageServices';
import { useTranslation } from 'react-i18next';

/* 
  This component is responsible for rendering the sidebar of the messages page.
  It contains the search bar, the inbox and unread icons and the messages list.
  It also has the logic to filter the messages by the search bar and to show only the unread messages.
*/

const MessageSidebar = ({ onSearch, onInboxClick, showUnread,search,setSearch }) => {
  const { t } = useTranslation();

  
  return (
    <div className="message-sidebar">
      <h5>{t("Messages")}</h5>
      <input className="search-users" type="text" placeholder={t("Search...")} onChange={onSearch} value={search} />
      <div className="message-icons">
      <div className="inbox-icon" onClick={onInboxClick}><FaInbox /> {t("Inbox")}</div>
        <div className="unread-icon" onClick={showUnread}><FaEnvelope /> {t("Unread")}</div>
      </div>
    </div>
  );
};

export default MessageSidebar;