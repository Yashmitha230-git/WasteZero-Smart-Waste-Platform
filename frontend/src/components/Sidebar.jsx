import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiSearch, 
  FiCalendar, 
  FiPlusSquare, 
  FiMail, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiShield,
  FiActivity,
  FiAlertCircle
} from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role || "volunteer";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard", roles: ["volunteer", "ngo", "admin"] },
    { name: "Opportunities", icon: <FiSearch />, path: "/opportunities", roles: ["volunteer", "ngo", "admin"] },
    { name: "Schedule Pickup", icon: <FiCalendar />, path: "/schedule", roles: ["volunteer", "admin"] },
    { name: "Create Opportunity", icon: <FiPlusSquare />, path: "/create-opportunity", roles: ["ngo", "admin"] },
    { name: "Messages", icon: <FiMail />, path: "/messages", roles: ["volunteer", "ngo", "admin"] },
    { name: "My Profile", icon: <FiUser />, path: "/my-profile", roles: ["volunteer", "ngo", "admin"] },
  ];

  const adminItems = [
    { name: "User Management", icon: <FiUser />, path: "/admin/users" },
    { name: "Moderation", icon: <FiShield />, path: "/admin/moderation" },
    { name: "System Reports", icon: <FiActivity />, path: "/admin/reports" },
  ];

  const renderLink = (item) => (
    <Link
      key={item.path}
      to={item.path}
      className={`flex items-center space-x-3 px-6 py-4 transition-all duration-300 group
        ${location.pathname === item.path 
          ? "bg-green-600/10 dark:bg-green-900/10 text-green-600 dark:text-green-400 border-r-4 border-green-600" 
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"}
      `}
    >
      <span className={`text-xl transition-transform group-hover:scale-110 ${location.pathname === item.path ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-600 group-hover:text-green-600 dark:group-hover:text-green-400"}`}>
        {item.icon}
      </span>
      <span className="font-semibold text-sm tracking-wide uppercase">{item.name}</span>
    </Link>
  );

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col border-r border-gray-100 dark:border-gray-800 transition-colors duration-300">
      {/* Branding */}
      <div className="p-8 hidden md:block border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2 text-green-600">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">W</div>
          <span className="text-xl font-black uppercase text-gray-900 dark:text-white">WasteZero</span>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Main Menu</div>
        {navItems.filter(item => item.roles.includes(role)).map(renderLink)}

        {role === "admin" && (
          <div className="mt-8">
            <div className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2">Administration</div>
            {adminItems.map(renderLink)}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
