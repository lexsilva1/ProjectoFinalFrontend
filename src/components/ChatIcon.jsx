import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const ChatIcon = ({ onChatIconClick }) => (
  <div style={{ position: 'relative', height: '10vh', width: '100vw' }}>
    <div
      style={{ position: 'absolute', top: '90px', right: '40px', cursor: 'pointer' }}
      onClick={onChatIconClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onChatIconClick(); }}
    >
      <FontAwesomeIcon icon={faCommentDots} size="2x" />
    </div>
  </div>
);

export default ChatIcon;