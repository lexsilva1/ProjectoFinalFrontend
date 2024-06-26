import React, { useState } from 'react';
import { FrappeGantt } from 'frappe-gantt-react';
import CreateTaskModal from '../components/Modals/CreateTaskModal';

const ExecutionPlan = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      name: 'Análise de Requisitos',
      start: '2023-01-01',
      end: '2023-01-05',
      progress: 100,
    },
    {
      id: '2',
      name: 'Design',
      start: '2023-01-06',
      end: '2023-01-08',
      progress: 60,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Add Task</button>
      <FrappeGantt tasks={tasks} />
      {isModalOpen && (
        <CreateTaskModal
          closeModal={() => setIsModalOpen(false)}
          addTask={addTask}
        />
      )}
    </div>
  );
};

export default ExecutionPlan;

