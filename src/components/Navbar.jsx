import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { currentUser, userData } = useAuth();

  return (
    <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>🏠 Home</Link>

      {currentUser && userData && (
        <>
          {userData.role === 'admin' && (
            <>
              <Link to="/admin" style={{ marginRight: '10px' }}>🛠 Admin Dashboard</Link>
              <Link to="/logs" style={{ marginRight: '10px' }}>📋 Activity Logs</Link>
            </>
          )}

          {userData.role === 'librarian' && (
            <>
              <Link to="/records" style={{ marginRight: '10px' }}>📁 Records</Link>
              <Link to="/trash" style={{ marginRight: '10px' }}>🗑️ Trash</Link>
            </>
          )}

          {/* Show logged-in user email */}
          <span style={{ marginRight: '10px', fontStyle: 'italic' }}>
            👤 {currentUser.email}
          </span>

          <Link to="/logout" style={{ color: 'red' }}>🚪 Logout</Link>
        </>
      )}

      {!currentUser && (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
