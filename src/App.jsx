import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext"; 

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountAdministration from "./pages/AccountAdministration";
import ActivityLogs from "./pages/ActivityLogs";
import RecordsPage from "./pages/RecordsPage";
import TrashedRecords from "./pages/TrashedRecords";
import Logout from "./pages/Logout";
import RecordDetails from "./pages/RecordDetails";
import ProfileSettings from "./pages/ProfileSettings";
import AddRecord from "./pages/AddRecord";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EditRecord from "./pages/EditRecord";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  const { userData, loading } = useAuth();

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

  // ✅ Fixed: Redirects to a valid route instead of a non-existent "/admin"
  const getRedirectPath = (role) => {
    if (role === "admin") return "/admindashboard"; 
    if (role === "librarian") return "/records"; // You could also point this to "/librariandashboard"
    return "/dashboard";
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* ✅ Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/records/:id" element={<RecordDetails />} />
            
            <Route 
              path="/login" 
              element={!userData ? <Login /> : <Navigate to={getRedirectPath(userData.role)} replace />} 
            />
            
            <Route 
              path="/register" 
              element={!userData ? <Register /> : <Navigate to="/dashboard" replace />} 
            />
            
            <Route path="/logout" element={<Logout />} />

            {/* ✅ Shared Routes: Admin, Librarian, Guest */}
            <Route element={<PrivateRoute allowedRoles={["admin", "librarian", "guest"]} />}>
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/librariandashboard" element={<LibrarianDashboard />} />
              <Route path="/admindashboard" element={<AdminDashboard />} />
              
              {/* Records Management */}
              <Route path="/records" element={<RecordsPage />} />
              <Route path="/records/add" element={<AddRecord />} />
              <Route path="/records/edit/:id" element={<EditRecord />} />
            </Route>

            {/* ✅ Elevated Routes: Admin and Librarian ONLY */}
            <Route element={<PrivateRoute allowedRoles={["admin", "librarian"]} />}>
              <Route path="/trash" element={<TrashedRecords />} />
            </Route>

            {/* ✅ Exclusive Routes: Admin ONLY */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admincontrols" element={<AccountAdministration />} />
              <Route path="/logs" element={<ActivityLogs />} />
            </Route>

            {/* ✅ Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}