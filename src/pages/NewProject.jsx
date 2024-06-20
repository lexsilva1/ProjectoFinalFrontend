import React, { useState, useEffect } from "react";
import { Button, Container, Card, CardBody, CardHeader, Form } from "reactstrap";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import UsersModal from "../components/Modals/UsersModal";
import ResourcesModal from "../components/Modals/ResourcesModal";
import Step1 from "../components/CreateProjectSteps/Step1";
import Step2 from "../components/CreateProjectSteps/Step2";
import Step3 from "../components/CreateProjectSteps/Step3";

const NewProject = () => {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({
    name: "",
    location: "",
    description: "",
    slots: 0,
    skills: [""],
    keywords: [""],
    materials: [],
    imageUpload: null,
    avatar: "",
  });

  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [error, setError] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    // Fetch labs, skill suggestions, and keyword suggestions
    const fetchLabs = async () => {
      const res = await fetch("/api/labs");
      const data = await res.json();
      setLabs(data);
    };

    const fetchSuggestions = async () => {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkillSuggestions(data);
    };

    const fetchKeywordSuggestions = async () => {
      const res = await fetch("/api/keywords");
      const data = await res.json();
      setKeywordSuggestions(data);
    };

    fetchLabs();
    fetchSuggestions();
    fetchKeywordSuggestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setInputs({ ...inputs, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

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

  const handleOpenUserModal = () => {
    setShowUserModal(true);
  };

  const handleOpenResourcesModal = () => {
    setShowResourcesModal(true);
  };

  const removeTeamMember = (index) => {
    const newTeam = [...teamMembers];
    newTeam.splice(index, 1);
    setTeamMembers(newTeam);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (inputs.slots <= 0) {
      setError("Number of slots must be greater than zero.");
      return;
    }
    // Prepare form data
    const formData = new FormData();
    for (const key in inputs) {
      if (Array.isArray(inputs[key])) {
        formData.append(key, JSON.stringify(inputs[key]));
      } else {
        formData.append(key, inputs[key]);
      }
    }
    // Add team members to form data
    formData.append("teamMembers", JSON.stringify(teamMembers));

    // Send request
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        // Handle success
      } else {
        // Handle errors
        const errorData = await res.json();
        setError(errorData.message || "An error occurred.");
      }
    } catch (err) {
      setError("An error occurred while submitting the form.");
    }
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
          />
        );
      case 2:
        return (
          <Step2
            inputs={inputs}
            skillSuggestions={skillSuggestions}
            keywordSuggestions={keywordSuggestions}
            addField={addField}
            handleDelete={handleDelete}
            handleArrayChange={handleArrayChange}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            handleOpenUserModal={handleOpenUserModal}
            handleOpenResourcesModal={handleOpenResourcesModal}
            teamMembers={teamMembers}
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
            teamMembers={teamMembers}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
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
            <Form onSubmit={handleSubmit}>{renderStep()}</Form>
          </CardBody>
        </Card>
      </Container>
      <UsersModal
        isOpen={showUserModal}
        toggle={() => setShowUserModal(!showUserModal)}
        setTeamMembers={setTeamMembers}
      />
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
