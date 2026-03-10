import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiSearch, FiSend, FiUser, FiMessageCircle, FiSmile, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useNotifications } from "../context/NotificationContext";
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';

const Messages = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const currentUserId = storedUser?.id || storedUser?._id;
  
  const { socket, clearNotifications } = useNotifications();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const [unreadUsers, setUnreadUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef();
  const emojiPickerRef = useRef();

  // ✅ Fetch All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const otherUsers = res.data.filter(u => {
          const uid = (u._id || u.id);
          if (uid === currentUserId) return false;
          
          // Role matching filter
          if (storedUser.role === 'ngo' && u.role !== 'volunteer') return false;
          if (storedUser.role === 'volunteer' && u.role !== 'ngo') return false;
          // Note: Admin roles can talk to anyone
          
          return true;
        });
        setUsers(otherUsers);
        setFilteredUsers(otherUsers);

        // Fetch conversations for all users to show previews and counts
        const convos = {};
        await Promise.all(otherUsers.map(async (u) => {
          const uid = u._id || u.id;
          try {
            const mres = await axios.get(`/api/messages/${uid}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            convos[uid] = mres.data;
          } catch(e) {
            console.error(e);
          }
        }));
        setAllMessages(convos);

        // Fetch unread counts from DB
        try {
          const unreadRes = await axios.get("/api/messages/unread", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUnreadUsers(unreadRes.data);
        } catch(e) {
          console.error("Failed to fetch unread", e);
        }

      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
    
    // On mount, clear global notification count
    clearNotifications();
  }, [currentUserId, token]);

  // ✅ Handle Search
  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // ✅ Listen for messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (data) => {
      const senderId = data.senderId;
      
      // Update allMessages state with new message
      setAllMessages((prev) => {
        const next = { ...prev };
        const newMsg = { ...data, createdAt: new Date().toISOString() };
        if (next[senderId]) {
          next[senderId] = [...next[senderId], newMsg];
        } else {
          next[senderId] = [newMsg];
        }
        return next;
      });

      if (selectedUser && (senderId === (selectedUser._id || selectedUser.id))) {
        setMessages((prev) => [...prev, { ...data, createdAt: new Date().toISOString() }]);
      } else {
        setUnreadUsers(prev => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
        
        // Find sender for toast notification
        const sender = users.find(u => (u._id || u.id) === senderId);
        if (sender) {
          toast.success(`Message from ${sender.name}`, { icon: '💬' });
        } else {
          toast.success(`You have a new message!`, { icon: '💬' });
        }
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [socket, selectedUser, users]);

  // ✅ Fetch Conversation History
  useEffect(() => {
    if (!selectedUser) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const otherId = selectedUser._id || selectedUser.id;
        const res = await axios.get(`/api/messages/${otherId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        
        // Also ensure read receipt is triggered explicitly just in case
        await axios.put("/api/messages/read", { otherUserId: otherId }, {
          headers: { Authorization: `Bearer ${token}` }
        });

      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [selectedUser, token]);

  // ✅ Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Click Outside Emoji Picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowSettings(false); // Close settings when switching users
    const userId = user._id || user.id;
    setUnreadUsers(prev => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  };

  const handleClearChat = async () => {
    if (!selectedUser) return;
    try {
      const otherId = selectedUser._id || selectedUser.id;
      await axios.delete(`/api/messages/${otherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
      setAllMessages(prev => {
        const next = {...prev};
        next[otherId] = [];
        return next;
      });
      setShowSettings(false);
      toast.success("Chat cleared successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear chat");
    }
  };

  const onEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    const receiverId = selectedUser._id || selectedUser.id;

    try {
      const msgData = { senderId: currentUserId, receiverId, text: message };
      await axios.post("/api/messages", msgData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      socket.emit("sendMessage", msgData);

      const msgObj = { ...msgData, createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, msgObj]);
      setAllMessages((prev) => {
        const next = { ...prev };
        if (next[receiverId]) {
          next[receiverId] = [...next[receiverId], msgObj];
        } else {
          next[receiverId] = [msgObj];
        }
        return next;
      });
      setMessage("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex-1 min-h-0 flex bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border dark:border-gray-700 transition-colors duration-200">
      {/* Sidebar: User List */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col h-full shrink-0">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Messages</h2>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest font-semibold">Coordinate waste pickup</p>
          
          <div className="relative mt-4">
            <FiSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-800 dark:text-gray-200 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const uid = user._id || user.id;
              const isSelected = (selectedUser?._id || selectedUser?.id) === uid;
              const unread = unreadUsers[uid];

              return (
                <div
                  key={uid}
                  onClick={() => handleSelectUser(user)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 group ${
                    isSelected ? "bg-green-50 dark:bg-green-900/40 z-10" : ""
                  }`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border transition-all ${
                      isSelected ? "bg-green-600 text-white border-green-600 scale-105" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 border-green-200 dark:border-green-800 group-hover:scale-105"
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`font-bold truncate text-base ${isSelected ? "text-green-800 dark:text-green-400" : "text-gray-900 dark:text-gray-200"}`}>
                        {user.name} 
                      </h4>
                      {unread > 0 && !isSelected && (
                        <div className="bg-green-500 text-white text-[11px] w-[20px] h-[20px] flex items-center justify-center rounded-full shadow-sm font-bold ml-2 shrink-0">
                          {unread}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="overflow-hidden pr-2">
                        {allMessages[uid] && allMessages[uid].length > 0 ? (
                          <span className={`text-[13px] truncate block ${unread > 0 && !isSelected ? "text-gray-900 dark:text-gray-100 font-semibold" : "text-gray-500 dark:text-gray-400"}`}>
                             {allMessages[uid][allMessages[uid].length - 1].senderId === currentUserId ? '~ You: ' : `~ ${user.name.split(' ')[0]}: `}
                             {allMessages[uid][allMessages[uid].length - 1].text}
                          </span>
                        ) : (
                          <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md tracking-wider inline-block ${
                            user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                            user.role === 'ngo' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          }`}>
                            {user.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center flex flex-col items-center">
              <FiUser className="w-12 h-12 opacity-20 dark:opacity-40 text-gray-500 dark:text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] dark:bg-gray-900 relative overflow-hidden transition-colors">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between shadow-sm z-10 sticky top-0 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 dark:bg-green-700 text-white flex items-center justify-center font-bold shadow-sm uppercase">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{selectedUser.name}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-green-200 dark:border-green-800"></span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{selectedUser.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors outline-none"
                >
                  <FiMoreVertical className="w-5 h-5" />
                </button>
                
                {showSettings && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50 overflow-hidden">
                      <button 
                        onClick={handleClearChat}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors font-medium"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Clear Chat
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/black-mamba.png')] bg-fixed transition-colors pointer-events-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 dark:border-green-900 dark:border-t-green-500 rounded-full animate-spin"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg, index) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={index} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] md:max-w-[70%] group relative ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed transition-all ${
                          isMe ? "bg-green-600 text-white rounded-tr-none" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700"
                        }`}>
                          {msg.text}
                          <div className={`text-[9px] mt-1.5 font-bold uppercase tracking-tighter opacity-70 flex justify-end gap-1 ${
                            isMe ? "text-green-50" : "text-gray-400 dark:text-gray-500"
                          }`}>
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
                  <FiMessageCircle className="w-20 h-20 mb-4 opacity-20" />
                  <p className="text-lg font-bold opacity-50">Send your first message</p>
                </div>
              )}
              <div ref={scrollRef}></div>
            </div>

            {/* Message Input Container */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 relative z-20 sticky bottom-0 transition-colors">
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700" ref={emojiPickerRef}>
                  <EmojiPicker onEmojiClick={onEmojiClick} height={400} width={300} searchDisabled theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'} />
                </div>
              )}
              
              <form onSubmit={handleSendMessage} className="flex gap-3 items-center max-w-5xl mx-auto">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all border shrink-0 outline-none ${
                    showEmojiPicker ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-500 border-green-200 dark:border-green-800" 
                    : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <FiSmile className="w-6 h-6" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-800 focus:border-green-300 dark:focus:border-green-700 outline-none transition-all pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Type your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 shrink-0 outline-none ${
                    message.trim() ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" : "bg-gray-300 dark:bg-gray-700 text-white dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-gray-800 h-full transition-colors">
             <div className="w-28 h-28 bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-inner border dark:border-green-800/50">
                <FiMessageCircle className="w-14 h-14" />
             </div>
             <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Select a Chat</h2>
             <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-sm mx-auto leading-relaxed text-lg">
               Choose a member from the sidebar to start coordinating.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;