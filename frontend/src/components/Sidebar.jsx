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
  FiGrid
} from "react-icons/fi";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Schedule Pickup", icon: <FiCalendar />, path: "/schedule" },
    { name: "Opportunities", icon: <FiGrid />, path: "/opportunities" },
    { name: "Messages", icon: <FiMessageCircle />, path: "/messages" },
    { name: "My Impact", icon: <FiTrendingUp />, path: "/impact" },
  ];

  const settings = [
    { name: "My Profile", icon: <FiUser />, path: "/profile" },
    { name: "Settings", icon: <FiSettings />, path: "/settings" },
    { name: "Help & Support", icon: <FiHelpCircle />, path: "/help" },
  ];

  const linkStyle =
    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition";

  const activeStyle = "bg-blue-50 text-blue-600 font-medium";

  return (
    <div
      className={`h-screen border-r bg-white p-4 flex flex-col justify-between transition-all duration-300 ${
        open ? "w-75" : "w-20"
      }`}
    >
      {/* TOP */}
      <div>
        {/* Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="mb-6 text-xl text-gray-600"
        >
          <FiMenu />
        </button>

        {/* Logo */}
        <h1 className="text-xl font-bold mb-6">
          {open ? "WasteZero" : "WZ"}
        </h1>

        {/* User */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
            A
          </div>
          {open && (
            <div>
              <p className="font-semibold text-sm">Admin User</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          )}
        </div>

        {/* Main Menu */}
        <div className="mb-6">
          {open && (
            <p className="text-xs text-gray-400 mb-2">MAIN MENU</p>
          )}

          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : "text-gray-600"}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {open && item.name}
            </NavLink>
          ))}
        </div>

        {/* Settings */}
        <div>
          {open && (
            <p className="text-xs text-gray-400 mb-2">SETTINGS</p>
          )}

          {settings.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : "text-gray-600"}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {open && item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* DARK MODE */}
      <div className="flex items-center justify-between mt-6">
        {open && <span className="text-sm">Dark Mode</span>}
        <input type="checkbox" className="toggle toggle-sm" />
      </div>
    </div>
  );
};

export default Sidebar;
