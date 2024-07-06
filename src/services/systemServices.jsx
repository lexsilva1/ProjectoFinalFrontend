import baseURL from './baseURL';

const systemURL = baseURL + 'systemVariables';

const getMaxUsers = async () => {
    const response = await fetch(systemURL + '/maxUsers', {
        headers: {
            'Content-Type': 'application/json',
            'token': token,
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const maxUsers = await response.json();
    return maxUsers;
};