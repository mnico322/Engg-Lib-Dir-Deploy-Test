// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // 🔹 CHANGED: renamed 'user' to 'userData' to match AddRecord.jsx
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/me",
        { withCredentials: true }
      );
      setUserData(res.data?.user || null);
    } catch (err) {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password },
      { withCredentials: true }
    );

    const loggedInUser = res.data?.user;
    if (!loggedInUser) throw new Error("Invalid login response");

    setUserData(loggedInUser); 
    return loggedInUser;
  };

  const register = async (displayName, email, password) => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      { displayName, email, password },
      { withCredentials: true }
    );
    return res.data; 
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUserData(null); 
    }
  };

const value = {
    userData,        // Used by your components
    user: userData,  // ✅ Added this to fix the PrivateRoute 'undefined' issue
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!userData,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* ✅ This guard is vital; it prevents routes from checking auth before the API responds */}
      {!loading ? children : <div className="p-6">Loading Session...</div>}
    </AuthContext.Provider>
  );
}