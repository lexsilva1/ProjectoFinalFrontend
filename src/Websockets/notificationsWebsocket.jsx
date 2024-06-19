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
  const SelectedUserMessages = userStore((state) => state.selectedUserMessages);
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
    if (message === 'You have been logged out due to inactivity.') {
      // Limpeza dos cookies
      Cookies.remove('authToken');
      Cookies.remove('i18nextLng');

      // Atualização do estado do login
      userStore.setState({ user: null });
      userStore.setState({ isLoggedIn: false });

      // Redirecionamento para a página inicial
      window.location.replace('/');
        // Retorna a função de limpeza
  return () => {
    ws.close();
  };
    }else if(messageObj.type === 'LAST_MESSAGE' && window.location.pathname === '/messages'){
      

      userstore.setState({userList: userList.map((user) => {
        if(user.sender.id === messageObj.sender.id){
          console.log(user);
          console.log(messageObj);
          console.log(messageObj.read);
          user = messageObj;
        }
        return user;
      })});
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