import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Input, InputGroup, Button, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { getResources } from '../services/resourcesServices';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import { FaTag, FaBarcode, FaRegFileAlt, FaIndustry, FaTruck, FaPhone, FaWarehouse, FaStickyNote, FaBoxes, FaSearch } from 'react-icons/fa';
import './Inventory.css';
import CreateResourceModal from '../components/Modals/CreateResourceModal';
import { useTranslation } from 'react-i18next';

/* Componente Inventory: Responsável por exibir a lista de recursos disponíveis no inventário. 
Os recursos podem ser ordenados, filtrados e paginados.
Botões para adicionar um novo recurso e visualizar estatísticas. */

const Inventory = () => {
  const [resources, setResources] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número máximo de itens por página
  const token = Cookies.get("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  // Função para buscar os recursos disponíveis no inventário
  const fetchResources = async () => {
    const resourcesData = await getResources(token);
    console.log(resourcesData);
    setResources(resourcesData);
  };

  useEffect(() => {
    fetchResources();
  }, [token]);

  // Função para filtrar os recursos de acordo com o termo de procura
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Resetar para a primeira página em uma nova pesquisa
  };

  // Função para ordenar a lista de recursos
  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Função para ordenar e filtrar os recursos
  const sortedResources = React.useMemo(() => {
    let sortableResources = [...resources];
    if (sortConfig !== null) {
      sortableResources.sort((a, b) => {
        if (a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableResources;
  }, [resources, sortConfig]);

  // Função para filtrar os recursos de acordo com o termo de procura
  const filteredResources = React.useMemo(() => {
    return sortedResources.filter((resource) =>
      ["name", "brand", "identifier", "supplier"].some(
        (field) =>
          resource[field] &&
          resource[field]
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedResources, searchTerm]);

  // Função para paginar os recursos 
    const currentResources = React.useMemo(() => {
    const firstIndex = (currentPage - 1) * itemsPerPage;
    const lastIndex = firstIndex + itemsPerPage;
    return filteredResources.slice(firstIndex, lastIndex);
  }, [filteredResources, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  // Função para renderizar a seta de ordenação
  const renderSortArrow = (columnName) => {
    if (sortConfig && sortConfig.key === columnName) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <Container className="inventory-container">
          <Row className="mb-4">
            <Col className="inventory-header">
              <Col>
                <h1 className="inventory-title">{t("Inventory")}</h1>
              </Col>
              <InputGroup>
                <div className="search-input">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                    autoFocus
                  />
                </div>
              </InputGroup>
              <Button
                className="buttonAddResource"
                onClick={() => setModalOpen(true)}
              >
                {t("Add Resource/Component")}
              </Button>
              <Button
                className="buttonViewStats"
                onClick={() => {
                  /* Ação do botão View Stats */
                }}
              >
                {t("View Stats")}
              </Button>
            </Col>
          </Row>
          <Table striped bordered hover responsive className="inventory-table">
            <thead className="thead-dark">
              <tr>
                <th onClick={() => requestSort("name")}>
                  <FaTag /> {t("Name")} {renderSortArrow("name")}
                </th>
                <th onClick={() => requestSort("identifier")}>
                  <FaBarcode /> {t("Identifier")} {renderSortArrow("identifier")}
                </th>
                <th>
                  <FaRegFileAlt /> {t("Description")}
                </th>
                <th onClick={() => requestSort("brand")}>
                  <FaIndustry /> {t("Brand")} {renderSortArrow("brand")}
                </th>
                <th>
                  <FaBoxes /> {t("Type")}
                </th>
                <th onClick={() => requestSort("supplier")}>
                  <FaTruck /> {t("Supplier")} {renderSortArrow("supplier")}
                </th>
                <th>
                  <FaPhone /> {t("Contact")}
                </th>
                <th>
                  <FaWarehouse /> {t("Quantity")}
                </th>
                <th>
                  <FaStickyNote /> {t("Observations")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentResources.map((resource) => (
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
          <div className="pagination-container">
            <Pagination>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink first onClick={() => handlePageChange(1)} />
              </PaginationItem>
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink
                  previous
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem active={index + 1 === currentPage} key={index}>
                  <PaginationLink onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  next
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  last
                  onClick={() => handlePageChange(totalPages)}
                />
              </PaginationItem>
            </Pagination>
          </div>
        </Container>
      </div>
      <CreateResourceModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        fetchResources={fetchResources}
      />
    </>
  );
};

export default Inventory;

