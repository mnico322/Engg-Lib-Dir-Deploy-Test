import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalRecords: 0, totalUsers: 0, totalTrash: 0 });
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    // 1. SECURITY REDIRECT: If auth is done and user is not an admin, kick them out
    if (!authLoading && user && user.role !== 'admin') {
      setIsForbidden(true);
      // Wait a tiny bit so they can see a message, then redirect
      const timer = setTimeout(() => {
        navigate("/records", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }

    // 2. FETCH STATS: Only run if user is confirmed admin
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", { withCredentials: true });
        setStats(res.data);
      } catch (err) {
        console.error("Stats error:", err);
        // If the backend returns 403, handle it here too
        if (err.response?.status === 403) {
          setIsForbidden(true);
        }
      }
    };

    if (!authLoading && user?.role === 'admin') {
      fetchStats();
    }
  }, [authLoading, user, navigate]);

  // Loading State
  if (authLoading) {
    return (
      <div className="p-6 text-gray-500 font-medium animate-pulse">
        Checking admin permissions...
      </div>
    );
  }

  // Forbidden State
  if (isForbidden) {
    return (
      <div className="p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to view this dashboard. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">System Overview</h1>
        <p className="text-sm text-gray-500">Real-time repository statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Records" 
          value={stats.totalRecords} 
          color="text-blue-600" 
        />
        <StatCard 
          title="Items in Trash" 
          value={stats.totalTrash} 
          color="text-orange-600" 
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Registered Users" 
          value={stats.totalUsers} 
          color="text-emerald-600" 
        />
      </div>

    
    </div>
  );
}

/**
 * Reusable Stat Card Component
 */
function StatCard({ title, value, color = "text-black" }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className={`text-4xl font-black ${color}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}