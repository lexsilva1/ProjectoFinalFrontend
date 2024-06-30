import React, { useEffect, useState } from 'react';
import { add, format, set } from 'date-fns';
import CreateTaskModal from './Modals/CreateTaskModal'; // Certifique-se do caminho correto
import { getTasks, updateTask } from '../services/projectServices';
import Cookies from 'js-cookie';
import "gantt-task-react/dist/index.css";
import { Gantt, Task} from 'gantt-task-react'

const ExecutionPlan = ({ name, startDate, endDate, projectTask }) => {
  const token = Cookies.get('authToken');
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('Day'); // ['Day', 'Week', 'Month'
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [updatedPing, setUpdatedPing] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks(token, name);
        console.log('Tasks:', response.tasks);
        const tasksData = response.tasks || [];
        console.log('Tasks Data:', tasksData);
        const sortedTasks = tasksData.sort((a, b) => new Date(a.start) - new Date(b.start));
        setTasks(sortedTasks);
        
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      
      }
    };
    fetchTasks();
  }, [name, token,updatedPing]);
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? new Date() : date;
  };

  // Prepara as tarefas formatadas para o Google Gantt Chart
let tasksFormatted = tasks.map((task) => {
  return {
    id: task.id,
    name: task.title,
    start: parseDate(new Date(task.start).toISOString().slice(0, 10)),
    end: parseDate(new Date(task.end).toISOString().slice(0, 10)),
    progress: 50,
    dependencies: task.dependencies,
    isDisabled: false, // Adjust as necessary
    styles: { 
      progressColor: '#ffbb54', 
      progressSelectedColor: '#ff9e0d' 
    },
   
  };
})
  const formatedProjectTask = {
    id: projectTask.id,
    name: projectTask.name,
    start: parseDate(new Date(projectTask.start).toISOString().slice(0, 10)),
    end: parseDate(new Date(projectTask.end).toISOString().slice(0, 10)),
    progress: 50,
    dependencies: projectTask.dependencies,
    isDisabled: false, // Adjust as necessary
    styles: { 
      progressColor: '#ffbb54', 
      progressSelectedColor: '#ff9e0d' 
    },
    type: 'project',
  };
  
  tasksFormatted.push(formatedProjectTask);

const onDateChange = async (task) => { // preciso de ver isto melhor

  tasks.forEach(async (t) => {
    if (t.id === task.id) {
      t.start = format(task.start, 'yyyy-MM-dd\'T\'HH:mm:ss');
      t.end = format(task.end, 'yyyy-MM-dd\'T\'HH:mm:ss');
      tasks[tasks.indexOf(t)] = t;
      tasks.reduce((acc, t) => {
        acc[t.id] = t;
        return acc;
      }
      , {});
      addTask(t);
    }
    await updateTask(token, name, t).then(() => {
      setTasks(tasks);
     // setUpdatedPing(!updatedPing);
    });
  });
};
  


  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="execution-plan">
      <div>
        <label htmlFor="viewMode">View Mode: </label>
        <select id="viewMode" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value={viewMode.Hour}>Hour</option>
          <option value={viewMode.QuarterDay}>Quarter Day</option>
          <option value={viewMode.HalfDay}>Half Day</option>
          <option value={viewMode.Day}>Day</option>
          <option value={viewMode.Week}>Week</option>
          <option value={viewMode.Month}>Month</option>
          <option value={viewMode.Year}>Year</option>
        </select>
      </div>
{tasks && tasks.length > 0 ? (
        <Gantt
          tasks={tasksFormatted}
          viewMode={viewMode}
          onDateChange={(task) => onDateChange(task)}
        />
      ) : (
        <div>No tasks available</div>
      )}
     
      <button className="btn btn-primary mt-3" onClick={() => setShowCreateTaskModal(true)}>
        Add Task
      </button>
      
      {showCreateTaskModal && <CreateTaskModal closeModal={() => setShowCreateTaskModal(false)} addTask={addTask} projectName={name} tasks={tasks} />}
    </div>
  );
};

export default ExecutionPlan;
