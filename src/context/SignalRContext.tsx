import React, { createContext, useContext, useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

// Định nghĩa kiểu dữ liệu cho Context
interface SignalRContextType {
  connection: HubConnection | null;
  connectionId: string | null; // Cung cấp connectionId nếu cần thiết
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

// Provider để cung cấp connection
export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://localhost:7001/chat") // URL của SignalR Hub
      .withAutomaticReconnect()
      .build();

    setConnection(connect);

    connect.start().then(() => {
      setConnectionId(connect.connectionId);
      console.log("Connection started, connection ID: ", connect.connectionId);
    }).catch((err) => console.error("Connection failed: ", err));

    // Cleanup khi component bị unmount
    return () => {
      if (connect) connect.stop();
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ connection, connectionId }}>
      {children}
    </SignalRContext.Provider>
  );
};

// Hook để sử dụng SignalRContext
export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};
