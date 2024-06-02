import baseURL from './baseURL';

export const getSkills = async () => {
    const response = await fetch( baseURL + 'skills', {
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const skills = await response.json();
    return skills;
};