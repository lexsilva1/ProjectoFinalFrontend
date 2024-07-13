import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import CreateTaskModal from "../Modals/CreateTaskModal/CreateTaskModal";
import { getTasks, updateTask } from "../../services/projectServices";
import Cookies from "js-cookie";
import "gantt-task-react/dist/index.css";
import { Gantt, Task } from "gantt-task-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./ExecutionPlan.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-toggle/css/bootstrap-toggle.min.css";

/*ExecutionPlan component is a functional component that displays the tasks of a project in a Gantt chart.
 It uses the Gantt component from the gantt-task-react library to display the tasks in a Gantt chart. 
 The component fetches the tasks of a project using the getTasks function from the projectServices module. 
 It also provides functionality to add, edit, and delete tasks using the CreateTaskModal component. 
 The component uses the useState hook to manage the state of the tasks, seeDeleted, viewMode, showCreateTaskModal, 
 updatedPing, showTaskModal, isEditMode, selectedTask, projectProgress, taskToUpdate, isMobile, dateViewMode, and dates. 
 The component uses the useEffect hook to fetch the tasks of a project when the component is mounted.
  The component also provides functionality to handle task double click, save task, parse date, add task, on date change,
  on progress change, handle delete task, find dependencies, and render mobile view.*/

const ExecutionPlan = ({ name, startDate, endDate, projectTask }) => {
  const token = Cookies.get("authToken");
  const [tasks, setTasks] = useState([]);
  const [seeDeleted, setSeeDeleted] = useState(false);
  const [viewMode, setViewMode] = useState("Day");
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [updatedPing, setUpdatedPing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectProgress, setProjectProgress] = useState(0);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 680);
  const [dateViewMode, setDateViewMode] = useState(true);
  const [dates, setDates] = useState("hide");


  // Check if the window is resized to determine if the user is on a mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 680);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch tasks when the component is mounted
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks(token, name);
        const tasksData = response.tasks || [];
        const sortedTasks = tasksData.sort(
          (a, b) => new Date(a.start) - new Date(b.start)
        );
        setTasks(sortedTasks);
        let projectProgress = 0;
        let completedTasks = 0;
        tasksData.forEach((task) => {
          if (task.status === "COMPLETED") {
            completedTasks++;
          }
        });
        projectProgress = (completedTasks / tasksData.length) * 100;
        setProjectProgress(projectProgress);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };
    fetchTasks();
  }, [name, token, updatedPing]);

  // Handle task double click
  const handleTaskDoubleClick = (task) => {
    tasks.forEach((t) => {
      if (t.id === task.id) {
        setSelectedTask(t);
      }
      setIsEditMode(true);
      setShowTaskModal(true);
    });
  };

  // Function to save the updated task
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

  // Function to parse the date string
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? new Date() : date;
  };

  // Format the project task
  const formatedProjectTask = {
    id: projectTask.id,
    name: projectTask.name,
    start: parseDate(new Date(projectTask.start).toISOString().slice(0, 10)),
    end: parseDate(new Date(projectTask.end).toISOString().slice(0, 10)),
    progress: projectProgress,
    dependencies: projectTask.dependencies,
    isDisabled: true,
    styles: {
      progressColor: "#18c2de",
      progressSelectedColor: "#2e6b75",
    },
    type: "project",
  };

  let tasksFormatted = [];

  tasksFormatted = tasks
    .filter((task) =>
      seeDeleted ? task.status === "CANCELLED" : task.status !== "CANCELLED"
    )
    .map((task) => {
      return {
        id: task.id,
        name: task.title,
        start: parseDate(new Date(task.start).toISOString().slice(0, 10)),
        end: parseDate(new Date(task.end).toISOString().slice(0, 10)),
        progress:
          task.status === "COMPLETED"
            ? 100
            : task.status === "IN_PROGRESS"
            ? 50
            : 0,
        dependencies: task.dependencies,
        isDisabled: task.status === "COMPLETED" || task.status === "CANCELLED",
        styles: {
          progressColor: "#ffbb54",
          progressSelectedColor:
            task.status === "COMPLETED"
              ? "#e0f7fa"
              : task.status === "CANCELLED"
              ? "#fde2e4"
              : task.status === "IN_PROGRESS"
              ? "#6b18de"
              : "#6e030e",
          backgroundColor:
            task.status === "COMPLETED"
              ? "#e0f7fa"
              : task.status === "CANCELLED"
              ? "#fde2e4"
              : task.status === "IN_PROGRESS"
              ? "#6b18de"
              : "#6e030e",
        },
        type: task.title === "Final Presentation" ? "milestone" : "task",
      };
    });

  tasksFormatted.push(formatedProjectTask);

  tasksFormatted.sort((a, b) => {
    if (a.type === "project") {
      return -1;
    } else if (b.type === "project") {
      return 1;
    } else if (a.type === "milestone") {
      return 1;
    } else if (b.type === "milestone") {
      return -1;
    } else {
      return 0;
    }
  });

  // Function to update the task date
  const onDateChange = async (task) => {
    for (const t of tasks) {
      if (t.id === task.id) {
        t.start = format(task.start, "yyyy-MM-dd'T'HH:mm:ss");
        t.end = format(task.end, "yyyy-MM-dd'T'HH:mm:ss");
        setTaskToUpdate(t);

        await updateTask(token, name, t).then(() => {
          const updatedTasks = tasks.map((taskItem) =>
            taskItem.id === t.id ? t : taskItem
          );
          addTask(t);
          setTasks(updatedTasks);
          setTaskToUpdate(null);
        });

        break;
      }
    }
  };

  // Function to handle the date view mode
  const handleDateViewMode = () => {
    setDateViewMode(!dateViewMode);
    if (dateViewMode) {
      setDates("show");
    } else {
      setDates("hide");
    }
  };

  // Function to handle the progress change
  const onProgressChange = async (task) => {
    tasks.forEach(async (t) => {
      if (t.id === task.id) {
        if (task.dependencies.length > 0) {
          const dependenciesCompleted = task.dependencies.every(
            (dependencyId) => {
              const dependencyTask = tasks.find((t) => t.id === dependencyId);
              return dependencyTask && dependencyTask.status === "COMPLETED";
            }
          );

          if (dependenciesCompleted) {
            if (task.progress === 100) {
              t.status = "COMPLETED";
            } else if (task.progress > 0 && task.progress < 100) {
              t.status = "IN_PROGRESS";
            } else {
              t.status = "NOT_STARTED";
            }

            tasks[tasks.indexOf(t)] = t;
            tasks.reduce((acc, t) => {
              acc[t.id] = t;
              return acc;
            }, {});
            addTask(t);
          } else {
            tasksFormatted.forEach((t) => {
              if (t.id === task.id) {
                t.progress = 0;
                alert(
                  "You cannot complete this task because it has dependencies that are not completed"
                );
              }
            });
          }
        } else {
          if (task.progress === 100) {
            t.status = "COMPLETED";
          } else if (task.progress > 0 && task.progress < 100) {
            t.status = "IN_PROGRESS";
          } else {
            t.status = "NOT_STARTED";
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
      });
    });
  };

  // Function to handle the delete task
  const handleDeleteTask = async (task) => {
    let updatedTasks = [...tasks];
    let taskFound = false;

    updatedTasks = updatedTasks.map((t) => {
      if (t.id === task.id) {
        taskFound = true;
        return { ...t, status: "CANCELLED" };
      }
      return t;
    });

    if (!taskFound) {
      console.log("Task not found");
      return;
    }

    setTasks(updatedTasks);

    const taskToUpdate = updatedTasks.find((t) => t.id === task.id);
    setTaskToUpdate(taskToUpdate);

    await updateTask(token, name, taskToUpdate)
      .then(() => {
        console.log("Task updated successfully");
        setTaskToUpdate(null);
        setUpdatedPing(!updatedPing);
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
      });
  };

  // Function to find the dependencies of a task
  const findDependencies = (dependencies, tasks) => {
    if (!dependencies) {
      return [];
    }
    return dependencies
      .map((dependency) => {
        const task = tasks.find((t) => t.id === dependency);
        return task ? task.title : undefined;
      })
      .filter((title) => title !== undefined);
  };

  // Function to add a task
  const addTask = (task) => {
    setTasks([...tasks, task]);
    setUpdatedPing(!updatedPing);
  };

  // Function to render the mobile view. This function returns a list of tasks in an accordion format.
  const renderMobileView = () => (
    <ul className="accordion">
      {tasks.map((task) => (
        <li className="accordion-item" key={task.id}>
          <input id={`task-${task.id}`} className="hide" type="checkbox" />
          <label htmlFor={`task-${task.id}`} className="accordion-label">
            {task.title}
            <FontAwesomeIcon
              icon={faEdit}
              onClick={() => {
                setSelectedTask(task);
                setIsEditMode(true);
                setShowTaskModal(true);
              }}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            />
          </label>
          <div className="accordion-child">
            <p>Start: {format(task.start, "yyyy-MM-dd")}</p>
            <p>End: {format(task.end, "yyyy-MM-dd")}</p>
            <p>
              Status:{" "}
              {task.status === "COMPLETED"
                ? "Completed"
                : task.status === "IN_PROGRESS"
                ? "In Progress"
                : task.status === "CANCELLED"
                ? "Cancelled"
                : "Not Started"}
            </p>
            <p>
              Dependencies:{" "}
              {task.dependencies && task.dependencies.length > 0
                ? findDependencies(task.dependencies, tasks).join(", ")
                : "no dependencies"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="execution-plan">
      <div
        style={{
          backgroundColor: "var(--contrast-color",
          height: "60px",
          borderTopRightRadius: "5px",
          borderTopLeftRadius: "5px",
        }}
      >
        {!isMobile && (
          <div>
            <label
              htmlFor="viewMode"
              style={{ color: "white", margin: "15px" }}
            >
              View Mode:{" "}
            </label>
            <select
              id="viewMode"
              style={{ borderRadius: "5px" }}
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
            <div className="form-check form-switch" style={{ float: "right" }}>
              <label
                class="form-check-label"
                for="flexSwitchCheckDefault"
                htmlFor="seeDeleted"
              >
                See Deleted Tasks:{" "}
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={seeDeleted}
                onChange={(e) => setSeeDeleted(e.target.checked)}
              />
              <button
                type="button"
                data-toggle="button"
                aria-pressed="false"
                autocomplete="off"
                className="btn btn-primary"
                style={{ float: "right", margin: "10px" }}
                onClick={handleDateViewMode}
              >
                {dates === "hide" ? "Hide Dates" : "Show Dates"}
              </button>
            </div>
          </div>
        )}
      </div>
      {isMobile ? (
        renderMobileView()
      ) : tasks && tasks.length > 0 ? (
        <Gantt
          tasks={tasksFormatted}
          viewMode={viewMode}
          onDateChange={(task) => onDateChange(task)}
          onDoubleClick={(task) => {
            if (task.type !== "project") {
              handleTaskDoubleClick(task);
            }
          }}
          onProgressChange={(task) => onProgressChange(task)}
          onDelete={(task) => handleDeleteTask(task)}
          listCellWidth={dateViewMode ? undefined : ""}
        />
      ) : (
        <div>No tasks available</div>
      )}

      <button
        className="btn btn-primary mt-3"
        style={{ margin: "10px", float: "right", width: "150px" }}
        onClick={() => {
          setIsEditMode(false);
          setShowTaskModal(true);
        }}
      >
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
