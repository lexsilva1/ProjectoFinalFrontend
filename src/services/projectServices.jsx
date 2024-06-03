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
export const getAllStatus = async () => {
    const response = await fetch(projectsURL + '/status');

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
}
