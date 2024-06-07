import baseURL from "./baseURL";

const resourcesURL = baseURL + 'resources';

export const getResources = async (token, resourceName, resourceType, resourceIdentifier, supplier) => {
    const params = new URLSearchParams({
        resourceName,
        resourceType,
        resourceIdentifier,
        supplier
    });

    const response = await fetch(`${resourcesURL}?${params.toString()}`, {
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

     