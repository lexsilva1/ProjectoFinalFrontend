import userStore from "../stores/userStore";
import Cookies from 'js-cookie';
import { getLastMessages } from "../services/messageServices";
import { useEffect, useState } from "react";
import userstore from "../stores/userStore";
import { set } from "react-hook-form";

const useStartWebSocket = (token) => {

  const [socket, setSocket] = useState(null);
  const websocketURL = 'ws://localhost:8080/projectoFinalBackend/websocket/notifications/';
  const userList = userStore((state) => state.userList);
  const setUserList = userStore((state) => state.setUserList);
  const notifications = userStore((state) => state.notifications);
  const setNotifications = userStore((state) => state.setNotifications);
  const MessageType = {
    LAST_MESSAGE: 'LAST_MESSAGE',
    INVITE: 'INVITE',
    APPLY: 'APPLY',
    ACCEPT: 'ACCEPT',
    REJECT: 'REJECT',
    EXCLUDE: 'EXCLUDE',
    PROMOTED: 'PROMOTED',
    DEMOTED: 'DEMOTED',
    TASK_ASSIGN: 'TASK_ASSIGN',
    TASK_DOING: 'TASK_DOING',
    TASK_COMPLETE: 'TASK_COMPLETE',
    PROJECT_COMPLETE: 'PROJECT_COMPLETE',
    PROJECT_CANCEL: 'PROJECT_CANCEL',
    PROJECT_APPROVED: 'PROJECT_APPROVED',
    PROJECT_READY: 'PROJECT_READY',
    PROJECT_DOING: 'PROJECT_DOING',
    CHAT: 'CHAT',
    FORCED_LOGOUT: 'FORCED_LOGOUT',
  };
  useEffect(() => {
    const ws = new WebSocket(websocketURL+`${token}`);
  setSocket( ws );
   ws.onopen = function() {
    console.log('WebSocket connection opened');
    
   }
    



  // Definição do manipulador de mensagens
  ws.onmessage = function(event) {
    console.log('Message received:', event.data);
    const message = event.data;
    const messageObj = JSON.parse(message);

    switch (messageObj.type) {
      case MessageType.FORCED_LOGOUT:

      // Limpeza dos cookies
      Cookies.remove('authToken');
      Cookies.remove('i18nextLng');
 

      // Atualização do estado do login
      userStore.setState({ user: null });
      userStore.setState({ isLoggedIn: false });

      // Redirecionamento para a página inicial
      window.location.replace('/');
      break;
      case MessageType.LAST_MESSAGE:
      

      userstore.setState({userList: userList.map((user) => {
        if(user.sender.id === messageObj.sender.id){

          user = messageObj;
        }
        return user;
      
      })});
    break;
      case MessageType.ACCEPT:
      case MessageType.REJECT:
        const newNotifications = notifications.filter((notification) => messageObj.notificationId !== notification.notificationId);
        setNotifications([...newNotifications, messageObj]);
      
      

  }
  }


  ws.onclose = function() {
    console.log('WebSocket connection closed');
  }
  
  ws.onerror = function(event) {
    console.error('WebSocket error observed:', event);
  }
}, [token, userList, setUserList]);
function startWebSocket(token) {
  if (socket !== null && socket.readyState === WebSocket.OPEN) {
    socket.send(token);
  }
}

return { startWebSocket };
};


export default useStartWebSocket;