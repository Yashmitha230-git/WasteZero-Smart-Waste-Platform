import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
      {/* 🔹 Top Navbar */}
      <Navbar />

      {/* 🔹 Sidebar + Content Container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar (Desktop only or Drawer approach) */}
        <aside className="w-80 flex-shrink-0 bg-white dark:bg-gray-900 shadow-xl shadow-gray-100 dark:shadow-none z-40 transition-colors duration-300">
          <Sidebar />
        </aside>

        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 max-w-[1600px] mx-auto min-h-full"
          >
            {/* The Outlet renders the current route's page component */}
            <Outlet />
          </motion.div>
        </main>

      </div>
    </div>
  );
}
