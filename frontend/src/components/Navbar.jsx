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
