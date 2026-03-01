import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";
const socketContext = createContext();

// it is a hook.
export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();

  useEffect(() => {
    // if (authUser) {
    //   const socket = io("http://localhost:3000", {
    //     query: {
    //       userId: authUser.user?._id,
    //       withCredentials: true,
    //     },
    //   });
    //   setSocket(socket);
    //   socket.on("getOnlineUsers", (users) => {
    //     setOnlineUsers(users);
    //   });
    //   return () => socket.close();
    // } else {
    //   if (socket) {
    //     socket.close();
    //     setSocket(null);
    //   }
    // }
     if (!authUser) {
    socket?.close();
    setSocket(null);
    return;
  }
  // console.log("authUser:", authUser);
  const newSocket = io(process.env.VITE_API_URL, {
    query: { userId: authUser.user._id },
    withCredentials: true,
  });

  setSocket(newSocket);
  newSocket.on("getOnlineUsers", setOnlineUsers);

  return () => newSocket.close();
  }, [authUser]);
  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};