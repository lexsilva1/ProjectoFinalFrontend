export const getLabs = async (token) => {
    const response = await fetch('/labs', {
        headers: {
            'token': token
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const labs = await response.json();
    return labs;
};