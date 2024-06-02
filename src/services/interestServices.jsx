import baseURL from './baseURL';

export const getInterests = async () => {
    const response = await fetch( baseURL + 'interests', {
      
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const interests = await response.json();
    return interests;
};