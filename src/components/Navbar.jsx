// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Site Title or Logo */}
        <Link to="/" className="text-xl font-semibold tracking-wide hover:underline">
          Records System
        </Link>

        {/* Center: Navigation Links */}
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>

          {userData?.role === 'librarian' && (
            <>
              <Link to="/records" className="hover:underline">Records</Link>
              <Link to="/trash" className="hover:underline">Trash</Link>
            </>
          )}

          {userData?.role === 'admin' && (
            <>
              <Link to="/admin" className="hover:underline">Admin</Link>
              <Link to="/logs" className="hover:underline">Logs</Link>
            </>
          )}
        </div>

        {/* Right: Auth Controls */}
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <span className="text-sm hidden sm:inline">
                👤 {userData?.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
