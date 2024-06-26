import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateTaskModal.css';

const CreateTaskModal = ({ closeModal, addTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now().toString(),
      name: title,
      start: selectedDate.toISOString().split('T')[0],
      end: selectedDate.toISOString().split('T')[0],
      progress: 0,
    };
    addTask(newTask);
    closeModal();
  };

  return (
    <Modal isOpen={true} onRequestClose={closeModal} contentLabel="Create Task" ariaHideApp={false}>
      <div className="modal-create-task-header">
        <h2>Create Task</h2>
        <button onClick={closeModal} className="close-button">&times;</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-create-task-body">
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Comments</label>
            <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
          </div>
        </div>
        <div className="modal-create-task-footer">

          <div>
            <button type="button" className="action-button">Members</button>
            <button type="button" className="action-button">Dates</button>
            <button type="button" className="action-button">Dependencies</button>
            <button type="submit" className="create-button">Create</button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
