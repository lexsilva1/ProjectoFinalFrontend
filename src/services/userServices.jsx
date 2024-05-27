import baseURL from './baseURL';

const usersURL = baseURL + 'users';
console.log(usersURL);

export const login = async (email, password) => {
    try {
        const response = await fetch(usersURL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }) 
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}