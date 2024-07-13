import baseURL from './baseURL';

const systemURL = baseURL + 'systemVariables';

export const setSystemVariables= async (token, systemVariablesDto) => {
    const response = await fetch(`${systemURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token,
        },
        body: JSON.stringify (systemVariablesDto)
    });

    if (!response.ok) {
        const errorText = await response.text();
        
    } else {
        return response.text();
    }
};


export const getSystemVariables = async (token) => {
    const response = await fetch(systemURL, {
        headers: {
            'Content-Type': 'application/json',
            'token': token,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        
    } else {
        return await response.text();
    }
};