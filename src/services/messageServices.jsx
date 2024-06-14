import baseURL from "./baseURL";

const messagesURL = baseURL + 'messages/';

export const getMessages = async (token, userId) => {
    const response = await fetch(messagesURL+ `${userId}`, {
        method: 'GET',
        headers: {
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    } else {
        const data = await response.text();
        try {
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Invalid JSON: ${data}`);
        }
    }
}

export const sendMessage = async (token, messageDto) => {
    const response = await fetch(messagesURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(messageDto)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    } else {
        const data = await response.text();
        return data;
    }
}

export const getLastMessages = async (token) => {
    console.log('token:', token);
    const response = await fetch(messagesURL , {
        method: 'GET',
        headers:
        {
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    } else {
        const data = await response.json();
        return data;
    }
}