import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {user && (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          {user.role === "admin" && <h3>Admin Control Panel</h3>}
          {user.role === "ngo" && <h3>NGO Management Panel</h3>}
          {user.role === "volunteer" && <h3>Volunteer Dashboard</h3>}
        </>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
