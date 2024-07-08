import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import VersatileBarChart from '../components/VersatileBarChat';
import { getResourceStatistics } from '../services/resourcesServices';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import CustomPieChart from '../components/CustomPieChart';
import './ResourcesStats.css';
import { Pie } from 'recharts';


const ResourcesStats = () => {
  const [selectedData, setSelectedData] = useState({});
  const [selectedDataProject, setSelectedDataProject] = useState({});
  const [allResourcesByProject, setAllResourcesByProject] = useState({});
  const [allResourcesByLab, setAllResourcesByLab] = useState({});
  const [selectLab, setSelectLab] = useState('Coimbra');
  const [selectProject, setSelectProject] = useState('Forge X');
  const token = Cookies.get('authToken');
  const [hash, setHash] = useState([]);

  useEffect(() => {
    getResourceStatistics(token)
      .then((data) => {
        setAllResourcesByLab(data.resourceQuantityPerLab);
        setSelectedData(data.resourceQuantityPerLab['Coimbra']);
        setAllResourcesByProject(data.resourceQuantityPerProject);
        setSelectedDataProject(data.resourceQuantityPerProject['Forge X']);
        setHash(data.allresources)
        console.log(data);
        console.log (data.resourceQuantityPerLab['Coimbra']);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  const handleSelectChange = (lab) => {
    setSelectedData(allResourcesByLab[lab]);
    setSelectLab(lab);
  };

  const handleSelectChangeProject = (project) => {
    setSelectedDataProject(allResourcesByProject[project]);
    setSelectProject(project);
  };

  return (
    <>
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
      <Container fluid className="my-custom-container">
        <Row >
        <Col xs={12} md={6}>
      <div>
        
        <h2>Lab Resource Quantities</h2>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectLab}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.keys(allResourcesByLab).map((lab) => (
              <Dropdown.Item key={lab} onClick={() => handleSelectChange(lab)}>{lab}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <VersatileBarChart data={selectedData} />
      </div>
    </Col>
    <Col xs={12} md={6}>
      <div>
        <h2>Project Resource Quantities</h2>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectProject}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.keys(allResourcesByProject).map((project) => (
              <Dropdown.Item key={project} onClick={() => handleSelectChangeProject(project)}>{project}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <VersatileBarChart data={selectedDataProject} />
        
      </div>
    </Col>
  </Row>
  <Row>
    <Col xs={12} md={6}>
      <div>
        <h2>Resource Types</h2>
       {hash && <CustomPieChart data={hash} />}
      </div>
    </Col>
  </Row>
</Container>
    </div>
    </>
  );
};

export default ResourcesStats;
