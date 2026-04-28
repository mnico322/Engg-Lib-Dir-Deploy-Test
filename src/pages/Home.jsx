import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, userData, currentUser } = useAuth();
  const loggedInUser = user || userData || currentUser; 

  const navigate = useNavigate();
  
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");

  useEffect(() => {
    const fetchPublicRecords = async () => {
      try {
        // SECURITY: The backend route is now secured. It will only return
        // records the user is authorized to see based on their session/role.
        const res = await axios.get("http://localhost:5000/api/records", { withCredentials: true });
        
        // No more manual filtering here! The server only sends authorized data.
        setRecords(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchPublicRecords();
  }, []);

  const filteredRecords = records.filter((rec) => {
    const term = searchTerm.toLowerCase();
    if (!term) return false; 
    
    const valueToSearch = rec[searchCategory] || "";
    return valueToSearch.toString().toLowerCase().includes(term);
  });

  const handleView = (rec) => {
    navigate(`/records/${rec.id}`, { state: { record: rec } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Digital Institutional Repository
          </h1>
          <p className="text-gray-600">Access and search public institutional records.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="border p-3 rounded-lg bg-gray-50 font-medium focus:ring-2 focus:ring-[#ff8400] outline-none"
            >
              <option value="title">Title</option>
              <option value="accession_no">Accession #</option>
              <option value="keywords">Keywords</option>
              <option value="content_type">Type</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchCategory.replace('_', ' ')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-3 rounded-lg flex-grow shadow-sm focus:ring-2 focus:ring-[#ff8400] outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {searchTerm && filteredRecords.length > 0 ? (
            filteredRecords.map((rec) => (
              <div 
                key={rec.id} 
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center border-l-4 border-[#ff8400] gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-gray-800 break-words line-clamp-2">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    Accession: {rec.accession_no} | Type: {rec.content_type}
                  </p>
                </div>

                <button 
                  onClick={() => handleView(rec)}
                  className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-md text-sm transition shrink-0 whitespace-nowrap"
                >
                  View Record
                </button>
              </div>
            ))
          ) : searchTerm ? (
            <p className="text-center text-gray-400 mt-10">No public records match your search.</p>
          ) : (
            <div className="text-center mt-10">
              {!loggedInUser && (
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-lg">
                  <p className="text-orange-800 mb-4 font-medium">Are you an Administrator or Librarian?</p>
                  <Link to="/login" className="bg-[#ff8400] text-white px-6 py-2 rounded font-semibold hover:bg-[#e67700]">
                    Login to Manage Records
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}