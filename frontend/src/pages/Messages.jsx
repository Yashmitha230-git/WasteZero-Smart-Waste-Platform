import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000");

const Messages = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const currentUserId = storedUser?._id;
  const currentRole = storedUser?.role;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  // 🔥 IMPORTANT: Put REAL MongoDB IDs here
  const NGO_ID = "6658f3a21db83a12ab34cd56";
  const VOLUNTEER_ID = "6658f39c8a12ab34cd56ef78";

  const receiverId =
    currentRole === "volunteer" ? NGO_ID : VOLUNTEER_ID;

  // ✅ Add user to socket
  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("addUser", currentUserId);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [currentUserId]);

  // ✅ Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(
        "http://localhost:3000/api/messages",
        {
          senderId: currentUserId,
          receiverId: receiverId,
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverId: receiverId,
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          senderId: currentUserId,
          receiverId: receiverId,
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      setMessage("");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-full bg-gray-100 w-full">
      <div className="flex-1 flex flex-col">

        <div className="p-4 bg-white shadow-sm border-b">
          <h2 className="font-semibold">
            {currentRole === "volunteer"
              ? "Chat with NGO"
              : "Chat with Volunteer"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-sm p-3 rounded-xl text-sm shadow ${
                  msg.senderId === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        <div className="p-4 bg-white border-t flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-full"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default Messages;