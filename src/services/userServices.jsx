import Cookies from 'js-cookie';
import baseURL from './baseURL';
import userStore from '../stores/userStore';

const usersURL = baseURL + 'users';

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
        const text = await response.text();
        console.log(text);
        if (response.ok) {
            Cookies.set('authToken', text);
            userStore.setState({ isLoggedIn: true }); 
            return true; 
        }
        return false; 
    } catch (error) {
        console.error(error);
        return false; 
    }
}

export const  logout = async () => {
    console.log(Cookies.get());
    const token = Cookies.get('authToken');
    try {
        const response = await fetch(usersURL + '/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
        });
        const text = await response.text();
        Cookies.remove('authToken'); 
        if (response.ok) {
            userStore.setState({ isLoggedIn: false });
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}
export const forceLogout = () => {
    Cookies.remove('authToken');
    userStore.setState({ isLoggedIn: false });
}

export const registerUser = async (email, password) => {
    const response = await fetch(usersURL + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'email': email,
            'password': password
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Error during registration');
    }
}

export const confirmUser = async (token, userConfirmation) => {
    const response = await fetch(usersURL + '/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(userConfirmation)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('Response text from server:', responseText);

    return responseText; // Return the response text directly
}