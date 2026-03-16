import React, { useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import { FiBell, FiMessageCircle, FiTruck, FiGrid } from "react-icons/fi";
import { format } from "timeago.js";

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <FiMessageCircle className="text-blue-500" />;
      case "pickup_status":
        return <FiTruck className="text-green-500" />;
      case "opportunity_status":
        return <FiGrid className="text-purple-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-green-600 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FiBell />
            Notifications
          </h2>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-bold text-white bg-green-700 hover:bg-green-800 px-3 py-1.5 rounded-full transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="divide-y max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FiBell size={64} className="mx-auto mb-4 opacity-10" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markAsRead(n._id)}
                className={`flex items-start gap-4 p-5 transition cursor-pointer hover:bg-gray-50 ${
                  n.isRead ? "" : "bg-green-50/50"
                }`}
              >
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm ${n.isRead ? "text-gray-600" : "text-gray-900 font-bold"}`}>
                      {n.content}
                    </p>
                    {!n.isRead && (
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-2">
                    {format(n.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
