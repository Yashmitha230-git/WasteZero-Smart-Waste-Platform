import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">

      {/* 🔹 Top Navbar */}
      <Navbar />

      {/* 🔹 Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 overflow-y-auto transition-colors flex flex-col min-h-0 w-full">
          <Outlet />
        </div>

      </div>
    </div>
  );
}