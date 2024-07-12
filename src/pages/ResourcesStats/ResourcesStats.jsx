import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import VersatileBarChart from "../../components/Charts/VersatileBarChat";
import { getResourceStatistics } from "../../services/resourcesServices";
import Cookies from "js-cookie";
import Header from "../../components/Header/Header";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import "./ResourcesStats.css";
import { Pie } from "recharts";

const ResourcesStats = () => {
  const [selectedData, setSelectedData] = useState({});
  const [selectedDataProject, setSelectedDataProject] = useState({});
  const [allResourcesByProject, setAllResourcesByProject] = useState({});
  const [allResourcesByLab, setAllResourcesByLab] = useState({});
  const [selectLab, setSelectLab] = useState("Coimbra");
  const [selectProject, setSelectProject] = useState("Forge X");
  const token = Cookies.get("authToken");
  const [hash, setHash] = useState([]);

  const replaceVilaReal = (data) => {
    const newData = {};
    Object.keys(data).forEach((key) => {
      const newKey = key.replace(/Vila_Real/g, "Vila Real");
      newData[newKey] = data[key];
    });
    return newData;
  };

  useEffect(() => {
    getResourceStatistics(token)
      .then((data) => {
        const processedLabData = replaceVilaReal(data.resourceQuantityPerLab);
        const processedProjectData = replaceVilaReal(
          data.resourceQuantityPerProject
        );

        setAllResourcesByLab(processedLabData);
        setSelectedData(processedLabData["Coimbra"]);
        setAllResourcesByProject(processedProjectData);
        setSelectedDataProject(processedProjectData["Forge X"]);
        setHash(data.allresources);
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
      <Header />
      <div style={{ display: "flex" }}>
        <Container
          fluid
          className="my-custom-container"
          style={{ marginTop: "100px" }}
        >
          <Row>
            <Col xs={12} md={6}>
              <div>
                <h4 style={{ marginBottom: "20px" }}>
                  Lab Resource Quantities
                </h4>
                <Dropdown>
                  <Dropdown.Toggle
                    className="lab-chart-button"
                    id="dropdown-basic"
                  >
                    {selectLab}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.keys(allResourcesByLab).map((lab) => (
                      <Dropdown.Item
                        key={lab}
                        onClick={() => handleSelectChange(lab)}
                      >
                        {lab}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <VersatileBarChart data={selectedData} />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div>
                <h4 style={{ marginBottom: "20px" }}>
                  Project Resource Quantities
                </h4>
                <Dropdown>
                  <Dropdown.Toggle
                    className="lab-chart-button"
                    id="dropdown-basic"
                  >
                    {selectProject}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.keys(allResourcesByProject).map((project) => (
                      <Dropdown.Item
                        key={project}
                        onClick={() => handleSelectChangeProject(project)}
                      >
                        {project}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <VersatileBarChart data={selectedDataProject} />
              </div>
            </Col>
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "60px",
            }}
          >
            <Col xs={12} md={12}>
              <div style={{textAlign: "center"}}>
                <h4>Resource Types</h4>
                {hash && <CustomPieChart data={hash} />}
              </div>
            </Col>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ResourcesStats;
