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
import { useTranslation } from "react-i18next";

/* Step2 Component: Responsible for rendering the second step of the project creation form.
Receives several props, such as inputs, nextStep, prevStep, removeTeamMember, setInputs, and users.
This step involves choosing skills, interests, number of slots, project team members, and materials. */

const Step2 = ({
  inputs,
  nextStep,
  prevStep,
  removeTeamMember,
  setInputs,
  users,
}) => {
  // Local states to manage skills, interests, skill types, and interest types
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [interestTypes, setInterestTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [resolveOnInterestTypeSelected, setResolveOnInterestTypeSelected] =
    useState(null);
  const [resolveOnSkillTypeSelected, setResolveOnSkillTypeSelected] =
    useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState(inputs.teamMembers || []);
  const token = Cookies.get("authToken");
  const [error, setError] = useState("");
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const { t } = useTranslation();

  // Fetch skills, interests, skill types, and interest types when the component mounts
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
        console.error(
          "Error fetching skills, interests and their types:",
          error
        );
      }
    };

    fetchData();
  }, [token]);

  // Function to open the modal for selecting a type (skill or interest)
  const handleOpenModal = (type) => {
    setSelectedType(type);
    setShowTypeModal(true);
  };

  // Function to close the modal for selecting a type (skill or interest)
  const handleCloseModal = () => {
    setShowTypeModal(false);
  };

  // Function to handle changes in skills, creating new skills if necessary
  const handleSkillsChange = async (selected) => {
    const newSkills = selected.filter(
      (skill) => !selectedSkills.some((s) => s.name === skill.name)
    );

    const removedSkills = selectedSkills.filter(
      (skill) => !selected.some((s) => s.name === skill.name)
    );
    const newlyCreatedSkills = [];
    try {
      for (const skill of newSkills) {
        if (!skills.some((s) => s.name === skill.name)) {
          const skillTypeSelected = new Promise((resolve) => {
            setResolveOnSkillTypeSelected(() => resolve);
          });

          handleOpenModal("skill");
          const skillType = await skillTypeSelected;
          const newSkill = {
            name: skill.name,
            skillType,
            projetcId: 0,
            id: null,
          };
          delete newSkill.customOption;
          const createdSkill = await createSkillForProject(token, newSkill);
          console.log(createdSkill);
          newlyCreatedSkills.push(createdSkill);
          newSkills.splice(newSkills.indexOf(skill), 1);
        }
      }
      for (const skill of removedSkills) {
      }
      const updatedSkills = selectedSkills
        .filter((skill) => !removedSkills.includes(skill))
        .concat(newSkills)
        .concat(newlyCreatedSkills);
      setSelectedSkills(updatedSkills);
      setInputs((prevInputs) => ({
        ...prevInputs,
        skills: updatedSkills,
      }));
    } catch (error) {
      console.error("Error processing skills:", error);
    }
  };

  // Function to handle changes in interests, creating new interests if necessary
  const handleInterestsChange = async (selected) => {
    const newInterests = selected.filter(
      (interest) => !selectedInterests.some((i) => i.name === interest.name)
    );
    const removedInterests = selectedInterests.filter(
      (interest) => !selected.some((i) => i.name === interest.name)
    );
    const newlyCreatedInterests = [];
    try {
      // Process new interests
      for (const interest of newInterests) {
        if (!interests.some((i) => i.name === interest.name)) {
          const interestTypeSelected = new Promise((resolve) => {
            setResolveOnInterestTypeSelected(() => resolve);
          });
          handleOpenModal("interest");
          const interestType = await interestTypeSelected;
          const newInterest = {
            name: interest.name,
            interestType,
            projectId: 0,
            id: null,
          };
          delete newInterest.customOption;
          const createdInterest = await createKeyword(token, newInterest);
          console.log(createdInterest);
          newlyCreatedInterests.push(createdInterest);
          newInterests.splice(newInterests.indexOf(interest), 1);
        }
      }
      for (const interest of removedInterests) {
      }
      const updatedInterests = selectedInterests
        .filter((interest) => !removedInterests.includes(interest))
        .concat(newInterests)
        .concat(newlyCreatedInterests);
      setSelectedInterests(updatedInterests);
      setInputs((prevInputs) => ({
        ...prevInputs,
        interests: updatedInterests,
      }));
    } catch (error) {
      console.error("Error processing interests:", error);
    }
  };

  // Function to open the modal for selecting users to add to the project team if the number of slots is defined
  const handleOpenUsersModal = () => {
    if (!inputs.slots) {
      setError("Please define the number of slots first.");
    } else {
      setShowUsersModal(true);
      setError("");
    }
  };

  // Function to close the modal for selecting users to add to the project team
  const handleCloseUsersModal = () => {
    setShowUsersModal(false);
  };

  // Function to add a user to the project team
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

  // Function to select a type (skill or interest) in the modal
  const onTypeSelect = (type) => {
    setSelectedType(type);
    if (resolveOnSkillTypeSelected) {
      resolveOnSkillTypeSelected(type);
      setResolveOnSkillTypeSelected(null);
    } else if (resolveOnInterestTypeSelected) {
      resolveOnInterestTypeSelected(type);
      setResolveOnInterestTypeSelected(null);
    }
  };

  // Function to prevent the user from typing a comma or period in the number of slots input
  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (keyValue === "." || keyValue === ",") {
      event.preventDefault();
    }
  };

  // Function to handle changes in the number of slots input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  // Function to open the modal for selecting resources
  const handleOpenResourcesModal = () => {
    setShowResourcesModal(true);
  };

  // Function to close the modal for selecting resources
  const handleCloseResourcesModal = () => {
    setShowResourcesModal(false);
  };

  // Function to select resources/materials
  const handleSelect = (selectedMaterials) => {
    const updatedMaterials = selectedMaterials.map((material) => ({
      ...material,
      quantity: parseInt(material.quantity, 10),
    }));
    setInputs({ ...inputs, materials: updatedMaterials });
    handleCloseResourcesModal();
  };

  return (
    <>
      <Row>
        <Col md={6}>
          <FormGroup className="my-form-group">
            <Label>{t("Skills")}</Label>
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
            <Label>{t("Interests")}</Label>
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
          <FormGroup>
            <Label>{t("Materials")}</Label>
            <Button
              onClick={handleOpenResourcesModal}
              color="primary"
              className="modal-button d-block"
              style={{ marginTop: "0px", marginBottom: "10px"}}
            >
              {t("Add Materials")}
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
                    {t("Remove")}
                  </Button>
                </li>
              ))}
            </ul>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup className="my-form-group">
            <Label for="slots">{t("Number of Slots")}</Label>
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
            <Label>{t("Team Members")}</Label>
            <Button
              onClick={handleOpenUsersModal}
              color="primary"
              className="modal-button d-block"
              style={{ marginTop: "0px", marginBottom: "10px"}}
            >
              {t("Add Team Members")}
            </Button>
            {error && <p className="error-message">{error}</p>}
            <ul className="list-group">
              {inputs.teamMembers.map((member, index) => (
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
                  {!member.isProjectManager ? (
                    <Button
                      onClick={() => removeTeamMember(index)}
                      color="danger"
                      size="sm"
                      className="ml-2"
                    >
                      {t("Remove")}
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-between">
        <Button
          className="previous-button-step2"
          color="secondary"
          onClick={prevStep}
        >
          {t("Previous")}
        </Button>
        <Button
          className="next-button-step2"
          color="primary"
          onClick={nextStep}
        >
          {t("Next")}
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

