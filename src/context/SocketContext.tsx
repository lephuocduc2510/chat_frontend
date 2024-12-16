// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ReactNode } from 'react';
// Tạo context cho socket
const SocketContext = createContext<Socket | null>(null);

// Khởi tạo socket (chỉ thực hiện một lần)



interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Kiểm tra nếu socket đã tồn tại
        
        const newSocket = io('http://127.0.0.1:9000', {
            secure: true,
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 5000,
            reconnectionAttempts: 20,
          });
          setSocket(newSocket);
      
          newSocket.on('connect', () => {
            console.log(`Socket connected with id: ${newSocket.id}`);
          });
      
          return () => {
            newSocket.disconnect();
          };
        }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook để dễ dàng sử dụng socket trong các component
export const useSocket = () => useContext(SocketContext);
