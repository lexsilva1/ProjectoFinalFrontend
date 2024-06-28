import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import CreateTaskModal from './Modals/CreateTaskModal'; // Certifique-se do caminho correto
import { getTasks } from '../services/projectServices';
import Cookies from 'js-cookie';
import { Chart } from 'react-google-charts';

const ExecutionPlan = ({ name, startDate, endDate }) => {
  const token = Cookies.get('authToken');
  const [tasks, setTasks] = useState([]);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks(token, name);
        const tasksData = response.tasks || [];
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }
    };
    fetchTasks();
  }, [name, token]);

  // Prepara as tarefas formatadas para o Google Gantt Chart
  const formattedTasks = tasks.map(task => [
    task.title,
    task.title,
    null,
    new Date(task.startDate),
    new Date(task.endDate),
    null,
    0,
    null,
  ]);

  // Estrutura de dados inicial para o Google Gantt Chart
  const chartData = [
    [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ],
    ...formattedTasks,
  ];

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="execution-plan">
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="Gantt"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          height: 400,
        }}
        rootProps={{ 'data-testid': '1' }}
      />
     
      <button className="btn btn-primary mt-3" onClick={() => setShowCreateTaskModal(true)}>
        Add Task
      </button>
      
      {showCreateTaskModal && <CreateTaskModal closeModal={() => setShowCreateTaskModal(false)} addTask={addTask} projectName={name} tasks={tasks} />}
    </div>
  );
};

export default ExecutionPlan;
