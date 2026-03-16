import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/notifications");
      setNotifications(data);
    } catch (error) {
      console.log("Fetch notifications error:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
       const { data } = await axios.get("/api/notifications/unread-count");
       setUnreadCount(data.count);
    } catch (error) {
       console.log("Fetch unread count error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchNotifications();
      fetchUnreadCount();

      const newSocket = io("http://localhost:3001");
      setSocket(newSocket);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        newSocket.emit("addUser", user._id);
      }

      newSocket.on("newNotification", () => {
        fetchNotifications();
        fetchUnreadCount();
      });

      return () => newSocket.close();
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
       console.log("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/notifications/read-all");
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
       console.log("Mark all as read error:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
