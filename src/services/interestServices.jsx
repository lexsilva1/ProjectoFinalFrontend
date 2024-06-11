import baseURL from './baseURL';

export const getInterests = async () => {
    const response = await fetch( baseURL + 'interests', {
      
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const interests = await response.json();
    return interests;
}

export const createInterest = async (token, interestDto) => {
    const response = await fetch(baseURL + 'interests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(interestDto)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
}

export const deleteInterest = async (token, interestDto) => {
    const response = await fetch(baseURL + 'interests', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(interestDto)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
};
