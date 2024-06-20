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