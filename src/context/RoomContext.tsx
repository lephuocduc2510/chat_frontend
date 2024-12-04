// RoomContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Define the shape of the context
interface RoomContextType {
  isCreatingRoom: boolean;
  setIsCreatingRoom: React.Dispatch<React.SetStateAction<boolean>>;
}


const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Provider component
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);

  return (
    <RoomContext.Provider value={{ isCreatingRoom, setIsCreatingRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

// Custom hook to use the RoomContext
export const useRoomContext = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};