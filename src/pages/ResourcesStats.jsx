import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import VersatileBarChart from '../components/VersatileBarChat';
import { getResourceStatistics } from '../services/resourcesServices';
import Cookies from 'js-cookie';

const ResourcesStats = () => {
  const [selectedData, setSelectedData] = useState({});
  const [selectedDataProject, setSelectedDataProject] = useState({});
  const [allResourcesByProject, setAllResourcesByProject] = useState({});
  const [allResourcesByLab, setAllResourcesByLab] = useState({});
  const [selectLab, setSelectLab] = useState('ALL LABS');
  const [selectProject, setSelectProject] = useState('ALL PROJECTS');
  const token = Cookies.get('authToken');

  useEffect(() => {
    getResourceStatistics(token)
      .then((data) => {
        setAllResourcesByLab(data.resourceQuantityPerLab);
        setSelectedData(data.resourceQuantityPerLab['ALL LABS']);
        setAllResourcesByProject(data.resourceQuantityPerProject);
        setSelectedDataProject(data.resourceQuantityPerProject['ALL PROJECTS']);
        console.log(data);
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
    </>
  );
};

export default ResourcesStats;
