import React from 'react';
import { Modal, Button, Dropdown } from 'react-bootstrap';

const TypeModal = ({ show, onHide, title, type, types, onTypeSelect }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Please select
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {types.map((type, index) => (
                            <Dropdown.Item key={index} eventKey={type} onClick={() => { onTypeSelect(type); onHide(); }}>
                                {type}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
};

export default TypeModal;