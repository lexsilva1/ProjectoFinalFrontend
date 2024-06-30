import React, { useState, useEffect } from "react";
import { Button, Container, Card, CardBody, CardHeader, Form } from "reactstrap";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import Cookies from "js-cookie";
import UsersModal from "../components/Modals/UsersModal";
import ResourcesModal from "../components/Modals/ResourcesModal";
import Step1 from "../components/CreateProjectSteps/Step1";
import Step2 from "../components/CreateProjectSteps/Step2";
import Step3 from "../components/CreateProjectSteps/Step3";
import { getLabs } from "../services/labServices";
import { getInterests } from "../services/interestServices";
import { getSkills } from "../services/skillServices";
import { projectPhotoUpload, createProject } from "../services/projectServices";
import { findAllUsers } from "../services/userServices";
import userstore from "../stores/userStore"

const NewProject = () => {
  const token = Cookies.get("authToken");
  const user = userstore((state)=>state.user)
  const creator = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    isProjectManager: true,
    userPhoto: user.image,
    approvalStatus: "CREATOR",
  };
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(null);
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
const setInputs2 = (inputs3) => {
  
  setInputs(inputs3)
}

  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLabs = async () => {
      const res = await getLabs(token);
      setLabs(res);
    };
    const fetchUsers = async () => {
      const res = await findAllUsers(token);
      const otherUsers = [];
      res.forEach((user) => {
        if(user.userId !== creator.userId){
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
     setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
    const url = projectPhotoUpload(token,inputs.name, file).then((res) => {
      console.log(res);
      setInputs({ ...inputs, projectPhoto: res });
    });
  }

  const addField = (field) => {
    setInputs({
      ...inputs,
      [field]: [...inputs[field], ""],
    });
  };

  const handleDelete = (index, field) => {
    const newArray = [...inputs[field]];
    newArray.splice(index, 1);
    setInputs({ ...inputs, [field]: newArray });
  };

  const handleArrayChange = (selected, index, field) => {
    const newArray = [...inputs[field]];
    newArray[index] = selected.length ? selected[0].name : "";
    setInputs({ ...inputs, [field]: newArray });
  };

  const handleKeyPress = (e) => {
    if (e.key === "e" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

  const handleOpenResourcesModal = () => {
    setShowResourcesModal(true);
  };

  const removeTeamMember = (index) => {
    const newTeamMembers = [...inputs.teamMembers];
    newTeamMembers.splice(index, 1);
    const newUsers = [...users];
    newUsers.push(inputs.teamMembers[index]);
    setUsers(newUsers);
    setInputs({ ...inputs, teamMembers: newTeamMembers });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

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
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <Header />
      </div>
      <Sidebar />
      <Container>
        <Card>
          <CardHeader>Create New Project</CardHeader>
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
