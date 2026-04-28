import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = "https://engg-lib-dir-deploy-test.onrender.com";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // SECURITY: Asking the server "Who am I?" based on my cookie.
      const res = await axios.get(
        `${API_URL}/api/auth/me`,
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
      `${API_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    const loggedInUser = res.data?.user;
    setUserData(loggedInUser); 
    return loggedInUser;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    } finally {
      setUserData(null); 
    }
  };

  const value = {
    userData,
    user: userData,
    login,
    logout,
    loading,
    isAuthenticated: !!userData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="p-6">Verifying Session...</div>}
    </AuthContext.Provider>
  );
}