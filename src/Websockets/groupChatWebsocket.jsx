import React, { useEffect, useState } from 'react';
import userstore from '../stores/userStore';
import { useParams } from 'react-router-dom';
import { fetchProjectChat } from '../services/projectServices';

const useChatSocket = (authToken, projectName) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    
    const socket = new WebSocket(`ws://localhost:8080/projectoFinalBackend/websocket/groupchat/${encodeURIComponent(projectName)}/${authToken}`);

    // Connection opened
    socket.onopen = function () {
      console.log('WebSocket connection opened');
      const fetchMessages = async () => {
        const messages = await fetchProjectChat(authToken, projectName);
        setMessages(messages);
      };
      fetchMessages();
    };

    // Listen for messages
    socket.onmessage = function (event) {
      console.log(`Message received: ${event.data}`);
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Connection closed
    socket.onclose = function () {
      console.log('WebSocket connection closed');
    };

    socket.onerror = function (event) {
      console.error('WebSocket error observed:', event);
    };

    setSocket(socket);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, [authToken, projectName]); // Only re-run the effect if authToken or projectName changes

  const sendMessage = (message) => {
    if (socket.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      socket.send(message);
    }
  };

  return { sendMessage, messages, setMessages };
};

export default useChatSocket;