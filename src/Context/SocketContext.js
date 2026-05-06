import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// --- CAMBIO: Añadir la opción 'withCredentials' ---
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true // Importante para la comunicación entre orígenes
});

socket.on('connect', () => {
  console.log(`%c[SocketContext] ¡CONECTADO! El ID del socket es: ${socket.id}`, 'color: green; font-weight: bold;');
});

socket.on('disconnect', () => {
  console.log('%c[SocketContext] DESCONECTADO', 'color: red;');
});

const SocketContext = createContext(socket);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
