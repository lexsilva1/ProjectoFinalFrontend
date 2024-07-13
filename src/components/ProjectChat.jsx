import React, { useState } from 'react';
import useChatSocket from '../Websockets/groupChatWebsocket';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

/* ProjectChat Component: Responsible for displaying the chat of a project */

const ProjectChat = ({ isOpen, onClose }) => {
  const chatStyle = {
    right: isOpen ? '0' : '-100%',
    position: 'fixed',
    top: 0,
    height: '100%',
    width: '350px',
    transition: 'right 0.5s ease-in-out',
    backgroundColor: 'transparent',
    zIndex: 1050,
  };
  

  const token = Cookies.get('authToken');
  const { projectName } = useParams();
  console.log(projectName);
  const { setMessages, messages, sendMessage } = useChatSocket(token, projectName);
  const [message, setMessage] = useState('');
  console.log(messages);
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <section style={chatStyle}>
      <div className="row d-flex justify-content-center" style={{ height: '100%', marginRight: '20px' }}>
        <div className="col" style={{ maxWidth: '400px', height: '100%' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header d-flex justify-content-between align-items-center p-3"
              >
              <h5 className="mb-0">Group messages</h5>
              <div className="d-flex flex-row align-items-center">
                <i className="fas fa-times text-muted fa-xs" onClick={onClose}></i>
              </div>
            </div>
            <div className="card-body" data-mdb-perfect-scrollbar-init style={{ position: 'relative', height: 'calc(100% - 56px - 48px)', overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <div key={index} className="d-flex justify-content-start align-items-center mb-3">
                  <div className="d-flex flex-column align-items-start">
                    <div className="d-flex align-items-center">
                      <img src={message.userPhoto} className="rounded-circle" height="30" alt="avatar" />
                      <h6 className="ms-2">{message.sender}</h6>
                    </div>
                    <p className="mb-0 ms-5">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <div className="input-group mb-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type message"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-success" type="button" id="button-addon2"  onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectChat;