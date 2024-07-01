import React from 'react';

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

  return (
    <section style={chatStyle}>
      <div className="row d-flex justify-content-center" style={{ height: '100%', marginRight: '20px' }}>
        <div className="col" style={{ maxWidth: '400px', height: '100%' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header d-flex justify-content-between align-items-center p-3"
              style={{ borderTop: '4px solid #ffa900' }}>
              <h5 className="mb-0">Group messages</h5>
              <div className="d-flex flex-row align-items-center">
                <i className="fas fa-minus me-3 text-muted fa-xs"></i>
                <i className="fas fa-comments me-3 text-muted fa-xs"></i>
                <i className="fas fa-times text-muted fa-xs" onClick={onClose}></i>
              </div>
            </div>
            <div className="card-body" data-mdb-perfect-scrollbar-init style={{ position: 'relative', height: 'calc(100% - 56px - 48px)', overflowY: 'auto' }}>
              {/* Example chat messages */}
              {/* Chat messages here */}
            </div>
            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <div className="input-group mb-0">
                <input type="text" className="form-control" placeholder="Type message"
                  aria-label="Recipient's username" aria-describedby="button-addon2" />
                <button className="btn btn-warning" type="button" id="button-addon2">
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