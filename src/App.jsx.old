// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ActivityLogs from './pages/ActivityLogs';
import RecordsPage from './pages/RecordsPage';
import TrashedRecords from './pages/TrashedRecords';
import Logout from './pages/Logout';
import RecordDetails from './pages/RecordDetails';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/records/:id" element={<RecordDetails />} /> {/* Public View */}

        {/* Librarian routes */}
        <Route
          path="/records"
          element={
            <PrivateRoute roleRequired="librarian">
              <RecordsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <PrivateRoute roleRequired="librarian">
              <TrashedRecords />
            </PrivateRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <PrivateRoute roleRequired="admin">
              <ActivityLogs />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
