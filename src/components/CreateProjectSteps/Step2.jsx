import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import Avatar from "../../multimedia/Images/Avatar.jpg";
import { getSkills, createSkill, deleteSkill, getSkillTypes } from "../../services/skillServices";
import { getInterests, createInterest, deleteInterest, getInterestTypes } from "../../services/interestServices";
import TypeModal from "../Modals/TypeModal";
import UsersModal from "../Modals/UsersModal";
import ResourcesModal from "../Modals/ResourcesModal";
import Cookies from "js-cookie";

const Step2 = ({
  inputs: inputsProp,
  handleDelete,
  handleArrayChange,
  handleOpenUserModal,
  removeTeamMember,
  prevStep,
  nextStep,
  setInputs: setInputsFromProps,
}) => {
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [interestTypes, setInterestTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [inputs, setInputs] = useState({
    ...inputsProp,
    slots: inputsProp.slots || 0, 
    materials: inputsProp.materials || [],
  });
  const [resolveOnSkillTypeSelected, setResolveOnSkillTypeSelected] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
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

  const handleSkillChange = async (selected) => {
    setSelectedSkills(selected);
    const newSkills = selected.filter(
      (skill) => !inputs.skills.some((s) => s.name === skill.name)
    );
    const removedSkills = inputs.skills.filter(
      (skill) => !selected.some((s) => s.name === skill.name)
    );


    for (const skill of newSkills) {
      try {
        if (!skills.some((s) => s.name === skill.name)) {
          setShowTypeModal(true);
          const skillTypeSelected = await new Promise((resolve) => {
            setResolveOnSkillTypeSelected(() => resolve);
          });
          setShowTypeModal(false);
          skill.skillType = skillTypeSelected;
          skill.projectId = 0;
          skill.id = null;
          delete skill.customOption;
          const result = await createSkill(token, skill);
          setSkills((prevSkills) => [...prevSkills, result]);
        } else {
          await createSkill(token, skill);
        }
      } catch (error) {
        console.error("Error creating skill:", error);
      }
    }

  
    for (const skill of removedSkills) {
      try {
        await deleteSkill(token, skill);
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }

    setInputs({ ...inputs, skills: selected });
  };

  const handleInterestChange = async (selected) => {
    setSelectedInterests(selected);
    const newInterests = selected.filter(
      (interest) =>
        !inputs.interests ||
        !inputs.interests.some((i) => i.name === interest.name)
    );
    const removedInterests = inputs.interests
      ? inputs.interests.filter(
          (interest) => !selected.some((i) => i.name === interest.name)
        )
      : [];

    for (const interest of newInterests) {
      try {
        if (!interests.some((i) => i.name === interest.name)) {
          setShowTypeModal(true);
          const interestTypeSelected = await new Promise((resolve) => {
            setResolveOnSkillTypeSelected(() => resolve);
          });
          setShowTypeModal(false);
          interest.interestType = interestTypeSelected;
          interest.projectId = 0;
          interest.id = null;
          delete interest.customOption;
          const result = await createInterest(token, interest);
          setInterests((prevInterests) => [...prevInterests, result]);
        } else {
          await createInterest(token, interest);
        }
      } catch (error) {
        console.error("Error creating interest:", error);
      }
    }

    for (const interest of removedInterests) {
      try {
        await deleteInterest(token, interest);
      } catch (error) {
        console.error("Error deleting interest:", error);
      }
    }

    setInputs({ ...inputs, interests: selected });
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

  const handleCloseTypeModal = () => {
    setShowTypeModal(false);
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
              options={skills}
              placeholder="Choose your skills..."
              selected={selectedSkills}
              onChange={handleSkillChange}
              allowNew
              newSelectionPrefix="Add a new skill: "
            />
          </FormGroup>
          <FormGroup className="my-form-group">
            <Label>Interests</Label>
            <Typeahead
              id="interests-typeahead"
              labelKey="name"
              options={interests}
              placeholder="Choose your interests..."
              selected={selectedInterests}
              onChange={handleInterestChange}
              allowNew
              newSelectionPrefix="Add a new interest: "
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
            <Button
  onClick={handleOpenUsersModal}
  color="primary"
  className="modal-button"
>
  Add Team Members
</Button>
<UsersModal
  show={showUsersModal}  
  handleClose={handleCloseUsersModal} 
  onAdd={handleUserSelect}
/>
            {error && <p className="error-message">{error}</p>}
            <ul className="list-group">
              {teamMembers.map((member, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
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
                  <Button
                    onClick={() => removeTeamMember(index)}
                    color="danger"
                    size="sm"
                    className="ml-2"
                  >
                    Remove
                  </Button>
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
  handleSelect={handleSelect} // Certifique-se de passar essa prop corretamente
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
        onHide={handleCloseTypeModal}
        title={`Add ${selectedType}`}
        type={selectedType}
        types={selectedType === "skill" ? skillTypes : interestTypes}
        onTypeSelect={onTypeSelect}
      />
   
    </>
  );
};

export default Step2;
