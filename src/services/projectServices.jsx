import baseURL from "./baseURL";

const projectsURL = baseURL + 'projects';

export const getProjects = async () => {
    const response = await fetch(projectsURL);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const data = await response.text();
        try {
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Invalid JSON: ${data}`);
        }
    }
};

export const getAllLabs = async () => {
    const response = await fetch(projectsURL + 'projectLab');

    if (!response.ok) {
        throw new Error('Network response was not ok');
    } else {
        const labs = await response.json();
        return labs;
    }
};

export const getAllSkills = async () => {
    const response = await fetch(projectsURL + 'skills');

    if (!response.ok) {
        throw new Error('Network response was not ok');
    } else {
        const labs = await response.json();
        return labs;
    }
};