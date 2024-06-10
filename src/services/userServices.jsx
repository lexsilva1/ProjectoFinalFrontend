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
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            Cookies.set('authToken', data.token);
            userStore.setState({ isLoggedIn: true, user: data }); 
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

export const findAllUsers = async (token) => {
    const response = await fetch(usersURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token, 
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const users = await response.json(); 
    return users;
  };

export const findUserById = async (token, id) => {
    try {
        const response = await fetch(usersURL + `/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const uploadUserPhoto = async (file, token) => {
    const formData = new FormData();
    formData.append('input', file);

    const response = await fetch(baseURL + 'upload/userPhoto', {
        method: 'POST',
        headers: {
            'token': token
        },  
        body: formData
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }else {
        const data = await response.text();
        return data;
    }
}

export const updateUser = async (id, userDto, token) => {
    const response = await fetch(usersURL + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(userDto)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const data = await response.text();
        return data;
    }
}

