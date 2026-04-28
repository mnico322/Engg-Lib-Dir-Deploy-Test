import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function LibrarianDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/records", { withCredentials: true });
        const data = Array.isArray(res.data) ? res.data : (res.data.records || []);
        // Filter out trashed items before processing
        setRecords(data.filter(r => r.status !== "trashed"));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally { setLoading(false); }
    };
    if (!authLoading) fetchRecords();
  }, [authLoading]);

  // Logic for the 5 Most Recent Uploads (Specific to logged-in user)
  const myRecent = records
    .filter(r => r.encoded_by === user?.email)
    .sort((a, b) => new Date(b.date_encoded) - new Date(a.date_encoded))
    .slice(0, 5);

  // Logic for the 5 Latest Archive Additions (Global)
  const globalRecent = [...records]
    .sort((a, b) => new Date(b.date_encoded) - new Date(a.date_encoded))
    .slice(0, 5);

  if (authLoading || loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      
      {/* Compact Welcome Header */}
      <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">
            Welcome, <span className="text-[#ff8400]">{user?.displayName || "Librarian"}</span>
          </h1>
        </div>
        <Link 
          to="/records/add" 
          className="bg-[#ff8400] text-white px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 transition"
        >
          + New Record
        </Link>
      </div>

      {/* Feed Sections with Increased Box Size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardFeed 
          title="My Recent Uploads" 
          items={myRecent} 
          navigate={navigate} 
          emptyMessage="You haven't uploaded any records yet."
        />
        <DashboardFeed 
          title="Latest Archive Additions" 
          items={globalRecent} 
          navigate={navigate} 
          emptyMessage="The archive is currently empty."
        />
      </div>
    </div>
  );
}

function DashboardFeed({ title, items, navigate, emptyMessage }) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-tight">{title}</h2>
        <Link to="/records" className="text-xs font-bold text-[#ff8400] hover:underline">VIEW ALL</Link>
      </div>
      
      {/* Increased height/padding for the list container */}
      <div className="divide-y divide-gray-50 min-h-[400px]"> 
        {items.length > 0 ? items.map(rec => (
          <div 
            key={rec.id} 
            onClick={() => navigate(`/records/${rec.id}`)} 
            className="p-6 hover:bg-orange-50/30 cursor-pointer flex justify-between items-center group transition-all duration-200"
          >
            <div className="flex-grow min-w-0">
              <h3 className="text-base font-semibold text-gray-800 truncate group-hover:text-[#ff8400]">
                {rec.title}
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                {rec.publisher || "No Author"}
              </p>
            </div>
            <div className="ml-4 text-right flex flex-col items-end">
              <span className="text-xs font-bold text-gray-300">
                {new Date(rec.date_encoded).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-[10px] text-[#ff8400] opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase mt-1">
                View Details →
              </span>
            </div>
          </div>
        )) : (
          <div className="flex-grow flex items-center justify-center p-12">
            <p className="text-gray-400 text-sm italic">{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}