import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { ClockFill, InfoCircleFill, ExclamationTriangleFill, XCircleFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { fetchProjectLogs, createProjectLog, getTasks, getProjectByName } from '../services/projectServices';
import Cookies from 'js-cookie';
import { findUserById } from '../services/userServices';
import './ProjectLogs.css';

const logLevelIcons = {
  info: <InfoCircleFill />,
  warning: <ExclamationTriangleFill />,
  error: <XCircleFill />,
};

const ProjectLogs = ({ project, logUpdateTrigger }) => {
  const [logs, setLogs] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [annotation, setAnnotation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = Cookies.get('authToken');
  const projectName = project.name;

  const logTypeMessages = {
    UPDATE_PROJECT_STATUS: "Update Project Status",
    PROJECT_CREATED: "Project Created",
    APPLY_USER: "User Applied to Project",
    USER_LEFT: "User Left Project",
    ACCEPT_USER: "User Accepted to Project",
    INVITE_USER: "User Invited to Project",
    PROMOTE_USER: "User Promoted to Project Manager",
    DEMOTE_USER: "User Demoted from Project Manager",
    REMOVE_USER: "User Removed from Project",
    CREATE_TASK: "Task Created",
    UPDATE_TASK: "Task Updated",
  };

  useEffect(() => {
    const loadLogsAndTasks = async () => {
      // Load logs
      try {
        const fetchedLogs = await fetchProjectLogs(token, project.name);
        const userDetailsTemp = {};

        for (const log of fetchedLogs) {
          if (log.userId && !userDetailsTemp[log.userId]) {
            try {
              const userInfo = await findUserById(token, log.userId);
              userDetailsTemp[log.userId] = userInfo;
            } catch (error) {
              console.error("Failed to fetch user details:", error);
            }
          }
        }

        setLogs(fetchedLogs);
        setUserDetails(userDetailsTemp);
      } catch (error) {
        console.error("Failed to fetch project logs:", error);
      }

      // Load tasks
      try {
        const response = await getTasks(token, project.name);
        const fetchedTasks = response.tasks;
        if (Array.isArray(fetchedTasks)) {
          setTasks(fetchedTasks);
        } else {
          console.error("Expected fetchedTasks to be an array, got:", typeof fetchedTasks);
          setTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
      }
    };

    loadLogsAndTasks();
  }, [project.name, token, logUpdateTrigger]);

  const handleAnnotationChange = async (e) => {
    const value = e.target.value;
    setAnnotation(value);

    if (value.includes("#") && !/\S#\S/.test(value)) {
      const searchTerm = value.substring(value.lastIndexOf("#") + 1);
      if (searchTerm.length > 0) {
        const filteredTasks = tasks.filter(
          (task) =>
            typeof task.title === "string" &&
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filteredTasks);
      } else {
        setSuggestions(tasks);
      }
    } else if (value.includes("@") && !/\S@\S/.test(value)) {
      const searchTerm = value.substring(value.lastIndexOf("@") + 1);
      try {
        const projectDetails = await getProjectByName(token, project.name);
        const projectMembers = projectDetails.teamMembers.filter(member => 
          member.approvalStatus === "MEMBER" || member.approvalStatus === "CREATOR"
        );
        if (searchTerm.length > 0) {
          const filteredMembers = projectMembers.filter(
            (member) =>
              `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSuggestions(filteredMembers);
        } else {
          setSuggestions(projectMembers);
        }
      } catch (error) {
        console.error("Failed to fetch project members:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const onSelectSuggestion = (suggestion) => {
    let newAnnotation = annotation;
    if (suggestion.firstName && suggestion.lastName) {
      // Member suggestion
      const memberName = `${suggestion.firstName} ${suggestion.lastName}`.trim();
      setSelectedUser(suggestion);
      const atIndex = annotation.lastIndexOf("@");
      newAnnotation = `${annotation.substring(0, atIndex)}@${memberName} `;
    } else if (suggestion.title) {
      // Task suggestion
      const taskTitle = suggestion.title.trim();
      setSelectedTask(suggestion);
      const hashIndex = annotation.lastIndexOf("#");
      newAnnotation = `${annotation.substring(0, hashIndex)}#${taskTitle} `;
    }
    setAnnotation(newAnnotation);
    setSuggestions([]);
  };

  const onSave = async () => {
    if (!annotation.trim()) {
      setError("Annotation cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      // Obtém a data e hora atuais
      const now = new Date();
      const currentTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
  
      const logDto = {
        log: annotation,
        taskId: selectedTask ? selectedTask.id : null,
        otherUserId: selectedUser ? selectedUser.userId : null,
        time: currentTime // Ajustado para a hora local
      };
  
      console.log(logDto);
  
      const newDto = await createProjectLog(token, projectName, logDto);
      setLogs([ newDto, ...logs]);
      setAnnotation("");
      setSelectedTask(null);
      setSelectedUser(null);
    } catch (error) {
      setError(`Failed to add annotation: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="project-logs d-flex flex-column">
      <p className='logs-title'>Project Logs</p>
      <div className="logs-section flex-grow-1 overflow-auto" style={{border: "solid 1px #ddd"}}>
        {logs && Array.isArray(logs) ? logs.map((log) => (
          <Card key={log.id} className="log-card" style={{marginTop: "10px"}}>
            <Card.Header className="log-card-header">
              <div className="log-time">
                <Badge>
                  <ClockFill className="mr-1" />
                  {new Date(log.time).toLocaleString()}
                </Badge>
                {log.userId && userDetails[log.userId] && (
                  <span style={{marginLeft: "25px"}}>{userDetails[log.userId].firstName} {userDetails[log.userId].lastName}</span>
                )}
              </div>
              <div className="log-icon">
                {logLevelIcons[log.level]}
              </div>
              <h5>{log.message}</h5>
              <div>{log.type === 'OTHER' ? log.log : (logTypeMessages[log.type] || log.type)}</div>
            </Card.Header>
         
          </Card>
        )) : <p>No logs available.</p>}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="mt-3">
      <Form.Group controlId="annotation">
  <Form.Control
    as="textarea"
    rows="3"
    value={annotation}
    onChange={handleAnnotationChange}
    placeholder="Add Annotation" 
  />
</Form.Group>
        {suggestions.length > 0 && (
          <ListGroup>
            {suggestions.map((suggestion) => (
              <ListGroup.Item key={suggestion.id} onClick={() => onSelectSuggestion(suggestion)} className="suggestion-item" style={{ cursor: "pointer" }}>
                {suggestion.firstName && suggestion.lastName
                  ? <span className="member-suggestion">{`${suggestion.firstName} ${suggestion.lastName}`}</span>
                  : suggestion.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        <Button variant="primary" style={{marginTop: "10px"}} onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Annotation"}
        </Button>
      </Form>
    </Container>
  );
};

ProjectLogs.propTypes = {
  project: PropTypes.object.isRequired,
  logUpdateTrigger: PropTypes.func.isRequired,
};

export default ProjectLogs;
