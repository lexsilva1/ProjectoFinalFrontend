import userStore from "../stores/userStore";
import Cookies from 'js-cookie';
import { getLastMessages } from "../services/messageServices";
import { useEffect, useState } from "react";
import userstore from "../stores/userStore";
import { set } from "react-hook-form";
import { DateTime } from 'luxon';
const useStartWebSocket = (token) => {

  const [socket, setSocket] = useState(null);
  const websocketURL = 'ws://localhost:8080/projectoFinalBackend/websocket/notifications/';
  const userList = userStore((state) => state.userList);
  const setUserList = userStore((state) => state.setUserList);
  const notifications = userStore((state) => state.notifications);
  const setNotifications = userStore((state) => state.setNotifications);
  const setUnreadMessages = userStore((state) => state.setUnreadMessages);

  const user = userStore((state) => state.user);
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
    PROMOTED_ADMIN: 'PROMOTED_ADMIN',
  DEMOTED_ADMIN: 'DEMOTED_ADMIN',
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
        if (user.id === messageObj.sender.id) {
          console.log('user.id dentro do 1 if', user.id);
          messageObj.read = true;
          setUnreadMessages(false);
        }
        console.log('userList', userList);
      
        // Check if sender exists in userList
        const senderExists = userList.some(userItem => userItem.sender.id === messageObj.sender.id);
      
        if (!senderExists) {
          // If sender does not exist, add messageObj to userList
          userStore.setState(state => ({
            userList: [...state.userList, { ...messageObj, timestamp: Date.now() }]
          }));
        } else {
          // If sender exists, update userList
          userStore.setState(state => ({
            userList: state.userList.map(userItem => {
              if (userItem.sender.id === messageObj.sender.id) {
                console.log('userItem dentro do 2 if', userItem, DateTime.now().toString());
                console.log('messageObj dentro do 2 if', messageObj, DateTime.now().toString());
                console.log('userList dentro do 2 if', state.userList, DateTime.now().toString());
                if (!messageObj.read) {
                  setUnreadMessages(true); // This might need adjustment based on how setUnreadMessages is supposed to work
                }
                return { ...userItem, ...messageObj, timestamp: Date.now() };
              }
              return userItem;
            })
          }));
        }
      
        // Sort userList by most recent message, assuming each item has a 'timestamp' property
        userStore.setState(state => ({
          userList: state.userList.sort((a, b) => b.timestamp - a.timestamp)
        }));
      
        console.log('userList', userStore.getState().userList, DateTime.now().toString());
      
        break;
      
      case MessageType.ACCEPT:
      case MessageType.REJECT:
        const newNotifications = notifications.filter((notification) => messageObj.notificationId !== notification.notificationId);
        setNotifications([...newNotifications, messageObj]);
        break
      case MessageType.INVITE:
      case MessageType.APPLY:
      case MessageType.EXCLUDE:
      case MessageType.ACCEPT_APPLICATION:  
      case MessageType.REJECT_APPLICATION:
      case MessageType.PROMOTED:
      case MessageType.DEMOTED:
      case MessageType.USER_LEFT:
      case MessageType.PROJECT_USERS_EXCEEDED:
      case MessageType.PROJECT_FULL:    
      case MessageType.TASK_EXECUTOR:  
      case MessageType.TASK_ASSIGN:
      case MessageType.TASK_DOING:
      case MessageType.TASK_COMPLETE:
      case MessageType.PROJECT_COMPLETE:
      case MessageType.PROJECT_CANCEL:
      case MessageType.PROJECT_APPROVED:
      case MessageType.PROJECT_READY:
      case MessageType.PROJECT_DOING:
      case MessageType.PROJECT_REJECTED:

          const existingNotification = notifications.find((notification) => notification.notificationId === messageObj.notificationId);
          if (existingNotification) {
            const updatedNotifications = notifications.map((notification) => {
              if (notification.notificationId === messageObj.notificationId) {
                return messageObj;
              }
              return notification;
            });
            setNotifications(updatedNotifications);
          } else {
            setNotifications([messageObj, ...notifications]);
          }
          break;
          case MessageType.PROMOTED_ADMIN:
            const existingPromotionNotification = notifications.find((notification) => notification.notificationId === messageObj.notificationId);
            if (existingPromotionNotification) {
              const updatedNotifications = notifications.map((notification) => {
                if (notification.notificationId === messageObj.notificationId) {
                  return messageObj;
                }
                return notification;
              });
              setNotifications(updatedNotifications);
            } else {
              setNotifications([messageObj, ...notifications]);
            }
            userstore.setState({ user,role :user.role = 1 });
            break;
            case MessageType.DEMOTED_ADMIN:
              const existingDemotionNotification = notifications.find((notification) => notification.notificationId === messageObj.notificationId);
              if (existingDemotionNotification) {
                const updatedNotifications = notifications.map((notification) => {
                  if (notification.notificationId === messageObj.notificationId) {
                    return messageObj;
                  }
                  return notification;
                });
                setNotifications(updatedNotifications);
              } else {
                setNotifications([messageObj, ...notifications]);
              }
              userstore.setState({ user,role :user.role = 10 });
              break;
          
         



   
          
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