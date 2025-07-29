import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Home() {
  const { currentUser, userData } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to the Records Management System</h1>

      {currentUser ? (
        <div>
          <p>You are logged in as: <strong>{userData?.role}</strong></p>

          <ul>
            <li><Link to="/records">📁 Records Module</Link></li>

            {userData?.role === 'admin' && (
              <>
                <li><Link to="/admin">🛠 Admin Dashboard</Link></li>
                <li><Link to="/logs">📋 Activity Logs</Link></li>
              </>
            )}

            {userData?.role === 'librarian' && (
              <li><Link to="/trash">🗑️ Trashed Records</Link></li>
            )}

            <li><Link to="/logout">🔓 Logout</Link></li>
          </ul>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <Link to="/login">Login</Link> or <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
}
