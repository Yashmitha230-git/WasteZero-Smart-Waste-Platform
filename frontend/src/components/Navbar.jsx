import { useState, useEffect } from "react";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const navigate = useNavigate();
  const { unreadCount, clearNotifications } = useNotifications();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const getRoleLabel = (role) => {
    if (role === 'admin') return { label: 'Admin Dashboard', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' };
    if (role === 'ngo') return { label: 'NGO Dashboard', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' };
    if (role === 'volunteer') return { label: 'Volunteer Dashboard', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' };
    return { label: 'Dashboard', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const roleInfo = user ? getRoleLabel(user.role) : null;

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-sm px-6 py-3 flex justify-between items-center z-50 sticky top-0 transition-colors">

      {/* Logo + Role Label */}
      <div className="flex items-center gap-4">
        <h1 
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-green-600 cursor-pointer"
        >
          WasteZero
        </h1>
        {roleInfo && (
          <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${roleInfo.bg} ${roleInfo.color} tracking-wide uppercase`}>
            {roleInfo.label}
          </span>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* Notification Bell */}
        <div 
          className="relative cursor-pointer"
          onClick={() => {
            clearNotifications();
            navigate("/messages");
          }}
        >
          <FiBell size={22} className="text-gray-600 dark:text-gray-300 hover:text-green-600 transition" />
          
          {/* Notification Dot */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-4 h-4 p-1 flex items-center justify-center rounded-full animate-bounce">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Profile Circle */}
        <div
          onClick={() => setOpen(!open)}
          className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full cursor-pointer font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          {firstLetter}
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-14 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md transition-colors">

            <button
              onClick={() => {
                navigate("/my-profile");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
            >
              My Profile
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}