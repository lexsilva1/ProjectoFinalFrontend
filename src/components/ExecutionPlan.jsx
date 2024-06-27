import React, { useEffect, useState } from 'react';
import { FrappeGantt } from 'frappe-gantt-react';
import { format } from 'date-fns';
import CreateTaskModal from './Modals/CreateTaskModal'; // Certifique-se do caminho correto
import { getTasks } from '../services/projectServices';
import Cookies from 'js-cookie';

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

  // Prepara as tarefas formatadas para o FrappeGantt
  const formattedTasks = tasks.map(task => ({
    id: task.id,
    name: task.title,
    start: format(new Date(task.startDate), 'yyyy-MM-dd'),
    end: format(new Date(task.endDate), 'yyyy-MM-dd'),
    progress: 0,
    dependencies: '',
  }));

  // Prepara o período do projeto se as datas estiverem disponíveis
  const projectPeriod = startDate && endDate ? [{
    id: 'project-period',
    name: 'Project Period',
    start: format(new Date(startDate), 'yyyy-MM-dd'),
    end: format(new Date(endDate), 'yyyy-MM-dd'),
    progress: 0,
    dependencies: '',
  }] : [];

  // Une o período do projeto com as tarefas formatadas
  const allTasks = [...projectPeriod, ...formattedTasks];

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="execution-plan">
      <FrappeGantt
        tasks={allTasks}
        viewMode="Day"
        barHeight={40}
        onClick={task => console.log(task)}
        onDateChange={(task, start, end) => console.log(task, start, end)}
        onProgressChange={(task, progress) => console.log(task, progress)}
      />
     
      <button className="btn btn-primary mt-3" onClick={() => setShowCreateTaskModal(true)}>
        Add Task
      </button>
      
      {showCreateTaskModal && <CreateTaskModal closeModal={() => setShowCreateTaskModal(false)} addTask={addTask} projectName={name} tasks={tasks} />}
    </div>
  );
};

export default ExecutionPlan;
