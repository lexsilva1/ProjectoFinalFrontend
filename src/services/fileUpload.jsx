import baseURL from "./baseURL";

export const uploadFile = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(baseURL + 'upload/file', {
        method: 'POST',
        headers: {
            'token': token
        },  
        body: formData
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }else {
        const data = await response.text();
        return data;
    }
}


