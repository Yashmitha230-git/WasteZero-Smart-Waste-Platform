import axios from "axios";

const API_URL = "/api/auth";

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
