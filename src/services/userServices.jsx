import baseURL from './baseURL';

const usersURL = baseURL + 'users';
console.log(usersURL);

export const login = async (email, password) => {
    try {
        const response = await fetch(usersURL + '/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'email': email,
                'password': password
            },
        });
        return await response.text();
        
    } catch (error) {
        console.error(error);
    }
}