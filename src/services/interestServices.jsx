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
export const getInterestTypes = async () => {
    const response = await fetch( baseURL + 'interests/types', {
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const types = await response.json();
    return types;
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
    const response = await fetch(baseURL + 'interests/removeInterest', {
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

    const result = await response.text();
    return result;
};
