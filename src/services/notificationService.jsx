import baseURL from "./baseURL";
import { useParams } from "react-router-dom";

const notificationsURL = baseURL + 'notifications';
const queryParams = new URLSearchParams();

export const getNotifications = async (token, queryParams) => {
    const response = await fetch(notificationsURL + '?' + queryParams, {
        headers: {
            'token': token
        }
    }).then(response => response.json());
    console.log(response);
    return response;
}
export const markAsRead = async (token, notificationId) => {
    console.log('notificationId', notificationId);
    const response = await fetch(notificationsURL + '/read/' + notificationId, {
        method: 'PUT',
        headers: {
            'token': token
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }else{
        return response;
    }
}

export const markAsSeen = async (token) => {
    const response = await fetch(notificationsURL + '/seen', {
        method: 'PUT',
        headers: {
            'token': token
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }else{
        return response.text();
    }
}