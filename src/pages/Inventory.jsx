import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Input, InputGroup, Button } from 'reactstrap';
import { getResources } from '../services/resourcesServices';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import { FaTag, FaBarcode, FaRegFileAlt, FaIndustry, FaTruck, FaPhone, FaWarehouse, FaStickyNote, FaBoxes } from 'react-icons/fa';
import './Inventory.css';
import CreateResourceModal from '../components/Modals/CreateResourceModal';

const Inventory = () => {
    const [resources, setResources] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const token = Cookies.get('authToken');
    const [modalOpen, setModalOpen] = useState(false);

    const fetchResources = async () => {
        const resourcesData = await getResources(token);
        console.log(resourcesData);
        setResources(resourcesData);
    };

    useEffect(() => {
        fetchResources();
    }, [token]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        fetchResources();
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedResources = React.useMemo(() => {
        let sortableResources = [...resources];
        if (sortConfig !== null) {
            sortableResources.sort((a, b) => {
                if (a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableResources;
    }, [resources, sortConfig]);

    const filteredResources = React.useMemo(() => {
        return sortedResources.filter(resource => 
            ['name', 'brand', 'identifier', 'supplier'].some(field => 
                resource[field] && resource[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [sortedResources, searchTerm]);
    
    const renderSortArrow = (columnName) => {
        if (sortConfig && sortConfig.key === columnName) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '';
    };

    return (
        <>
            <Header />
            <div style={{ display: 'flex' }}>
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                <Container className="inventory-container">
                    <Row className="mb-4 align-items-center">
                        <Col>
                            <h1 className="inventory-title">Inventory</h1>
                        </Col>
                        <Col className="text-right">
                            <InputGroup>
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <Button onClick={() => setModalOpen(true)}>Add Resource</Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Table striped bordered hover responsive className="inventory-table">
                        <thead className="thead-dark">
                            <tr>
                                <th onClick={() => requestSort('name')}>
                                    <FaTag /> Name {renderSortArrow('name')}
                                </th>
                                <th onClick={() => requestSort('identifier')}>
                                    <FaBarcode /> Identifier {renderSortArrow('identifier')}
                                </th>
                                <th><FaRegFileAlt /> Description</th>
                                <th onClick={() => requestSort('brand')}>
                                    <FaIndustry /> Brand {renderSortArrow('brand')}
                                </th>
                                <th><FaBoxes /> Type</th>
                                <th onClick={() => requestSort('supplier')}>
                                    <FaTruck /> Supplier {renderSortArrow('supplier')}
                                </th>
                                <th><FaPhone /> Contact</th>
                                <th><FaWarehouse /> Quantity</th>
                                <th><FaStickyNote /> Observations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResources.map((resource) => (
                                <tr key={resource.id}>
                                    <td>{resource.name}</td>
                                    <td>{resource.identifier}</td>
                                    <td>{resource.description}</td>
                                    <td>{resource.brand}</td>
                                    <td>{resource.type}</td>
                                    <td>{resource.supplier}</td>
                                    <td>{resource.supplierContact}</td>
                                    <td>{resource.stock}</td>
                                    <td>{resource.observations}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
            <CreateResourceModal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} fetchResources={fetchResources} />
        </>
    );
};

export default Inventory;
