<<<<<<< HEAD
import "../auth.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  verifyRegisterOtp,
  verifyLoginOtp
} from "../services/authService";
=======
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyRegisterOtp, verifyLoginOtp } from "../services/authService";
>>>>>>> 5e988b0

function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();

  const { userId, type } = location.state || {};

  // 🔒 If user directly opens /otp without state
=======

  const userId = localStorage.getItem("otpUserId");
  const type = localStorage.getItem("otpType");

>>>>>>> 5e988b0
  useEffect(() => {
    if (!userId || !type) {
      navigate("/");
    }
  }, [userId, type, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

=======
>>>>>>> 5e988b0
    setError("");
    setSuccess("");

    try {
<<<<<<< HEAD
      // ================= REGISTER OTP =================
      if (type === "register") {
        await verifyRegisterOtp({ userId, otp });

        setSuccess("Account verified successfully! Redirecting to login...");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }

      // ================= LOGIN OTP =================
      if (type === "login") {
        const data = await verifyLoginOtp({ userId, otp });

        // Save token + user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          if (data.user.role === "admin") navigate("/admin");
          else if (data.user.role === "ngo") navigate("/ngo");
          else navigate("/volunteer");
        }, 1000);
      }

=======
      if (type === "register") {
        await verifyRegisterOtp({ userId, otp });

        localStorage.removeItem("otpUserId");
        localStorage.removeItem("otpType");

        setSuccess("Account verified! Redirecting to login...");

        setTimeout(() => navigate("/"), 1500);
      }

      if (type === "login") {
        const data = await verifyLoginOtp({ userId, otp });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        localStorage.removeItem("otpUserId");
        localStorage.removeItem("otpType");

        setSuccess("Login successful!");

        setTimeout(() => {
          if (data.user.role === "admin") navigate("/dashboard");
          else if (data.user.role === "ngo") navigate("/opportunities");
          else navigate("/opportunities");
        }, 1000);
      }
>>>>>>> 5e988b0
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth-page">

      {/* LEFT SECTION */}
      <div className="auth-left">
        <h1>♻ WasteZero</h1>
        <h2>Verify Your Account</h2>
        <p>
          Enter the 6-digit OTP sent to your email to continue.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="auth-right">
        <div className="auth-card">

          <h2>OTP Verification</h2>
          <small>Please check your email</small>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleVerify}>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />

            <button type="submit" className="submit-btn">
              Verify OTP
            </button>

          </form>

        </div>
      </div>

=======
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          OTP Verification
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg sm:text-xl"
            required
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200"
          >
            Verify OTP
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          Didn't receive OTP? Check your email or try again.
        </p>
      </div>
>>>>>>> 5e988b0
    </div>
  );
}

<<<<<<< HEAD
export default OtpVerification;
=======
export default OtpVerification;
>>>>>>> 5e988b0
