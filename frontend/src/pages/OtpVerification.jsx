import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyRegisterOtp, verifyLoginOtp } from "../services/authService";

function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem("otpUserId");
  const type = localStorage.getItem("otpType");

  useEffect(() => {
    if (!userId || !type) {
      navigate("/");
    }
  }, [userId, type, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
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
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            disabled={loading}
            className={`font-semibold py-3 rounded-lg shadow-md transition-colors duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          Didn't receive OTP? Check your email or try again.
        </p>
      </div>
    </div>
  );
}

export default OtpVerification;