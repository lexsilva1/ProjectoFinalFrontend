import React from 'react';
import { Table, Container, Row, Col, Input, Button, InputGroup, InputGroupText } from 'reactstrap';
import { getResources } from '../services/resourcesServices';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import { FaSearch, FaBoxOpen, FaBarcode, FaRegFileAlt, FaIndustry, FaTruck, FaPhone, FaWarehouse, FaStickyNote, FaTag, FaBoxes } from 'react-icons/fa';
import './Inventory.css';
import CreateResourceModal from '../components/Modals/CreateResourceModal';

const Inventory = () => {
  const [resources, setResources] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const token = Cookies.get('authToken');
  const [modalOpen, setModalOpen] = React.useState(false); 


  React.useEffect(() => {
    const fetchResources = async () => {
      const resourcesData = await getResources(token);
      console.log(resourcesData);
      setResources(resourcesData);
    };

    fetchResources();
  }, [token]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleModal = () => setModalOpen(!modalOpen); // Função para abrir/fechar o modal


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
  <CreateResourceModal isOpen={modalOpen} toggle={toggleModal} />
</InputGroup>
            </Col>
          </Row>
          <Table striped bordered hover responsive className="inventory-table">
            <thead className="thead-dark">
              <tr>
                <th><FaTag /> Name</th>
                <th><FaBarcode /> Identifier</th>
                <th><FaRegFileAlt /> Description</th>
                <th><FaIndustry /> Brand</th>
                <th><FaBoxes /> Type</th>
                <th><FaTruck /> Supplier</th>
                <th><FaPhone /> Contact</th>
                <th><FaWarehouse /> Quantity</th>
                <th><FaStickyNote /> Notes/Observations</th>
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
    </>
  );
};

export default Inventory;