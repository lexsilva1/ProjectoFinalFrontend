import baseURL from "./baseURL";
import { useParams } from "react-router-dom";

const projectsURL = baseURL + 'projects';
const queryParams = new URLSearchParams();


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
export const getProject = async (name, token) => {
    const response = await fetch(projectsURL + '/' + encodeURIComponent(name), {
        headers: {
            'token': token
        }
    });

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

export const getProjectByName = async (token, projectName) => {
    const response = await fetch( projectsURL + `/${projectName}`, {
        headers: {
            'token': token
        }
    });

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

export const createProject = async (token, projectDto) => {
    const response = await fetch(projectsURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify(projectDto)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  };

  export const getStatistics = async (token) => {
    const response = await fetch(`${projectsURL}/statistics`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
export const manageInvitesApplications = async (token, projectName, userId, operationType, notificationId) => {
    const queryParams = new URLSearchParams({ userId, operationType, notificationId }).toString();
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/accept?${queryParams}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
   
    return response.json();
};
export const rejectInvitesApplications = async (token, projectName, userId, operationType, notificationId) => {
    const queryParams = new URLSearchParams({ userId, operationType, notificationId }).toString();
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/reject?${queryParams}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}





