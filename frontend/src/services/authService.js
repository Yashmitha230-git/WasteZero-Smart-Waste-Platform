import axios from "axios";

<<<<<<< HEAD
const API_URL = "http://localhost:5000/api/auth";

// ================= REGISTER =================
// Sends OTP to email
export const registerUser = async (registerData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    registerData
  );
  return response.data; // contains message + userId
};

// ============ VERIFY REGISTER OTP ============
export const verifyRegisterOtp = async (data) => {
  const response = await axios.post(
    `${API_URL}/verify-register-otp`,
    data
  );
  return response.data;
};


// ================= LOGIN =================
// Sends OTP after password validation
export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    loginData
  );
  return response.data; // contains message + userId
};

// ============ VERIFY LOGIN OTP ============
export const verifyLoginOtp = async (data) => {
  const response = await axios.post(
    `${API_URL}/verify-login-otp`,
    data
  );
  return response.data; // contains token + user
};
=======
const API_URL = "http://localhost:3000/api/auth";

export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const verifyRegisterOtp = async (data) => {
  const response = await axios.post(`${API_URL}/verify-register-otp`, data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

export const verifyLoginOtp = async (data) => {
  const response = await axios.post(`${API_URL}/verify-login-otp`, data);
  return response.data;
};
>>>>>>> 5e988b0
