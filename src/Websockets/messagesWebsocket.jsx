import React, { useEffect } from 'react';

const MessagesWebsocket = (authToken,id) => {
    useEffect(() => {
        // Create a new WebSocket connection
        const socket = new WebSocket( `ws://localhost:8080/projectoFinalBackend/websocket/messages/${authToken}/${id}`);


        // Connection opened
        socket.addEventListener('open', (event) => {
            console.log('WebSocket connection established');
        });

        // Listen for messages
        socket.addEventListener('message', (event) => {
            console.log('Received message:', event.data);

            
            // Handle the received message here
        });

        // Connection closed
        socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed');
        });

        // Clean up the WebSocket connection on component unmount
        return () => {
            socket.close();
        };
    }, []);

    return <div>WebSocket connection</div>;
};

export default MessagesWebsocket;