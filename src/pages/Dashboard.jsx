import React, { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Container, Row, Col } from 'react-bootstrap';
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
    const contentRef = useRef(null); // Referência para o Container

    useEffect(() => {
        const fetchData = async () => {
            const result = await getStatistics(token);
            console.log(result); // Verifique os dados retornados
            setData(result);
        };

        fetchData();
    }, [token]);

    if (!data) {
        return <div>Loading...</div>;
    }

    const totalProjects = data.totalProjects || 0;

    const calculatePercentage = (count) => {
        return totalProjects ? (count / totalProjects) : 0;
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
                value: labTotal ? (statusCount / labTotal) : 0,
            };
        });

        console.log(`Lab: ${lab}, Lab Total: ${labTotal}, Lab Data:`, labData);

        return (
            <Col key={lab}>
                <h2>{lab}</h2>
                <PieChart width={300} height={300}>
                    <Pie data={labData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                        {labData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#000000'} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                    <Legend />
                </PieChart>
            </Col>
        );
    });

    return (
        <div className="dashboard">
            <Header />
            <Sidebar />
            <Container ref={contentRef} id="export-pdf"> {/* Adicionando ref e id */}
                <Row>
                    <Col>
                        <h2>Total Projects: {totalProjects}</h2>
                        <PieChart width={300} height={300}>
                            <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                                {projectStatusData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#000000'} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                            <Legend />
                        </PieChart>
                    </Col>
                    {labCharts}
                </Row>
            </Container>
            <PDFExportButton contentRef={contentRef} /> {/* Passando a ref para o PDFExportButton */}
        </div>
    );
};

export default Dashboard;
