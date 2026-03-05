// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ allowedRoles }) {
  const { user, loading } = useAuth(); // Now 'user' exists because of the AuthContext fix above

  if (loading) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If the user is a 'librarian' trying to access an 'admin' route
    const redirectPath = user.role === "librarian" ? "/records" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />; 
}