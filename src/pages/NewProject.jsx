import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';

const NewProject = () => {
  const [inputs, setInputs] = useState({
    name: '',
    location: '',
    description: '',
    slots: '',
    skills: [''],
    keywords: [''],
    materials: [''],
  });

  const handleInputChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const handleArrayChange = (event, index, field) => {
    const newValues = [...inputs[field]];
    newValues[index] = event.target.value;
    setInputs({ ...inputs, [field]: newValues });
  };

  const addField = (field) => {
    setInputs({ ...inputs, [field]: [...inputs[field], ''] });
  };

  return (
    <>
      <Header style={{ position: 'fixed', top: 0, zIndex: 1000 }} />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Sidebar style={{ position: 'fixed'}} />
        <Container className="content" style={{ flexGrow: 1, marginTop: '60px', paddingTop: '60px' }}>
          <Form>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Project Name</Label>
                  <Input type="text" name="name" id="name" onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="location">Location</Label>
                  <Input type="select" name="location" id="location" onChange={handleInputChange}>
                    {/* Options */}
                  </Input>
                </FormGroup>
                {/* Add other form groups for the left column here */}
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input type="textarea" name="description" id="description" onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="slots">Number of Slots</Label>
                  <Input type="number" name="slots" id="slots" onChange={handleInputChange} />
                </FormGroup>
                {/* Add other form groups for the right column here */}
              </Col>
            </Row>
            {['skills', 'keywords', 'materials'].map((field) =>
              <Row form>
                {inputs[field].map((value, index) => (
                  <Col md={6}>
                    <FormGroup key={`${field}-${index}`}>
                      <Label for={`${field}-${index}`}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input
                        type="text"
                        name={`${field}-${index}`}
                        id={`${field}-${index}`}
                        value={value}
                        onChange={(event) => handleArrayChange(event, index, field)}
                      />
                    </FormGroup>
                  </Col>
                ))}
                <Col md={12}>
                  <Button onClick={() => addField(field)}>
                    Add {field}
                  </Button>
                </Col>
              </Row>
            )}
            <Button type="submit" color="primary" style={{ marginTop: '20px' }}>Submit</Button>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default NewProject;