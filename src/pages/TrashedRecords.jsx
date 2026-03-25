import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Added for View functionality
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function TrashedRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/records/trashed", { 
        withCredentials: true 
      });
      const data = res.data?.records || res.data || [];
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching trashed records:", err);
      toast.error("Failed to load trashed records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // View Handler
  const handleView = (rec) => {
    navigate(`/records/${rec.id || rec._id}`, { state: { record: rec } });
  };

  const handleRestore = async (rec) => {
    const recordId = rec.id || rec._id;
    try {
      await axios.put(`http://localhost:5000/api/records/${recordId}`, 
        { 
          status: "active",
          userEmail: user?.email, // Added user info
          userRole: user?.role 
        }, 
        { withCredentials: true }
      );
      toast.success("Record restored successfully.");
      setConfirmAction(null);
      fetchRecords();
    } catch (err) {
      toast.error("Failed to restore record.");
    }
  };

  const handleDelete = async (rec) => {
    const recordId = rec.id || rec._id;
    try {
      await axios.delete(`http://localhost:5000/api/records/${recordId}/permanent`, {
        data: { 
          userEmail: user?.email, // Added user info here
          userRole: user?.role 
        },
        withCredentials: true 
      });
      toast.success("Record permanently deleted.");
      setConfirmAction(null);
      fetchRecords();
    } catch (err) {
      toast.error("Failed to permanently delete.");
    }
  };

  const filteredRecords = records.filter((rec) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    switch (searchCategory) {
      case "accession_no":
        return (rec.accession_no || "").toLowerCase().includes(term);
      case "updated_at":
        const dateStr = rec.updated_at ? new Date(rec.updated_at).toLocaleDateString() : "";
        return dateStr.toLowerCase().includes(term);
      case "title":
      default:
        return (rec.title || rec.name || "").toLowerCase().includes(term);
    }
  });
  
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Trash Bin</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <select 
            value={searchCategory}
            onChange={(e) => { setSearchCategory(e.target.value); setCurrentPage(1); }}
            className="border-2 border-gray-200 p-2 rounded-lg bg-gray-50 text-sm font-medium focus:border-blue-500 outline-none h-[42px]"
          >
            <option value="title">Title</option>
            <option value="accession_no">Accession #</option>
            <option value="updated_at">Date Trashed</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${searchCategory.replace('_', ' ')}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border-2 border-gray-200 p-2 rounded-lg focus:border-blue-500 outline-none w-full sm:w-64 h-[42px]"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading trash...</div>
        ) : paginatedRecords.length === 0 ? (
          <div className="p-10 text-center text-gray-400 italic">No records found.</div>
        ) : (
          <>
            <table className="w-full text-sm table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-left w-auto">Title</th>
                  <th className="p-4 text-left w-[20%]">Accession No.</th>
                  <th className="p-4 text-left w-[15%]">Date Trashed</th>
                  <th className="p-4 text-center w-[240px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRecords.map((rec) => (
                  <tr key={rec.id || rec._id} className="hover:bg-red-50/30 transition">
                    <td className="p-4 font-semibold text-gray-700 whitespace-normal break-words align-top">
                      {rec.title || rec.name || "Untitled"}
                    </td>
                    
                    <td className="p-4 text-gray-500 text-xs font-mono align-top">
                      {rec.accession_no || "-"}
                    </td>
                    
                    <td className="p-4 text-gray-500 whitespace-nowrap align-top">
                      {rec.updated_at ? new Date(rec.updated_at).toLocaleDateString() : "Unknown"}
                    </td>
                    
                    <td className="p-4 text-center align-top">
                      <div className="flex justify-center gap-1.5">
                        {/* VIEW BUTTON */}
                        <button
                          onClick={() => handleView(rec)}
                          className="text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-md text-xs font-bold border border-blue-200 transition"
                        >
                          View
                        </button>
                        
                        <button
                          onClick={() => setConfirmAction({ type: "restore", record: rec })}
                          className="text-emerald-600 hover:bg-emerald-50 px-2.5 py-1.5 rounded-md text-xs font-bold border border-emerald-200 transition"
                        >
                          Restore
                        </button>
                        
                        <button
                          onClick={() => setConfirmAction({ type: "delete", record: rec })}
                          className="text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-md text-xs font-bold border border-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                >Prev</button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                >Next</button>
              </div>
              <span className="text-gray-500 text-sm">Page {currentPage} of {totalPages}</span>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-gray-100">
            <h3 className="text-xl font-bold mb-2">
              {confirmAction.type === "restore" ? "Restore Record?" : "Permanent Delete?"}
            </h3>
            <p className="text-gray-500 text-sm mb-8">
                {confirmAction.type === "restore" 
                  ? "This record will be returned to the main archives." 
                  : "Warning: This action is permanent and cannot be undone."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2 text-sm font-bold text-gray-400">Cancel</button>
              <button
                onClick={() => confirmAction.type === "restore" ? handleRestore(confirmAction.record) : handleDelete(confirmAction.record)}
                className={`flex-1 py-2 rounded-xl text-white text-sm font-bold ${confirmAction.type === "restore" ? "bg-emerald-600" : "bg-red-600"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}