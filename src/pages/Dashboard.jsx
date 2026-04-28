import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = "https://engg-lib-dir-deploy-test.onrender.com";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ totalRecords: 0, totalUsers: 0, totalTrash: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const role = user?.role?.toLowerCase() || "guest";
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const recordsRes = await axios.get(`${API_URL}/api/records`, { withCredentials: true });
        const recordsData = Array.isArray(recordsRes.data) ? recordsRes.data : (recordsRes.data.records || []);
        setRecords(recordsData.filter(r => r.status !== "trashed"));

        if (isAdmin) {
          const statsRes = await axios.get(`${API_URL}/api/admin/stats`, { withCredentials: true });
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchDashboardData();
  }, [authLoading, isAdmin]);

  const globalRecent = [...records]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const myRecent = records
    .filter(r => String(r.user_id) === String(user?.id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/records?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (authLoading || loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.displayName || "User"}</h1>
          
          {/* Conditionally hide search bar for Admin */}
          {!isAdmin && (
            <form onSubmit={handleQuickSearch} className="relative">
              <input
                type="text"
                placeholder="Quick search by title or author..."
                className="w-full pl-6 pr-32 py-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-orange-500 text-white px-6 rounded-xl font-bold hover:bg-orange-600 transition">
                Search
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Admin Only Stats Section */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Records" value={stats.totalRecords} color="text-blue-600" />
          <StatCard title="System Users" value={stats.totalUsers} color="text-green-600" />
          <StatCard title="Items in Trash" value={stats.totalTrash} color="text-red-600" />
        </div>
      )}

      {/* Feed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-sm">MY RECENT UPLOADS</h2>
            <Link to="/records" className="text-xs font-bold text-orange-600 hover:underline">VIEW ALL</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {myRecent.length > 0 ? myRecent.map(rec => (
              <RecordRow key={rec.id} record={rec} navigate={navigate} />
            )) : (
              <p className="p-10 text-center text-gray-400 text-sm">No uploads detected.</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-sm">LATEST ARCHIVE ADDITIONS</h2>
            <Link to="/records" className="text-xs font-bold text-blue-600 hover:underline">VIEW ALL</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {globalRecent.length > 0 ? globalRecent.map(rec => (
              <RecordRow key={rec.id} record={rec} navigate={navigate} />
            )) : (
              <p className="p-10 text-center text-gray-400 text-sm">No recent records.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function RecordRow({ record, navigate }) {
  return (
    <div 
      onClick={() => navigate(`/records/${record.id}`)}
      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
    >
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-orange-600">{record.title}</h3>
        <p className="text-[10px] text-gray-400 uppercase font-bold">{record.author || "System"}</p>
      </div>
      <div className="ml-4 text-right">
        <span className="text-[10px] font-bold text-gray-300">
          {new Date(record.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}