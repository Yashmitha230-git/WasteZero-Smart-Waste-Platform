<<<<<<< HEAD
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </>
  );
}

export default Layout;
=======
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">

      {/* 🔹 Top Navbar */}
      <Navbar />

      {/* 🔹 Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <Sidebar />
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
>>>>>>> 5e988b0
