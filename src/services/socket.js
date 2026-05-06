import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});

socket.on('connect', () => {
  // --- ¡NUEVO LOG DE DIAGNÓSTICO! ---
  console.log(`%c[Socket.js] ¡CONECTADO! El ID de esta instancia es: ${socket.id}`, 'color: green; font-weight: bold;');
});

socket.on('disconnect', () => {
  console.log('%c[Socket.js] DESCONECTADO', 'color: red;');
});

export default socket;
