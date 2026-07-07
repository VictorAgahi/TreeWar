import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  connected: boolean;
}

export const SocketContext = createContext<SocketContextProps>({ socket: null, connected: false });

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to WebSocket server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
