import { createContext, useState, useEffect } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check auth
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
      }
    } catch {
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  // login/register
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setAuthUser(data.user);

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${data.token}`;

        return true;
      }
      return false;
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ authUser, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
