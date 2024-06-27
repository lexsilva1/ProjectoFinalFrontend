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
    try{
        console.log("sending projectDto",projectDto);
    const response = await fetch(projectsURL+"/", {
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
  
    return response.text();
  } catch (error) {
    console.error("HTTP error!", error);
    throw new Error(`An error occurred: ${error.message}`);
  }
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
export const projectPhotoUpload = async (token, projectName, photo) => {
    const formData = new FormData();
    formData.append('input', photo);
    const response = await fetch(baseURL + 'upload/projectPhoto', {
        method: 'POST',
        headers: {
            'token': token,
            'name': projectName
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
}

export const createTask = async (token, projectName, taskDto) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/createTask`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(taskDto)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const getTasks = async (token, projectName) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/tasks`, {
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        const data = await response.json();
        return data;
      }
};









