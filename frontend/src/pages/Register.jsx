import React, { useState, useEffect } from "react";
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

  // 🔒 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const user = JSON.parse(storedUser);

      if (user?.role === "admin") navigate("/dashboard");
      else if (user?.role === "ngo") navigate("/dashboard");
      else navigate("/dashboard");
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

      const response = await registerUser(dataToSend);
      const userId = response.userId;

      localStorage.setItem("otpUserId", userId);
      localStorage.setItem("otpType", "register");

      setSuccess("OTP sent to your email. Redirecting...");

      setTimeout(() => {
        navigate("/verify-register-otp");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 bg-green-600 text-white p-12 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">♻ WasteZero</h1>
        <h2 className="text-2xl font-semibold mb-4">
          Join the Recycling Revolution
        </h2>
        <p className="mb-8 text-green-100">
          WasteZero connects volunteers, NGOs, and administrators to schedule
          pickups, manage recycling opportunities, and make a positive impact
          on our environment.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Schedule Pickups</h4>
            <small className="text-green-200">
              Easily arrange waste collection
            </small>
          </div>
          <div>
            <h4 className="font-semibold">Track Impact</h4>
            <small className="text-green-200">
              Monitor environmental contribution
            </small>
          </div>
          <div>
            <h4 className="font-semibold">Volunteer</h4>
            <small className="text-green-200">
              Join recycling initiatives
            </small>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 py-2 text-gray-500 hover:text-green-600"
            >
              Login
            </button>
            <button className="flex-1 py-2 border-b-2 border-green-600 font-semibold text-green-600">
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">Create a new account</h2>
          <p className="text-gray-500 mb-6">
            Fill in your details to join WasteZero
          </p>

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}
          {success && (
            <p className="bg-green-100 text-green-600 p-2 rounded mb-4 text-sm">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              Create Account
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
