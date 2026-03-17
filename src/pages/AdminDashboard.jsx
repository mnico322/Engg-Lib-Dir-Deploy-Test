import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ totalRecords: 0, totalUsers: 0, totalTrash: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", { withCredentials: true });
        setStats(res.data);
      } catch (err) { console.error("Stats error:", err); }
    };
    if (!authLoading && user?.role === 'admin') fetchStats();
  }, [authLoading, user]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Records" value={stats.totalRecords} />
        <StatCard title="Items in Trash" value={stats.totalUsers} />
      </div>
      <h1 className="text-2xl font-bold">User Count</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalTrash} />
      </div>
      {/* You can add server status or recent logs summary here */}
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <p className="text-gray-500 text-xs font-bold uppercase mb-1">{title}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}