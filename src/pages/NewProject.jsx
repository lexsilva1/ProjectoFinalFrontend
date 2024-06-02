import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import { getLabs } from '../services/labServices';
import Cookies from 'js-cookie';
import avatarProject from '../multimedia/Images/avatarProject.png';

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
  const [labs, setLabs] = useState([]);
  const token = Cookies.get('authToken');
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(avatarProject);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);

    const reader = new FileReader();
    reader.onloadend = () => {
        setAvatar(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    getLabs(token)
        .then(labs => setLabs(labs))
        .catch(error => console.error(error));
  }, [token]);

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
      <Header style={{ position: 'fixed', top: 0, width: '100%', height: '60px', zIndex: 1000 }} />
      <div className="new-project" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>        
      <Sidebar style={{ position: 'fixed' }}/>
      <Container className="content" style={{ marginTop: '60px', padding: '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>          <Form>
            <Row form>
              <Col md={6}>
                <FormGroup style={{ marginBottom: '20px' }}>
                  <Label for="name" style={{ fontSize: '0.8rem' }}>Project Name</Label>
                  <Input type="text" name="name" id="name" onChange={handleInputChange} style={{ fontSize: '0.8rem' }} />
                </FormGroup>
                <FormGroup style={{ marginBottom: '20px' }}>
                  <Label for="location" style={{ fontSize: '0.8rem' }}>Location</Label>
                  <Input type="select" name="location" id="location" onChange={handleInputChange} style={{ fontSize: '0.8rem' }}>
                    <option value="">Select a lab</option>
                    {labs.map((lab, index) => (
                      <option key={index} value={lab.location}>{lab.location}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup style={{ marginBottom: '20px' }}>
                  <Label for="description" style={{ fontSize: '0.8rem' }}>Description</Label>
                  <Input type="textarea" name="description" id="description" onChange={handleInputChange} style={{ fontSize: '0.8rem' }} />
                </FormGroup>
                <FormGroup style={{ marginBottom: '20px' }}>
                  <Label for="slots" style={{ fontSize: '0.8rem' }}>Number of Slots</Label>
                  <Input type="number" name="slots" id="slots" onChange={handleInputChange} style={{ fontSize: '0.8rem' }} />
                </FormGroup>
              </Col>
            </Row>
            {['skills', 'keywords', 'materials'].map((field) => (
              <React.Fragment key={field}>
                {inputs[field].map((value, index) => (
                  <Row form key={`${field}-${index}`} style={{ marginBottom: '20px' }}>
                    <Col md={6}>
                      <FormGroup>
                        <Label for={`${field}-${index}`} style={{ fontSize: '0.8rem' }}>{index === 0 ? field.charAt(0).toUpperCase() + field.slice(1) : ''}</Label>
                        <Input
                          type="text"
                          name={`${field}-${index}`}
                          id={`${field}-${index}`}
                          value={value}
                          onChange={(event) => handleArrayChange(event, index, field)}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          style={{ fontSize: '0.8rem' }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                ))}
                <Row form>
                  <Col md={6}>
                    <Button onClick={() => addField(field)}>
                      Add {field}
                    </Button>
                  </Col>
                </Row>
              </React.Fragment>
            ))}
            <Button type="submit" color="primary" className="submit-button">Submit</Button>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default NewProject;