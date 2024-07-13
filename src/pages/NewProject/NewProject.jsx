import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, CardHeader, Form } from "reactstrap";
import Sidebar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import ResourcesModal from "../../components/Modals/ResourcesModal/ResourcesModal";
import Step1 from "../../components/CreateProjectSteps/Step1";
import Step2 from "../../components/CreateProjectSteps/Step2";
import Step3 from "../../components/CreateProjectSteps/Step3";
import { getLabs } from "../../services/labServices";
import { getInterests } from "../../services/interestServices";
import { getSkills } from "../../services/skillServices";
import { projectPhotoUpload } from "../../services/projectServices";
import { findAllUsers } from "../../services/userServices";
import userstore from "../../stores/userStore";
import { useTranslation } from "react-i18next";
import "./NewProject.css";

/* NewProject Component: Responsible for creating a new project, contains the 3 form steps */

const NewProject = () => {
  const token = Cookies.get("authToken");
  const user = userstore((state) => state.user);
  const { t } = useTranslation();

  // Defines an object 'creator' with detailed information about the project creator.
  const creator = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    isProjectManager: true,
    userPhoto: user.image,
    approvalStatus: "CREATOR",
  };

  // Uses the useState hook to define the current step of the project creation process, starting at 1.
  const [step, setStep] = useState(1);

  // Uses the useState hook to manage the state of the avatar, initially null.
  const [avatar, setAvatar] = useState(null);

  // Uses the useState hook to manage the state of the project creation form inputs.
  const [inputs, setInputs] = useState({
    name: "",
    location: "",
    description: "",
    slots: 4,
    skills: [],
    interests: [],
    materials: [],
    startDate: "",
    endDate: "",
    projectPhoto: "",
    teamMembers: [creator],
  });

  // Define a function to update the state of the inputs. It takes an object 'inputs3' and updates the state.
  const setInputs2 = (inputs3) => {
    setInputs(inputs3);
  };

  // Inicializes the state of the skillSuggestions, keywordSuggestions, labs, and users.
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [error, setError] = useState("");

  // Use the useEffect hook to fetch labs, users, skill suggestions, and keyword suggestions.
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

  // Define a function to handle input changes. It takes an event 'e' and updates the state of the inputs.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  // Define a function to handle image upload. It takes an event 'e' and updates the state of the avatar.
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

  // Define a function to add a field. It takes a field 'field' and updates the state of the inputs.
  const addField = (field) => {
    setInputs({
      ...inputs,
      [field]: [...inputs[field], ""],
    });
  };

  // Define a function to remove a field. It takes an index 'index' and a field 'field' and updates the state of the inputs.
  const handleDelete = (index, field) => {
    const newArray = [...inputs[field]];
    newArray.splice(index, 1);
    setInputs({ ...inputs, [field]: newArray });
  };

  // Define a function to handle array change. It takes a selected array, an index, and a field.
  const handleArrayChange = (selected, index, field) => {
    const newArray = [...inputs[field]];
    newArray[index] = selected.length ? selected[0].name : "";
    setInputs({ ...inputs, [field]: newArray });
  };

  // Prevents the entry of unwanted characters in numeric fields.
  const handleKeyPress = (e) => {
    if (e.key === "e" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

  // Abre o modal de recursos.
  const handleOpenResourcesModal = () => {
    setShowResourcesModal(true);
  };

  // Remove a team member from the project.
  const removeTeamMember = (index) => {
    const newTeamMembers = [...inputs.teamMembers];
    newTeamMembers.splice(index, 1);
    const newUsers = [...users];
    newUsers.push(inputs.teamMembers[index]);
    setUsers(newUsers);
    setInputs({ ...inputs, teamMembers: newTeamMembers });
  };

  // Proceeds to the next step of the form.
  const nextStep = () => {
    setStep(step + 1);
  };

  // Goes back to the previous step of the form.
  const prevStep = () => {
    setStep(step - 1);
  };

  // Renders the component corresponding to the current step of the form.
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
      <Container style={{ marginTop: "100px" }}>
        <Card className="project-card">
          <CardHeader className="CardHeader-create-project blue-card-header">
            {t("Create New Project")}
          </CardHeader>
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
