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
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return text;
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


     