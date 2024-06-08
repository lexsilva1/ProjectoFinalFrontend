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
};

     