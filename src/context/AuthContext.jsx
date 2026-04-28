// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // Timer reference to track idle time
  const idleTimerRef = useRef(null);
  
  // 15 Minutes in milliseconds (Change this value to adjust timing)
  const IDLE_TIMEOUT = 15 * 60 * 1000; 

  const logout = async () => {
    try {
      // Clear the idle timer if it's running
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUserData(null);
      // Optional: Redirect to login or home after logout
      window.location.href = "/login";
    }
  };

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

  // --- IDLE LOGIC ---
  const resetTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    // Only set a timer if a user is actually logged in
    if (userData) {
      idleTimerRef.current = setTimeout(() => {
        console.log("User idle for too long. Logging out...");
        logout();
      }, IDLE_TIMEOUT);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // Events that count as "activity"
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];

    if (userData) {
      // Start the timer initially
      resetTimer();

      // Add listeners to reset the timer on activity
      events.forEach((event) => window.addEventListener(event, resetTimer));
    }

    return () => {
      // Cleanup listeners and timer on unmount or user change
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [userData]); // Re-run whenever the user logs in or out

  const login = async (email, password) => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password },
      { withCredentials: true }
    );
    const loggedInUser = res.data?.user;
    setUserData(loggedInUser); 
    return loggedInUser;
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