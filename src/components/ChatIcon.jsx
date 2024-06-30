import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const ChatIcon = () => (
  <div className="chat-icon">
    <FontAwesomeIcon icon={faCommentDots} />
  </div>
);

export default ChatIcon;