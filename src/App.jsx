import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext"; // 🔥 Import useAuth

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ActivityLogs from "./pages/ActivityLogs";
import RecordsPage from "./pages/RecordsPage";
import TrashedRecords from "./pages/TrashedRecords";
import Logout from "./pages/Logout";
import RecordDetails from "./pages/RecordDetails";
import ProfileSettings from "./pages/ProfileSettings";
import AddRecord from "./pages/AddRecord";
import Dashboard from "./pages/Dashboard";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";



export default function App() {
  const { userData, loading } = useAuth(); // 🔥 Destructure userData to check auth status

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8400]"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Archive System...</p>
        </div>
      </div>
    );
  }

  // Helper to determine where to send a logged-in user
  const getRedirectPath = (role) => {
    if (role === "admin") return "/admin";
    if (role === "librarian") return "/records";
    return "/dashboard";
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* ✅ Public routes with "Logged-in" check */}
            <Route path="/" element={<Home />} />
            
            <Route 
              path="/login" 
              element={!userData ? <Login /> : <Navigate to={getRedirectPath(userData.role)} replace />} 
            />
            
            <Route 
              path="/register" 
              element={!userData ? <Register /> : <Navigate to="/dashboard" replace />} 
            />
            
            <Route path="/logout" element={<Logout />} />

            {/* Profile Settings: any logged-in user */}
            <Route element={<PrivateRoute allowedRoles={["admin", "librarian", "guest"]} />}>
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Records routes */}
            <Route element={<PrivateRoute allowedRoles={["librarian", "guest", "admin"]} />}>
              <Route path="/records" element={<RecordsPage />} />
              <Route path="/records/:id" element={<RecordDetails />} />
              <Route path="/records/add" element={<AddRecord />} />
            </Route>

            {/* Trash (librarian only) */}
            <Route element={<PrivateRoute allowedRoles={["librarian", "admin"]} />}>
              <Route path="/trash" element={<TrashedRecords />} />
            </Route>

            {/* Admin routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/logs" element={<ActivityLogs />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}