import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import VersatileBarChart from '../components/VersatileBarChat';

const ResourcesStats = () => {
  const [selectedData, setSelectedData] = useState({});

  const allResourcesByLab = {
    "Tomar": {},
    "Lisboa": {},
    "Vila_Real": {
        "RAM": 4
    },
    "Porto": {},
    "Coimbra": {
        "Windows 10 License": 3,
        "CPU": 5
    },
    "Viseu": {}
  };

  const handleSelectChange = (lab) => {
    setSelectedData(allResourcesByLab[lab]);
  };

  return (
    <div>
      <h2>Project Resource Quantities</h2>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select Lab
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(allResourcesByLab).map((lab) => (
            <Dropdown.Item key={lab} onClick={() => handleSelectChange(lab)}>{lab}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <VersatileBarChart data={selectedData} />
    </div>
  );
};

export default ResourcesStats;
