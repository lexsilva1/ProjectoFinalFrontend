import React from 'react';
import { Modal, Button, Dropdown } from 'react-bootstrap';

const TypeModal = ({ name, stringArray, show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Please select
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {stringArray.map((str, index) => (
                            <Dropdown.Item key={index} eventKey={str}>
                                {str}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TypeModal;