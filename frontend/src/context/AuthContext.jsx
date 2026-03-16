import React, { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      
      if (storedToken && storedUser) {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            // Token is still valid, load stored user object (has role field)
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setToken(storedToken);
            setRefreshToken(storedRefreshToken);
          } else if (storedRefreshToken) {
            // Token expired, try refresh
            try {
              const response = await axios.post(
                `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/token/refresh/`,
                { refresh: storedRefreshToken }
              );
              const { access } = response.data;
              localStorage.setItem("token", access);
              setToken(access);
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setRefreshToken(storedRefreshToken);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              logout();
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error("Invalid token:", error);
          logout();
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const loadUserFromStorage = useCallback(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(userData);
        return userData;
      } catch (error) {
        console.error("Error loading user from storage:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
    return null;
  }, []);

  const register = useCallback(async (credentials) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/register/`,
        credentials
      );

      const { user, access, refresh } = response.data;
      
      // Store tokens and user
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(access);
      setRefreshToken(refresh);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Registration failed",
      };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/login/`,
        { email, password }
      );

      const { user, access, refresh } = response.data;

      // Store tokens and user
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(access);
      setRefreshToken(refresh);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/token/refresh/`,
        { refresh: refreshToken }
      );

      const { access } = response.data;
      localStorage.setItem("token", access);
      setToken(access);

      return access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  }, [refreshToken]);

  const updateProfile = useCallback(async (data) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/users/me/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Profile update failed",
      };
    }
  }, [token]);

  const value = {
    user,
    token,
    refreshToken,
    loading,
    register,
    login,
    logout,
    refreshAccessToken,
    updateProfile,
    loadUserFromStorage,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
