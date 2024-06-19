import React, { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getStatistics } from '../services/projectServices';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import PDFExportButton from '../components/PDFExportButton'; // Importando o componente PDFExportButton
import './Dashboard.css';

const COLORS = {
    'Planning': '#87CEEB', // Azul claro
    'In Progress': '#FFA500', // Laranja
    'Ready': '#32CD32', // Verde
    'Approved': '#00008B', // Roxo
    'Cancelled': '#FF4500', // Vermelho
    'Completed': '#006400' // Verde escuro
};

const STATUS_ORDER = ['Planning', 'In Progress', 'Ready', 'Approved', 'Cancelled', 'Completed'];

const Dashboard = () => {
    const [data, setData] = useState(null);
    const token = Cookies.get('authToken');
    const contentRef = useRef(null); 

    useEffect(() => {
        const fetchData = async () => {
            const result = await getStatistics(token);
            console.log(result); 
            setData(result);
        };

        fetchData();
    }, [token]);

    if (!data) {
        return <div>Loading...</div>;
    }

    const totalProjects = data.totalProjects || 0;

    const calculatePercentage = (count) => {
        return totalProjects ? (count / totalProjects) * 100 : 0;
    };

    const projectStatusData = STATUS_ORDER.map(status => ({
        name: status,
        value: calculatePercentage(Object.values(data[`total${status.replace(/\s/g, '')}Projects`]).reduce((a, b) => a + b, 0))
    }));

    const labs = Object.keys(data.projectsByLab);
    const labCharts = labs.map((lab) => {
        const labTotal = data.projectsByLab[lab];
        const labData = STATUS_ORDER.map((status) => {
            const statusCount = data[`total${status.replace(/\s/g, '')}Projects`][lab] || 0;
            return {
                name: status,
                value: labTotal ? (statusCount / labTotal) * 100 : 0,
            };
        });

        console.log(`Lab: ${lab}, Lab Total: ${labTotal}, Lab Data:`, labData);

        return (
            <Col key={lab} md={6} className="mb-4">
                <Card className="shadow-sm">
                    <Card.Body className="chart-content">
                        <Card.Title>{lab}</Card.Title>
                        <PieChart width={300} height={300}> {/* Reduzindo o tamanho do gráfico */}
                            <Pie data={labData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                {labData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#000000'} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: "10px" }} formatter={(value, entry) => `${value}: ${parseFloat(entry.payload.value).toFixed(2)}%`} />
                        </PieChart>
                    </Card.Body>
                </Card>
            </Col>
        );
    });

    return (
        <div className="dashboard">
            <Header />
            <Sidebar />
            <Container ref={contentRef} id="export-pdf" className="mt-4">
                <h1 className="text-center mb-4">ForgeXperimental Projects Dashboard </h1>
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Total Projects</Card.Title>
                                <h2>{totalProjects}</h2>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Average Members per Project</Card.Title>
                                <h2>{data.averageMembersPerProject.toFixed(1)}</h2>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Average Execution Time (days)</Card.Title>
                                <h2>{data.averageExecutionTime.toFixed(1)}</h2>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col md={6} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Body className="chart-content">
                                <Card.Title>Status Overview</Card.Title>
                                <PieChart width={300} height={300}> {/* Reduzindo o tamanho do gráfico */}
                                    <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                        {projectStatusData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#000000'} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: "10px" }} formatter={(value, entry) => `${value}: ${parseFloat(entry.payload.value).toFixed(2)}%`} />
                                </PieChart>
                            </Card.Body>
                        </Card>
                    </Col>
                    {labCharts}
                </Row>
            </Container>
            <PDFExportButton contentRef={contentRef} /> 
        </div>
    );
};

export default Dashboard;
