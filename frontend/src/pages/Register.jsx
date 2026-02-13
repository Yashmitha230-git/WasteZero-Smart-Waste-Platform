import "../auth.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "volunteer"
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

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;

      // 🔹 Call backend (will send OTP)
      const response = await registerUser(dataToSend);

      setSuccess("OTP sent to your email. Redirecting to verification...");

      // 🔹 Redirect to OTP page
      setTimeout(() => {
        navigate("/otp", {
          state: {
            userId: response.userId,
            type: "register"
          }
        });
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            <button onClick={() => navigate("/")}>Login</button>
            <button className="active">Register</button>
          </div>

          <h2>Create a new account</h2>
          <small>Fill in your details to join WasteZero</small>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="volunteer">Volunteer</option>
              <option value="ngo">NGO</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="submit-btn">
              Create Account
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default Register;
