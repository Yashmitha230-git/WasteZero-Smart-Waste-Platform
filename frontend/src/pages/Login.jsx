import "../auth.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔒 Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "ngo") navigate("/ngo");
      else navigate("/volunteer");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      // 🔹 Call backend → sends OTP
      const data = await loginUser(formData);

      console.log("Login response:", data);

      setSuccess("OTP sent to your email. Redirecting...");

      // 🔹 Redirect to OTP page
      setTimeout(() => {
        navigate("/otp", {
          state: {
            userId: data.userId,
            type: "login"
          }
        });
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SECTION */}
      <div className="auth-left">
        <h1>♻ WasteZero</h1>
        <h2>Join the Recycling Revolution</h2>
        <p>
          WasteZero connects volunteers, NGOs, and administrators to schedule
          pickups, manage recycling opportunities, and make a positive impact
          on our environment.
        </p>

        <div className="features">
          <div>
            <h4>Schedule Pickups</h4>
            <small>Easily arrange waste collection</small>
          </div>
          <div>
            <h4>Track Impact</h4>
            <small>Monitor environmental contribution</small>
          </div>
          <div>
            <h4>Volunteer</h4>
            <small>Join recycling initiatives</small>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-tabs">
            <button className="active">Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </div>

          <h2>Welcome back</h2>
          <small>Login to continue to WasteZero</small>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="submit-btn">
              Login
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default Login;

