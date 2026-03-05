// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        navigate("/login");
      }
    };

    doLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-lg">Logging out…</p>
    </div>
  );
}
