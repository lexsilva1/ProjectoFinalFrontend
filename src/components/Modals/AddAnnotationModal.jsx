import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, ListGroup } from 'react-bootstrap';
import { createProjectLog, getTasks } from '../../services/projectServices';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const AddAnnotationModal = ({ show, handleClose, projectName, onLogAdded }) => {
  const [annotation, setAnnotation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("authToken");
  const [tasks, setTasks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await getTasks(token, projectName);
        const fetchedTasks = response.tasks;
        if (Array.isArray(fetchedTasks)) {
          setTasks(fetchedTasks);
        } else {
          console.error(
            "Expected fetchedTasks to be an array, got:",
            typeof fetchedTasks
          );
          setTasks([]); // Default to an empty array if fetchedTasks is not an array
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]); // Default to an empty array in case of error
      }
    };

    if (projectName) {
      loadTasks();
    }
  }, [projectName, token]);



  const handleAnnotationChange = (e) => {
    const value = e.target.value;
    setAnnotation(value);

    if (value.includes("@")) {
      const searchTerm = value.substring(value.lastIndexOf("@") + 1);
      if (searchTerm.length > 0) {
        const filteredTasks = tasks.filter(
          (task) =>
            typeof task.title === "string" &&
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filteredTasks);
      } else {
        // Se não houver texto após o @, mostre todas as tarefas
        setSuggestions(tasks);
      }
    } else {
      setSuggestions([]);
    }
  };


  const onSelectSuggestion = (suggestion) => {
    const newValue = `${annotation.substring(
      0,
      annotation.lastIndexOf("@") + 1
    )}${suggestion.title}`; // Changed from suggestion.name to suggestion.title
    setAnnotation(newValue);
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
      const logDto = { log: annotation };
      await createProjectLog(token, projectName, logDto);
      setAnnotation("");
      handleClose();
      if (onLogAdded) {
        onLogAdded(); // Chama o evento onLogAdded após adicionar a anotação com sucesso
      }
    } catch (error) {
      setError(`Failed to add annotation: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Annotation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Annotation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={annotation}
              onChange={handleAnnotationChange}
            />
            {suggestions.length > 0 && (
              <ListGroup>
                {suggestions.map((suggestion) => (
                  <ListGroup.Item
                    key={suggestion.id}
                    onClick={() => onSelectSuggestion(suggestion)}
                    style={{ cursor: "pointer", color: "black" }}
                  >
                    {suggestion.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddAnnotationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  projectName: PropTypes.string.isRequired,
  onLogAdded: PropTypes.func, // Add this line
};

export default AddAnnotationModal;