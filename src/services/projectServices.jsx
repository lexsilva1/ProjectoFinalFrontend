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
export const projectApplication = async (token, projectName) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/apply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
}

export const inviteUser = async (token, projectName, userId) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/invite?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
};

export const manageInvitesApplications = async (token, projectName, userId, operationType, notificationId) => {
    if(notificationId === undefined) {
        notificationId = 0;
    }
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
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/tasks`, { 
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
export const updateTask = async (token, projectName, taskDto) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/tasks`, {
        method: 'PUT',
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
};
export const updateProjectStatus = async (token, projectName, status) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/status?status=${encodeURIComponent(status)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
       
    });


    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
}

export const promoteUser = async (token, projectName, userId) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/promote?userId=${userId}`, {
        method: 'PUT',
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

export const demoteUser = async (token, projectName, userId) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/demote?userId=${userId}`, {
        method: 'PUT',
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
export const fetchProjectUsers = async (token, projectName) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/projectUsers`, {
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

export const removeProjectUser = async (token, projectName, userId) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/ProjectUser?userId=${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
}
export const fetchProjectChat = async (token, projectName) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/chat`, {
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

export const fetchProjectLogs = async (token, projectName) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/logs`, {
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text(); 
    console.log(text); 
    try {
        return JSON.parse(text); 
    } catch (error) {
        throw new Error(`Invalid JSON: ${text}`); 
    }
};

export const createProjectLog = async (token, projectName, logDto) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/logs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(logDto)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const leaveProject = async (token, projectName) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}/leave`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
};

export const addResourceToProject = async (token, projectName, resourceId, quantity) => {
    const url = new URL(`${projectsURL}/${encodeURIComponent(projectName)}/resources`);
    url.searchParams.append("resourceId", resourceId);
    url.searchParams.append("quantity", quantity);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return await response.json();
    }
};

export const removeResourceToProject = async (token, projectName, resourceId, quantity) => {
    const url = new URL(`${projectsURL}/${encodeURIComponent(projectName)}/resources`);
    url.searchParams.append("resourceId", resourceId);
    url.searchParams.append("quantity", quantity);

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return await response.json();
    }
};

export const updateResourceToProject = async (token, projectName, resourceId, quantity) => {
    const url = new URL(`${projectsURL}/${encodeURIComponent(projectName)}/resources`);
    url.searchParams.append("resourceId", resourceId);
    url.searchParams.append("quantity", quantity);

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return await response.json();
    }
};

export const updateProject = async (token, projectName, projectDto) => {
    const response = await fetch(`${projectsURL}/${encodeURIComponent(projectName)}`, {
        method: 'PUT',
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
};




