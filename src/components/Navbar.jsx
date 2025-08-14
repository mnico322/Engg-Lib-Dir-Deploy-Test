import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    logout();
    navigate('/');
  };

  const hoverClass = `
    border-b-2 border-transparent
    hover:border-white
    hover:bg-white
    hover:text-[#ff8400]
    transition-colors duration-200
    px-2 py-1 rounded
  `;

  return (
    <nav className="bg-[#ff8400] text-white px-4 py-3 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Site Title */}
        <div className="text-xl font-semibold tracking-wide select-none">
          Digital Institutional Repository
        </div>

        {/* Center: Navigation Links */}
        <div className="space-x-4 flex items-center">
          <Link to="/" className={hoverClass}>
            Home
          </Link>

          {userData?.role === 'librarian' && (
            <>
              <Link to="/records" className={hoverClass}>
                Records
              </Link>
              <Link to="/trash" className={hoverClass}>
                Trash
              </Link>
            </>
          )}

          {userData?.role === 'admin' && (
            <>
              <Link to="/admin" className={hoverClass}>
                Admin Dashboard
              </Link>
              <Link to="/logs" className={hoverClass}>
                Logs
              </Link>
            </>
          )}
        </div>

        {/* Right: Auth Controls */}
        <div className="space-x-4 flex items-center relative">
          {currentUser ? (
            <>
              {/* Username clickable + tooltip */}
              <div
                className="relative hidden sm:inline-block"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Link
                  to="/profile"
                  className="text-sm hover:underline flex items-center gap-1"
                >
                  👤 {userData?.displayName || currentUser.email}
                </Link>

                {showTooltip && (
                  <div className="absolute top-[110%] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 shadow">
                    View Profile
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className={`bg-white text-[#ff8400] px-3 py-1 rounded text-sm ${hoverClass}`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={hoverClass}>
                Login
              </Link>
              <Link to="/register" className={hoverClass}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
