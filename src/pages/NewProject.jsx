import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, CardHeader, Form } from "reactstrap";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Cookies from "js-cookie";
import ResourcesModal from "../components/Modals/ResourcesModal";
import Step1 from "../components/CreateProjectSteps/Step1";
import Step2 from "../components/CreateProjectSteps/Step2";
import Step3 from "../components/CreateProjectSteps/Step3";
import { getLabs } from "../services/labServices";
import { getInterests } from "../services/interestServices";
import { getSkills } from "../services/skillServices";
import { projectPhotoUpload } from "../services/projectServices";
import { findAllUsers } from "../services/userServices";
import userstore from "../stores/userStore"
import { useTranslation } from "react-i18next";
import './NewProject.css';

/* Componente NewProject: Responsável por criar um novo projeto, contém as 3 etapas de formulário*/

const NewProject = () => {
  const token = Cookies.get("authToken");
  const user = userstore((state) => state.user);
  const { t } = useTranslation();

  // Define um objeto 'creator' com informações detalhadas do criador do projeto.
  const creator = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    isProjectManager: true,
    userPhoto: user.image,
    approvalStatus: "CREATOR",
  };

  // Utiliza o hook useState para definir o passo atual do processo de criação do projeto, iniciando em 1.
  const [step, setStep] = useState(1);

  // Utiliza o hook useState para gerir o estado do avatar, inicialmente nulo.
  const [avatar, setAvatar] = useState(null);

  // Utiliza o hook useState para gerir o estado dos inputs do formulário de criação do projeto.
  const [inputs, setInputs] = useState({
    name: "",
    location: "",
    description: "",
    slots: 1,
    skills: [],
    interests: [],
    materials: [],
    startDate: "",
    endDate: "",
    projectPhoto: "",
    teamMembers: [creator],
  });

  // Define uma função para atualizar o estado dos inputs. Recebe um objeto 'inputs3' e atualiza o estado.
  const setInputs2 = (inputs3) => {
    setInputs(inputs3);
  };

  // Inicializa dos estados para armazenar sugestões, inicialmente vazias.
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [error, setError] = useState("");


  // Utiliza o hook useEffect para ir buscar os laboratórios, utilizadores, sugestões de skills e sugestões de keywords.
  useEffect(() => {
    const fetchLabs = async () => {
      const res = await getLabs(token);
      setLabs(res);
    };
    const fetchUsers = async () => {
      const res = await findAllUsers(token);
      const otherUsers = [];
      res.forEach((user) => {
        if (user.userId !== creator.userId) {
          otherUsers.push(user);
        }
      });
      setUsers(otherUsers);
    };

    const fetchSuggestions = async () => {
      const res = await getSkills();
      setSkillSuggestions(res);
    };

    const fetchKeywordSuggestions = async () => {
      const res = await getInterests();
      setKeywordSuggestions(res);
    };

    fetchLabs();
    fetchSuggestions();
    fetchKeywordSuggestions();
    fetchUsers();
  }, []);

  // Define uma função para tratar a mudança nos inputs. Recebe um evento 'e' e atualiza o estado dos inputs.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  // Define uma função para tratar o upload de imagem. Recebe um evento 'e' e atualiza o estado do avatar.
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
    const url = projectPhotoUpload(token, inputs.name, file).then((res) => {
      console.log(res);
      setInputs({ ...inputs, projectPhoto: res });
    });
  };

  // Define uma função para adicionar um campo. Recebe um campo 'field' e atualiza o estado dos inputs.
  const addField = (field) => {
    setInputs({
      ...inputs,
      [field]: [...inputs[field], ""],
    });
  };

  // Define uma função para remover um campo. Recebe um índice 'index' e um campo 'field' e atualiza o estado dos inputs.
  const handleDelete = (index, field) => {
    const newArray = [...inputs[field]];
    newArray.splice(index, 1);
    setInputs({ ...inputs, [field]: newArray });
  };

  // Define uma função para tratar a mudança num array. Recebe um array 'selected', um índice 'index' e um campo 'field'.
  const handleArrayChange = (selected, index, field) => {
    const newArray = [...inputs[field]];
    newArray[index] = selected.length ? selected[0].name : "";
    setInputs({ ...inputs, [field]: newArray });
  };

  // Previne a entrada de caracteres não desejados em campos numéricos.
  const handleKeyPress = (e) => {
    if (e.key === "e" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

  // Abre o modal de recursos.
  const handleOpenResourcesModal = () => {
    setShowResourcesModal(true);
  };

  // Remove um membro da equipe do projeto.
  const removeTeamMember = (index) => {
    const newTeamMembers = [...inputs.teamMembers];
    newTeamMembers.splice(index, 1);
    const newUsers = [...users];
    newUsers.push(inputs.teamMembers[index]);
    setUsers(newUsers);
    setInputs({ ...inputs, teamMembers: newTeamMembers });
  };

  // Avança para o próximo passo do formulário.
  const nextStep = () => {
    setStep(step + 1);
  };

  // Retorna ao passo anterior do formulário.
  const prevStep = () => {
    setStep(step - 1);
  };

  // Renderiza o componente correspondente ao passo atual do formulário.
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            inputs={inputs}
            labs={labs}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            nextStep={nextStep}
            avatar={avatar}
          />
        );
      case 2:
        return (
          <Step2
            setInputs={setInputs2}
            inputs={inputs}
            skillSuggestions={skillSuggestions}
            keywordSuggestions={keywordSuggestions}
            addField={addField}
            handleDelete={handleDelete}
            handleArrayChange={handleArrayChange}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            handleOpenResourcesModal={handleOpenResourcesModal}
            users={users}
            removeTeamMember={removeTeamMember}
            error={error}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 3:
        return (
          <Step3
            inputs={inputs}
            prevStep={prevStep}
            setInputs={setInputs}
            setStep={setStep}
            setError={setError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <Header />
      </div>
      <Sidebar />
      <Container>
        <Card className="project-card">
        <CardHeader className="CardHeader-create-project blue-card-header">{t("Create New Project")}</CardHeader>
          <CardBody>
            <Form>{renderStep()}</Form>
          </CardBody>
        </Card>
      </Container>
      <ResourcesModal
        isOpen={showResourcesModal}
        toggle={() => setShowResourcesModal(!showResourcesModal)}
        setInputs={setInputs}
        inputs={inputs}
      />
    </>
  );
};

export default NewProject;
