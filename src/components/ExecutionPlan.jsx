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
  const [viewMode, setViewMode] = useState('Day'); 
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [updatedPing, setUpdatedPing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectProgress, setProjectProgress] = useState(0);

  const handleTaskDoubleClick = (task) => {
    tasks.forEach((t) => {
      if (t.id === task.id) {
    setSelectedTask(t);
      }
    setIsEditMode(true);
    setShowTaskModal(true);
  }
  );
};

const handleSaveTask = (updatedTask) => {

  setTasks((prevTasks) => {
    return prevTasks.map((task) => {
      if (task.id === updatedTask.id) {
        return updatedTask;
      }
      return task;
    });
  });
};

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks(token, name);
        console.log('Tasks:', response.tasks);
        const tasksData = response.tasks || [];
        console.log('Tasks Data:', tasksData);
        const sortedTasks = tasksData.sort((a, b) => new Date(a.start) - new Date(b.start));
        setTasks(sortedTasks);
        let projectProgress = 0;
        let completedTasks = 0;
        tasksData.forEach((task) => {
          if (task.status === 'COMPLETED') {
            completedTasks++;
          }
        });
        projectProgress = (completedTasks / tasksData.length) * 100;
        setProjectProgress(projectProgress);

        
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
    
    progress: task.status === 'COMPLETED' ? 100 :(task.status === 'IN_PROGRESS' ? 50 : 0), // Adjust as necessary
    dependencies: task.dependencies,
    isDisabled: task.status === 'COMPLETED' || task.status === 'CANCELLED' ? true : false, // Adjust as necessary
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
    progress: projectProgress,
    dependencies: projectTask.dependencies,
    isDisabled: false, // Adjust as necessary
    styles: { 
      progressColor: '#2e6b75', 
      progressSelectedColor: '#2e6b75', 
    },
    type: 'project',
  };
  
  tasksFormatted.push(formatedProjectTask);

const onDateChange = async (task) => { 

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
const onProgressChange = async (task) => {
  debugger;
  tasks.forEach(async (t) => {
    if (t.id === task.id) {
    if(task.dependencies.length > 0){
      
        const dependenciesCompleted = task.dependencies.every(dependencyId => {
          const dependencyTask = tasks.find(t => t.id === dependencyId);
          return dependencyTask && dependencyTask.status === 'COMPLETED';
        });

        if (dependenciesCompleted) {
          if (task.progress === 100) {
            t.status = 'COMPLETED';
          } else if (task.progress > 0 && task.progress < 100) {
            t.status = 'IN_PROGRESS';
          } else {
            t.status = 'NOT_STARTED';
          }

          tasks[tasks.indexOf(t)] = t;
          tasks.reduce((acc, t) => {
            acc[t.id] = t;
            return acc;
          }, {});
          addTask(t);
        }else{
          
          tasksFormatted.forEach((t) => {
            if (t.id === task.id) {
              t.progress = 0;
              alert('You cannot complete this task because it has dependencies that are not completed');
            }
          });
        }
      }else{
        if (task.progress === 100) {
          t.status = 'COMPLETED';
        } else if (task.progress > 0 && task.progress < 100) {
          t.status = 'IN_PROGRESS';
        } else {
          t.status = 'NOT_STARTED';
        }

        tasks[tasks.indexOf(t)] = t;
        tasks.reduce((acc, t) => {
          acc[t.id] = t;
          return acc;
        }, {});
        addTask(t);
      }
    }
    await updateTask(token, name, t).then(() => {
      setTasks(tasks);
      //setUpdatedPing(!updatedPing);
    });
  });
};
  
const rtl = false;

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
          onDoubleClick={(task) => handleTaskDoubleClick(task)}
          onProgressChange={(task) => onProgressChange(task)}
          onTaskDelete={(task) => console.log('Task deleted:', task)} 
          rtl={rtl}
        />
      ) : (
        <div>No tasks available</div>
      )}
     
     <button className="btn btn-primary mt-3" onClick={() => { setIsEditMode(false); setShowTaskModal(true); }}>
     Add Task
      </button>

      {showTaskModal && (
        <CreateTaskModal
  closeModal={() => setShowTaskModal(false)}
  addTask={handleSaveTask}
  projectName={name}
  tasks={tasks}
  selectedTask={isEditMode ? selectedTask : null}
  isEditMode={isEditMode}
/>
      )}
    </div>
  );
};

export default ExecutionPlan;
