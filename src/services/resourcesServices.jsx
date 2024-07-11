import baseURL from "./baseURL";

const resourcesURL = baseURL + 'resources';

export const getResources = async (token) => {

    const response = await fetch(resourcesURL, {
        headers: {
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return await response.json();
    }
}

export const createResource = async (token, resourceDto) => {
    const response = await fetch(resourcesURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(resourceDto)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const data = await response.json(); // Corrected line: Changed variable name from 'response' to 'data'
        try {
            return data; // Corrected line: Changed 'response' to 'data'
        } catch {
            return response.text(); // This line remains the same as it refers to the original 'response' object
        }
    }
};
export const getResourceStatistics = async (token) => {
    const response = await fetch(resourcesURL + '/statistics', {
        headers: {
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return await response.json();
    }
};


export const updateResource = async (token, resourceId, resourceDto) => {
    const updateURL = `${resourcesURL}/${resourceId}`;

    const response = await fetch(updateURL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(resourceDto)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return await response.text();
    }
}

     