import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Input, InputGroup, Button, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { getResources, updateResource } from '../services/resourcesServices';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import { FaTag, FaBarcode, FaRegFileAlt, FaIndustry, FaTruck, FaPhone, FaWarehouse, FaStickyNote, FaBoxes, FaSearch, FaEdit } from 'react-icons/fa';
import './Inventory.css';
import CreateResourceModal from '../components/Modals/CreateResourceModal/CreateResourceModal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import userStore from '../stores/userStore';

const Inventory = () => {
  const [resources, setResources] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = Cookies.get("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userRole = userStore((state) => state.user?.role);

  const isCurrentUserAppManager = userRole < 2;

  const fetchResources = async () => {
    const resourcesData = await getResources(token);
    setResources(resourcesData);
  };

  useEffect(() => {
    fetchResources();
  }, [token]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

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

  const currentResources = React.useMemo(() => {
    const firstIndex = (currentPage - 1) * itemsPerPage;
    const lastIndex = firstIndex + itemsPerPage;
    return filteredResources.slice(firstIndex, lastIndex);
  }, [filteredResources, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const renderSortArrow = (columnName) => {
    if (sortConfig && sortConfig.key === columnName) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToResourceStats = () => {
    navigate("/resources-stats");
  };

  const openEditModal = (resource) => {
    setModalOpen(true);
    setInitialResource(resource);
  };


  const [initialResource, setInitialResource] = useState(null);

  return (
    <>
      <Header />
      <div style={{ display: "flex" }}>
        <Container className="inventory-container">
          <Row className="mb-4">
            <Col className="inventory-header">
              <Col>
                <h2 className="inventory-title">{t("Inventory")}</h2>
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
              {isCurrentUserAppManager && (
                <Button
                  className="buttonViewStats"
                  onClick={() => {
                    goToResourceStats();
                  }}
                >
                  {t("View Stats")}
                </Button>
              )}
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
                <th>Edit</th> 
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
                  <td>
                    <Button variant="link" onClick={() => openEditModal(resource)}>
                      <FaEdit />
                    </Button>
                  </td>
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
        initialResource={initialResource} 
      />
    </>
  );
};

export default Inventory;

