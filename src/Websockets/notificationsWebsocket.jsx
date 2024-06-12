import userStore from "../stores/userStore";
import Cookies from 'js-cookie';

export function startWebSocket() {
  const websocketURL = 'ws://localhost:8080/projectoFinalBackend/websocket/notifications';
  const socket = new WebSocket(websocketURL);

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
    }
  };

  // Retorna a função de limpeza
  return () => {
    socket.close();
  };
}