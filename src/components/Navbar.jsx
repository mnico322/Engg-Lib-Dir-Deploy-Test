import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth(); // ✅ reactive auth state
  const navigate = useNavigate();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout(); // context handles cookie/session removal
      navigate("/");  // redirect to home
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Function to highlight active links
  const linkClass = (path) => `
    px-2 py-1 rounded transition-colors duration-200
    ${
      location.pathname === path
        ? "font-bold text-[#ff8400]"
        : "text-black hover:text-[#ff8400]"
    }
  `;

  return (
    <nav className="bg-white border-b-2 border-[#ff8400] px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <span className="text-xl font-semibold tracking-wide text-gray-800 select-none">
            Digital Institutional Repository
          </span>
        </div>

        {/* Hamburger (Mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-black text-2xl focus:outline-none"
        >
          ☰
        </button>

        {/* Center: Navigation Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } sm:flex space-x-4 items-center absolute sm:static top-[64px] left-0 w-full sm:w-auto bg-white sm:bg-transparent sm:p-0 p-4`}
        >

          {(user?.role === "librarian" || user?.role === "guest") && (
            <Link to="/librariandashboard" className={linkClass("/librariandashboard")}>
              Dashboard
            </Link>
          )}
          {(user?.role === "admin") && (
            <Link to="/admindashboard" className={linkClass("/admindashboard")}>
              Admin Dashboard
            </Link>
          )}

          {(user?.role === "librarian" || user?.role === "guest") && (
            <Link to="/records" className={linkClass("/records")}>
              Records
            </Link>
          )}

          {user?.role === "librarian" && (
            <Link to="/trash" className={linkClass("/trash")}>
              Trash
            </Link>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admincontrols" className={linkClass("/admincontrols")}>
                Account Administration
              </Link>
              <Link to="/logs" className={linkClass("/logs")}>
                Logs
              </Link>
            </>
          )}
        </div>

        {/* Right: Auth Controls */}
        <div className="hidden sm:flex space-x-4 items-center relative">
          {user ? (
            <>
              {/* Username tooltip */}
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Link to="/profile" className={linkClass("/profile")}>
                  👤 {user?.displayName || user?.email}
                </Link>

                {showTooltip && (
                  <div className="absolute top-[110%] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 shadow">
                    View Profile
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded text-sm bg-[#ff8400] text-white hover:brightness-110"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link to="/register" className={linkClass("/register")}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
