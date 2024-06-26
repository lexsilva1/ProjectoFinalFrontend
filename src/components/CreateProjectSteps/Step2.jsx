import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import { getSkills, createSkillForProject, getSkillTypes } from "../../services/skillServices";
import { getInterests, createKeyword, getInterestTypes } from "../../services/interestServices";
import TypeModal from "../Modals/TypeModal";
import UsersModal from "../Modals/UsersModal";
import ResourcesModal from "../Modals/ResourcesModal";
import Cookies from "js-cookie";



const Step2 = ({ inputs, nextStep, prevStep, removeTeamMember, setInputs, users }) => {
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [interestTypes, setInterestTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);

  const [resolveOnSkillTypeSelected, setResolveOnSkillTypeSelected] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState(inputs.teamMembers || []);
  const token = Cookies.get("authToken");
  const [error, setError] = useState("");
  const [showResourcesModal, setShowResourcesModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          fetchedSkills,
          fetchedInterests,
          fetchedSkillTypes,
          fetchedInterestTypes,
        ] = await Promise.all([
          getSkills(token),
          getInterests(token),
          getSkillTypes(),
          getInterestTypes(),
        ]);
        setSkills(fetchedSkills);
        setInterests(fetchedInterests);
        setSkillTypes(fetchedSkillTypes);
        setInterestTypes(fetchedInterestTypes);
      } catch (error) {
        console.error("Error fetching skills, interests and their types:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleOpenModal = (type) => {
    setSelectedType(type);
    setShowTypeModal(true);
  };

  const handleCloseModal = () => {
    setShowTypeModal(false);
  };

  const handleSkillsChange = async (selected) => {
    let skillToAdd = {};
    const newSkills = selected.filter(
      (skill) => !selectedSkills.some((s) => s.name === skill.name)
    );
  
    const removedSkills = selectedSkills.filter(
      (skill) => !selected.some((s) => s.name === skill.name)
    );
  
    try {
      // Process new skills
      for (const skill of newSkills) {
        if (!skills.some((s) => s.name === skill.name)) {
          const skillTypeSelected = new Promise((resolve) => {
            setResolveOnSkillTypeSelected(() => resolve);
          });
  
          handleOpenModal('skill');
          const skillType = await skillTypeSelected;
          const newSkill = {
            ...skill,
            skillType,
            projetcId: 0,
            id: null,
          };
  
          delete newSkill.customOption;
  
          const createdSkill = await createSkillForProject(token, newSkill);
          console.log(createdSkill);
          skillToAdd = {
            name: createdSkill.name,
            skillType: createdSkill.skillType,
            projectId: 0,
            id: createdSkill.id,
          }
          setSelectedSkills((prevSkills) => [...prevSkills, skillToAdd]);
          setInputs((prevInputs) => ({
            ...prevInputs,
            skills: [...prevInputs.skills, skillToAdd],
          }));
          console.log(skillToAdd)
          console.log(selectedSkills)
          console.log(inputs.skills);
        }
      }
  
      // Process removed skills
      for (const skill of removedSkills) {
        // Handle skill removal logic here if needed
        // Example: await removeSkillForProject(token, skill.id);
      }
  
      // Update the inputs with the selected skills
      const updatedSkills = selectedSkills.filter(
        (skill) => !removedSkills.includes(skill)
      ).concat(newSkills);
      
      setSelectedSkills(updatedSkills);
      setInputs((prevInputs) => ({
        ...prevInputs,
        skills: updatedSkills,
      }));
    } catch (error) {
      console.error("Error processing skills:", error);
    }
  };
  
  
  
  const handleInterestsChange = async (selected) => {
    const newInterests = selected.filter(
      (interest) => !selectedInterests.some((i) => i.name === interest.name)
    );
  
    const removedInterests = selectedInterests.filter(
      (interest) => !selected.some((i) => i.name === interest.name)
    );
  
    try {
      // Process new interests
      for (const interest of newInterests) {
        if (!interests.some((i) => i.name === interest.name)) {
          const interestTypeSelected = new Promise((resolve) => {
            setResolveOnSkillTypeSelected(() => resolve);
          });
  
          handleOpenModal('interest');
          const interestType = await interestTypeSelected;
          const newInterest = {
            name: interest.name,
            interestType,
            projectId: 0,
            id: null,
          };
  
          const createdInterest = await createKeyword(token, newInterest);
          
          setSelectedInterests((prevInterests) => [...prevInterests, createdInterest]);
          setInputs((prevInputs) => ({
            ...prevInputs,
            interests: [...prevInputs.interests, createdInterest],
          }));
        }
      }
  
      // Process removed interests (if needed)
      for (const interest of removedInterests) {
        // Handle interest removal logic here if needed
        // Example: await removeInterestForProject(token, interest.id);
      }
  
      // Update the inputs with the selected interests
      const updatedInterests = selected.filter(
        (interest) => !removedInterests.some((i) => i.name === interest.name)
      );
      
      setSelectedInterests(updatedInterests);
      setInputs((prevInputs) => ({
        ...prevInputs,
        interests: updatedInterests,
      }));
    } catch (error) {
      console.error("Error processing interests:", error);
    }
  };
  

  
  

  
  const handleOpenUsersModal = () => {
    if (!inputs.slots) {
      setError("Please define the number of slots first.");
    } else {
      setShowUsersModal(true);
      setError("");
    }
  };

  const handleCloseUsersModal = () => {
    setShowUsersModal(false);
  };

  const handleUserSelect = (selectedUser) => {
    if (teamMembers.length >= parseInt(inputs.slots)) {
      setError("You have reached the maximum number of slots.");
    } else {
      setTeamMembers([...teamMembers, selectedUser]);
      setInputs({ ...inputs, teamMembers: [...teamMembers, selectedUser] });
      handleCloseUsersModal();
      setError("");
    }
  };

  const onTypeSelect = (type) => {
    setSelectedType(type);
    if (resolveOnSkillTypeSelected) {
      resolveOnSkillTypeSelected(type);
      setResolveOnSkillTypeSelected(null);
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (keyValue === "." || keyValue === ",") {
      event.preventDefault();
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleOpenResourcesModal = () => {
    setShowResourcesModal(true);
  };

  const handleCloseResourcesModal = () => {
    setShowResourcesModal(false);
  };

  const handleSelect = (selectedMaterials) => {
    setInputs({ ...inputs, materials: selectedMaterials });
    handleCloseResourcesModal();
  };

  return (
    <>
      <Row>
        <Col md={6}>
          <FormGroup className="my-form-group">
            <Label>Skills</Label>
            <Typeahead
              id="skills-typeahead"
              labelKey="name"
              multiple
              onChange={handleSkillsChange}
              options={skills}
              allowNew
              newSelectionPrefix="Add a new skill: "
              placeholder="Choose your skills..."
              selected={inputs.skills}
            />
          </FormGroup>
          <FormGroup className="my-form-group">
            <Label>Interests</Label>
            <Typeahead
              id="interests-typeahead"
              labelKey="name"
              multiple
              onChange={handleInterestsChange}
              options={interests}
              allowNew
              newSelectionPrefix="Add a new interest: "
              placeholder="Choose your interests..."
              selected={inputs.interests}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup className="my-form-group">
            <Label for="slots">Number of Slots</Label>
            <Input
              type="number"
              name="slots"
              id="slots"
              value={inputs.slots}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="short-input"
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <Label>Team Members</Label>
            <Button onClick={handleOpenUsersModal} color="primary" className="modal-button">
              Add Team Members
            </Button>
            {error && <p className="error-message">{error}</p>}
            <ul className="list-group">
              {inputs.teamMembers.map((member, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <img
                    src={member.userPhoto || Avatar}
                    alt={`${member.firstName} ${member.lastName}`}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                  />
                  {member.firstName} {member.lastName}
                  {!member.isProjectManager ?
                  <Button
                    onClick={() => removeTeamMember(index)}
                    color="danger"
                    size="sm"
                    className="ml-2"
                  >
                    Remove
                  </Button>
                  : null}
                </li>
              ))}
            </ul>
          </FormGroup>
          <FormGroup>
            <Label>Materials</Label>
            <Button
              onClick={handleOpenResourcesModal}
              color="primary"
              className="modal-button"
            >
              Add Materials
            </Button>
            <ResourcesModal
              show={showResourcesModal}
              handleClose={handleCloseResourcesModal}
              handleSelect={handleSelect}
            />
            <ul className="list-group">
              {inputs.materials.map((material, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {material.name} - {material.quantity}
                  <Button
                    onClick={() => {
                      const newMaterials = [...inputs.materials];
                      newMaterials.splice(index, 1);
                      setInputs({
                        ...inputs,
                        materials: newMaterials,
                      });
                    }}
                    color="danger"
                    size="sm"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-between">
        <Button color="secondary" onClick={prevStep}>
          Previous
        </Button>
        <Button color="primary" onClick={nextStep}>
          Next
        </Button>
      </div>
      <TypeModal
        show={showTypeModal}
        onHide={handleCloseModal}
        title={`Add ${selectedType}`}
        types={selectedType === "skill" ? skillTypes : interestTypes}
        onTypeSelect={onTypeSelect}
      />
      <UsersModal
        show={showUsersModal}
        handleClose={handleCloseUsersModal}
        inputs={inputs}
        setInputs={setInputs}
        users={users}
      />
    </>
  );
};

export default Step2;

