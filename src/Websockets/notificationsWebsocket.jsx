import userStore from "../stores/userStore";
import Cookies from 'js-cookie';

export function startWebSocket() {
  const websocketURL = 'ws://localhost:8080/projectoFinalBackend/websocket/notifications/';
  const socket = new WebSocket(websocketURL+`${Cookies.get('authToken')}`);

  // Definição do manipulador de mensagens
  socket.onmessage = function(event) {
    const message = event.data;
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
    socket.close();
  };
    }else if(message.type === 'LAST_MESSAGE'){
      let userList = userStore((state) => state.userList);
      const userIndex = userList.findIndex((user) => user.id === message.sender.id);
      
      if(userIndex !== -1){
        // Update the user's last message
        userList[userIndex].messages = [message];
      }else{
        // Add new user with the message
        userList.push({id: message.sender.id, messages: [message]});
      }
      
      // Order userList by message timestamp, assuming message has a timestamp property
      userList = userList.sort((a, b) => {
        const lastMessageA = a.messages[0].time;
        const lastMessageB = b.messages[0].time;
        return lastMessageB - lastMessageA; // For descending order
      });
      
      userStore.setState({ userList: userList });
    }
    }



}