import React from 'react';
import { Modal, Dropdown } from 'react-bootstrap';
import './TypeModal.css'; 

const TypeModal = ({ show, onHide, title, types, onTypeSelect }) => {
    return (
        <Modal show={show} onHide={onHide} size="sm" centered className="custom-modal-size">
            <Modal.Header  closeButton  style = {{backgroundColor: "var(--details-color)"}}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "5%", textAlign: 'center' }}>
    <p style={{ fontSize: "20px" }}>Please select a type:</p>
    <Dropdown>
    <Dropdown.Toggle style={{ backgroundColor: "var(--contrast-color)", padding: "10px 20px" }} id="dropdown-basic">
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
        </Modal>
    );
};

export default TypeModal;