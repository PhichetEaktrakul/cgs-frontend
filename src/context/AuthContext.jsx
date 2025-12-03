import {createContext, useContext, useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router";
import { apiAdmin } from "../api/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

//----------------------------------------------------------------------------------------
// Authentication Context For Admin
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [admin, setAdmin] = useState(localStorage.getItem("admin") || null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Admin(user) login
  const login = async (username, password) => {
    try {
      const res = await axios.post(`${apiUrl}/user/login`, {
        username,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);

      setAdmin(username);
      localStorage.setItem("admin", username);

      return true;
    } catch (err) {
      console.error(err.response?.data || err.message);
      return false;
    }
  };

  // Admin(user) logout
  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  // Decode Jwt Token
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      return null;
    }
  };

  // Run token expiration check on mount and periodically
  const checkTokenExpiration = useCallback(() => {
    const exp = decodeToken(token)?.exp;
    if (exp && exp < Date.now() / 1000) {      
      logout();
      toast.error("Token หมดอายุ");
      navigate("/admin/auth");
    }
  }, [token, navigate, logout]);

  // Keep apiAdmin headers in sync when token changes
  useEffect(() => {
    if (token) {
      apiAdmin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiAdmin.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Attach response interceptor once (when component mounts)
  useEffect(() => {
    const interceptor = apiAdmin.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          navigate("/admin/auth");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiAdmin.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // Call check token every 5 min
  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const value = { token, admin, login, logout, checkTokenExpiration };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
