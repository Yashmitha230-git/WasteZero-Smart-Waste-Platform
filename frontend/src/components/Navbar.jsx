<<<<<<< HEAD
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  const user = JSON.parse(storedUser);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <h3 style={{ margin: 0 }}>WasteZero</h3>

      <div>
        <span style={{ marginRight: "20px" }}>
          {user.username} ({user.role})
        </span>

        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#222",
    color: "#fff"
  },
  button: {
    padding: "6px 12px",
    cursor: "pointer"
  }
};

export default Navbar;
=======
import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center">

      {/* Logo / App Name */}
      <h1 
        onClick={() => navigate("/dashboard")}
        className="text-xl font-bold text-green-600 cursor-pointer"
      >
        WasteZero
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">

        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <FiBell size={22} className="text-gray-600 hover:text-green-600 transition" />
          
          {/* Notification Dot */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* Profile Circle */}
        <div
          onClick={() => setOpen(!open)}
          className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full cursor-pointer font-semibold text-lg"
        >
          {firstLetter}
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-14 w-40 bg-white border rounded-lg shadow-md">

            <button
              onClick={() => {
                navigate("/my-profile");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              My Profile
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> 5e988b0
