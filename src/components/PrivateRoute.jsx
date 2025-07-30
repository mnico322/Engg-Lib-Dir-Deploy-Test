// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function PrivateRoute({ children, roleRequired }) {
  const { currentUser, userData } = useAuth();

  if (!currentUser || !userData) {
    // Still loading or not authenticated
    return <Navigate to="/login" />;
  }

  if (roleRequired && userData.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  if (!userData) return <p>Loading...</p>;
  
  return children;
}
