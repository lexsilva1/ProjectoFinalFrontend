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
  const[seeDeleted, setSeeDeleted] = useState(false);
  const [viewMode, setViewMode] = useState('Day'); 
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [updatedPing, setUpdatedPing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectProgress, setProjectProgress] = useState(0);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');

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
  
  const formatedProjectTask = {
    id: projectTask.id,
    name: projectTask.name,
    start: parseDate(new Date(projectTask.start).toISOString().slice(0, 10)),
    end: parseDate(new Date(projectTask.end).toISOString().slice(0, 10)),
    progress: projectProgress,
    dependencies: projectTask.dependencies,
    isDisabled: false, // Adjust as necessary
    styles: { 
      progressColor: '#18c2de', 
      progressSelectedColor: '#2e6b75', 
    },
    type: 'project',
  };
  let tasksFormatted = [];

  // Prepara as tarefas formatadas para o Google Gantt Chart
  // Filter tasks based on `seeDeleted` flag and task status
  tasksFormatted = tasks.filter(task => seeDeleted ? task.status === 'CANCELLED' : task.status !== 'CANCELLED').map((task) => {
    return {
      id: task.id,
      name: task.title,
      start: parseDate(new Date(task.start).toISOString().slice(0, 10)),
      end: parseDate(new Date(task.end).toISOString().slice(0, 10)),
      progress: task.status === 'COMPLETED' ? 100 : (task.status === 'IN_PROGRESS' ? 50 : 0), // Adjust as necessary
      dependencies: task.dependencies,
      isDisabled: task.status === 'COMPLETED' || task.status === 'CANCELLED', // Adjust as necessary
      styles: { 
        progressColor: '#ffbb54', 
        progressSelectedColor: task.status === 'COMPLETED' ? '#e0f7fa' : (task.status === 'CANCELLED' ? '#fde2e4' : (task.status === 'IN_PROGRESS' ? '#6b18de' : '#6e030e')),
        backgroundColor: task.status === 'COMPLETED' ? '#e0f7fa' : (task.status === 'CANCELLED' ? '#fde2e4' : (task.status === 'IN_PROGRESS' ? '#6b18de' : '#6e030e')) // Adjust as necessary
      },
      type: task.title === 'Final Presentation' ? 'milestone' : 'task',
    };
  });

tasksFormatted.push(formatedProjectTask);
//tasksFormatted = tasksFormatted.sort((a, b) => new Date(a.start) - new Date(b.start));
tasksFormatted.sort((a, b) => {
  if (a.type === 'project') {
    return -1;
  } else if (b.type === 'project') {
    return 1;
  } else if (a.type === 'milestone') {
    return 1;
  } else if (b.type === 'milestone') {
    return -1;
  } else {
    return 0;
  }
});
 

const onDateChange = async (task) => {
  for (const t of tasks) {
    if (t.id === task.id) {
      t.start = format(task.start, 'yyyy-MM-dd\'T\'HH:mm:ss');
      t.end = format(task.end, 'yyyy-MM-dd\'T\'HH:mm:ss');
      setTaskToUpdate(t); // This is synchronous but triggers an async re-render

      // Assuming updateTask is an async function that returns a promise
      await updateTask(token, name, t).then(() => {
        const updatedTasks = tasks.map(taskItem => taskItem.id === t.id ? t : taskItem);
        addTask(t); // Assuming this is meant to update some state or perform some action
        setTasks(updatedTasks); // Trigger re-render with updated tasks
        setTaskToUpdate(null); // Reset taskToUpdate state
      });

      break; // Exit loop after finding and processing the matching task
    }
  }
};
const onProgressChange = async (task) => {
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
  
const handleDeleteTask = async (task) => {
  // Clone tasks array to avoid direct state mutation
  let updatedTasks = [...tasks];
  let taskFound = false;

  // Update the task status to 'CANCELLED' if found
  updatedTasks = updatedTasks.map((t) => {
    if (t.id === task.id) {
      taskFound = true;
      return { ...t, status: 'CANCELLED' };
    }
    return t;
  });

  // Early exit if task is not found
  if (!taskFound) {
    console.log('Task not found');
    return;
  }

  // Update the state only if the task is found and updated
  setTasks(updatedTasks);

  // Find and set the task to update
  const taskToUpdate = updatedTasks.find((t) => t.id === task.id);
  setTaskToUpdate(taskToUpdate);

  // Log the task to update
  console.log('TaskToUpdate:', taskToUpdate);

  // Update the task in the backend
  await updateTask(token, name, taskToUpdate).then(() => {
    // Optionally, refresh tasks from the backend here
    console.log('Task updated successfully');
    setTaskToUpdate(null); // Reset taskToUpdate state
    setUpdatedPing(!updatedPing);
  }).catch((error) => {
    console.error('Failed to update task:', error);
  });
};



  const addTask = (task) => {
    setTasks([...tasks, task]);
    setUpdatedPing(!updatedPing);
  };

  return (
    <div className="execution-plan">
      <div style={{backgroundColor: "var(--contrast-color", height: "60px", borderTopRightRadius:"5px", borderTopLeftRadius:"5px"}}>
        <label htmlFor="viewMode" style={{color:"white", margin:"15px"}}>View Mode: </label>
        <select id="viewMode" style={{borderRadius:"5px"}} value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value={viewMode.Hour}>Hour</option>
          <option value={viewMode.QuarterDay}>Quarter Day</option>
          <option value={viewMode.HalfDay}>Half Day</option>
          <option value={viewMode.Day}>Day</option>
          <option value={viewMode.Week}>Week</option>
          <option value={viewMode.Month}>Month</option>
          <option value={viewMode.Year}>Year</option>
        </select>
        <label htmlFor="seeDeleted">See Deleted Tasks: </label>
        <input id="seeDeleted" type="checkbox" checked={seeDeleted} onChange={(e) => setSeeDeleted(e.target.checked)} />
      </div>
{tasks && tasks.length > 0 ? (
        <Gantt
          tasks={tasksFormatted}
          viewMode={viewMode}
          onDateChange={(task) => onDateChange(task)}
          onDoubleClick={(task) => handleTaskDoubleClick(task)}
          onProgressChange={(task) => onProgressChange(task)}
          onDelete={(task) => handleDeleteTask(task)} 
          
        />
      ) : (
        <div>No tasks available</div>
      )}
     
     <button className="btn btn-primary mt-3" style={{margin: "10px", float: "right", width: "150px"}} onClick={() => { setIsEditMode(false); setShowTaskModal(true); }}>
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
  setUpadatePing={() => setUpdatedPing(!updatedPing)}
  
/>
      )}
    </div>
  );
};

export default ExecutionPlan;
