<<<<<<< HEAD
import "../auth.css";
import { useState, useEffect } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 5e988b0
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

<<<<<<< HEAD
  // 🔒 Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "ngo") navigate("/ngo");
      else navigate("/volunteer");
    }
=======
  // 🔒 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) return;

    const user = JSON.parse(storedUser);

    if (user?.role === "admin") navigate("/admin");
    else if (user?.role === "ngo") navigate("/ngo");
    else navigate("/volunteer");
>>>>>>> 5e988b0
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
<<<<<<< HEAD
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
=======
      const response = await loginUser(formData);
      const userId = response.userId;

      localStorage.setItem("otpUserId", userId);
      localStorage.setItem("otpType", "login");

      setSuccess("OTP sent. Redirecting...");

      setTimeout(() => {
        navigate("/verify-register-otp");
>>>>>>> 5e988b0
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 bg-green-600 text-white p-12 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">♻ WasteZero</h1>
        <h2 className="text-2xl font-semibold mb-4">
          Welcome Back!
        </h2>
        <p className="mb-8 text-green-100">
          Log in to schedule pickups, manage recycling opportunities,
          and continue making a positive impact on our environment.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Manage Pickups</h4>
            <small className="text-green-200">
              Track and schedule waste collection
            </small>
          </div>
          <div>
            <h4 className="font-semibold">Monitor Impact</h4>
            <small className="text-green-200">
              See your environmental contributions
            </small>
          </div>
          <div>
            <h4 className="font-semibold">Stay Connected</h4>
            <small className="text-green-200">
              Collaborate with NGOs and volunteers
            </small>
>>>>>>> 5e988b0
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
<<<<<<< HEAD
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
=======
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button className="flex-1 py-2 border-b-2 border-green-600 font-semibold text-green-600">
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex-1 py-2 text-gray-500 hover:text-green-600"
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
          <p className="text-gray-500 mb-6">
            Enter your credentials to continue
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

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            >
>>>>>>> 5e988b0
              Login
            </button>

          </form>
        </div>
      </div>
<<<<<<< HEAD

=======
>>>>>>> 5e988b0
    </div>
  );
}

<<<<<<< HEAD
export default Login;

=======
export default Login;
>>>>>>> 5e988b0
