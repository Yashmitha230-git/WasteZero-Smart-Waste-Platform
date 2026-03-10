import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import toast from 'react-hot-toast';

const NotificationContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(() => {
    const saved = localStorage.getItem("globalUnreadCount");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    localStorage.setItem("globalUnreadCount", unreadCount.toString());
  }, [unreadCount]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const userId = user.id || user._id;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit("addUser", userId);

    newSocket.on("receiveMessage", (data) => {
      // We check if the current path is NOT /messages before incrementing
      if (window.location.pathname !== "/messages") {
        setUnreadCount((prev) => prev + 1);
        toast.success(`You have a new message!`, { icon: '💬', id: 'global-msg-toast' });
      }
    });

    return () => newSocket.close();
  }, []);

  const clearNotifications = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, clearNotifications, socket }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
