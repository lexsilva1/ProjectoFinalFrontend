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
export const getSkillTypes = async () => {
    const response = await fetch( baseURL + 'skills/types', {
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const types = await response.json();
    return types;
};

export const createSkill = async (token, skillDto) => {
    console.log(skillDto);
    const response = await fetch(baseURL + 'skills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(skillDto)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
}
export const deleteSkill = async (token, skillDto) => {
    const response = await fetch(baseURL + 'skills', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(skillDto)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
};

