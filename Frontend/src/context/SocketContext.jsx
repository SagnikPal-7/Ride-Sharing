import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}`); // Change if backend runs elsewhere

const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, []);

//   const sendMessage = (eventName, message) => {
//     socket.emit(eventName, message);
//   };

//   const receiveMessage = (eventName, callback) => {
//     socket.on(eventName, callback);
//   };

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
