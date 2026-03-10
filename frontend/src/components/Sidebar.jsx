import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiMessageCircle,
  FiTrendingUp,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiGrid,
  FiShield
} from "react-icons/fi";
import { useNotifications } from "../context/NotificationContext";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { unreadCount } = useNotifications();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Schedule Pickup", icon: <FiCalendar />, path: "/schedule" },
    { name: "Opportunities", icon: <FiGrid />, path: "/opportunities" },
    { 
      name: "Messages", 
      icon: <FiMessageCircle />, 
      path: "/messages",
      badge: unreadCount > 0 ? unreadCount : null 
    },
    { name: "My Impact", icon: <FiTrendingUp />, path: "/impact" },
    ...(user?.role === "admin" ? [{ name: "Admin Panel", icon: <FiShield />, path: "/admin" }] : []),
  ];

  const settings = [
    { name: "My Profile", icon: <FiUser />, path: "/my-profile" },
    { name: "Settings", icon: <FiSettings />, path: "/settings" },
    { name: "Help & Support", icon: <FiHelpCircle />, path: "/help" },
  ];

  const linkStyle =
    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

  const activeStyle = "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium";

  return (
    <div
      className={`h-full border-r dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col justify-between transition-all duration-300 ${
        open ? "w-75" : "w-20"
      }`}
    >
      {/* TOP */}
      <div>
        {/* Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="mb-6 text-xl text-gray-600 dark:text-gray-400"
        >
          <FiMenu />
        </button>

        {/* Logo */}
        <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {open ? "WasteZero" : "WZ"}
        </h1>

        {/* Role Dashboard Badge */}
        {open && user && (() => {
          const roleMap = {
            admin: { label: 'Admin Dashboard', cls: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
            ngo: { label: 'NGO Dashboard', cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
            volunteer: { label: 'Volunteer Dashboard', cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
          };
          const r = roleMap[user.role] || { label: 'Dashboard', cls: 'bg-gray-100 text-gray-600' };
          return (
            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-6 ${r.cls}`}>
              {r.label}
            </span>
          );
        })()}

        {/* User - Only for Admin */}
{user?.role === "admin" && (
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-800 dark:text-gray-200">
      {user?.name?.charAt(0)?.toUpperCase()}
    </div>
    {open && (
      <div>
        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user?.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
      </div>
    )}
  </div>
)}

        {/* Main Menu */}
        <div className="mb-6">
          {open && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-bold tracking-wider">MAIN MENU</p>
          )}

          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : "text-gray-600 dark:text-gray-400"} relative`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {open && <span className="flex-1">{item.name}</span>}
              
              {/* Badge for collapsed or expanded */}
              {item.badge && (
                <span className={`bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm ${
                  open ? "px-1.5 py-0.5 min-w-[18px] h-[18px]" : "absolute top-1 right-1 w-4 h-4"
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Settings */}
        <div>
          {open && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-bold tracking-wider">SETTINGS</p>
          )}

          {settings.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : "text-gray-600 dark:text-gray-400"}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {open && item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
