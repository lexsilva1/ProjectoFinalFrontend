import React, { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import userstore from '../stores/userStore';

const useMsgSocket = (authToken,id, selectedMessages) => {
    const [socket, setSocket] = useState(null);
    const setSelectedMessages = userstore((state) => state.setSelectedMessages);
    const selectedUserMessages = userstore((state) => state.selectedUserMessages);
 
    useEffect(() => {
        // Create a new WebSocket connection
        const socket = new WebSocket( `ws://localhost:8080/projectoFinalBackend/websocket/messages/${authToken}/${id}`);

        
        // Connection opened
 socket.onopen = function () {
    console.log('WebSocket connection opened');
    }
        // Listen for messages
    socket.onmessage = function (event) {
        console.log(`Message received: ${event.data}`);
        const message = JSON.parse(event.data);
        const messages = selectedMessages;
        messages.push(message);
        setSelectedMessages(messages);

    }

        // Connection closed
      socket.onclose = function () {
        console.log('WebSocket connection closed');
    }
    socket.onerror = function (event) {
        console.error('WebSocket error observed:', event);
    }
    setSocket (socket);
    
    }, [selectedUserMessages]);
    const sendMessage = (message) => {
        console.log(message);
        console.log("socket" +socket);
       if(socket.readyState === WebSocket.OPEN){
        
            console.log('Sending message:', message);
          socket.send(message );
       }
        
      };
      

    return [sendMessage];
};

export default useMsgSocket;