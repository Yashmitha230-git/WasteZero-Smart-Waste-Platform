import "../auth.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  verifyRegisterOtp,
  verifyLoginOtp
} from "../services/authService";

function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { userId, type } = location.state || {};

  // 🔒 If user directly opens /otp without state
  useEffect(() => {
    if (!userId || !type) {
      navigate("/");
    }
  }, [userId, type, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
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

    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
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

    </div>
  );
}

export default OtpVerification;
