import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { ClockFill, InfoCircleFill, ExclamationTriangleFill, XCircleFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { fetchProjectLogs } from '../services/projectServices';
import Cookies from 'js-cookie';
import { findUserById } from '../services/userServices';
import './ProjectLogs.css';

const logLevelIcons = {
  info: <InfoCircleFill />,
  warning: <ExclamationTriangleFill />,
  error: <XCircleFill />,
};

const ProjectLogs = ({ project }) => {
  const [logs, setLogs] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const token = Cookies.get('authToken');
  const projectName = project.name;
  console.log(projectName);

  const logTypeMessages = {
    UPDATE_PROJECT_STATUS: "Update Project Status",
    // Adicione mais mapeamentos conforme necessário
  };

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const fetchedLogs = await fetchProjectLogs(token, projectName);
        const userDetailsTemp = {};

        // Para cada log, buscar informações do usuário se necessário
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
    };

    loadLogs();
  }, [projectName, token]);

  return (
    <Container className="project-logs">
      {logs && Array.isArray(logs) ? logs.map((log) => (
        <Card key={log.id} className="log-card">
          <Card.Header className="log-card-header">
            <div className="log-time">
              <Badge>
                <ClockFill className="mr-1" />
                {new Date(log.time).toLocaleString()}
              </Badge>
              {log.userId && userDetails[log.userId] && (
                <span style={{marginLeft: "25px"}}>{userDetails[log.userId].firstName}</span>
              )}
            </div>
            <div className="log-icon">
              {logLevelIcons[log.level]}
            </div>
            <h5>{log.message}</h5>
            <div>{logTypeMessages[log.type] || log.type}</div>
          </Card.Header>
          {log.details && (
            <Card.Body className="log-card-body">
              <Card.Text className="log-details">{log.details}</Card.Text>
            </Card.Body>
          )}
        </Card>
      )) : <p>No logs available.</p>}
    </Container>
    
  );
};

ProjectLogs.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectLogs;
