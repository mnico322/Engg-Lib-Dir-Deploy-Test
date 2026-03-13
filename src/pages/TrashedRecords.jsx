// src/pages/TrashedRecords.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function TrashedRecords() {
  const [records, setRecords] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null); // {type: "restore"|"delete", record}
  const { userData } = useAuth();
  const role = userData?.role || "guest";

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");


const fetchRecords = async () => {
  try {
    // Point to the new /trashed endpoint
    const res = await axios.get("http://localhost:5000/api/records/trashed", { 
      withCredentials: true 
    });
    
    // The backend now returns only trashed items
    setRecords(res.data?.records || []);
  } catch (err) {
    console.error("Error fetching trashed records:", err);
    toast.error("Failed to load trashed records.");
  }
};

  useEffect(() => {
    fetchRecords();
  }, []);

  // Restore record (sets status back to active)
  const handleRestore = async (rec) => {
    try {
      await axios.put(`http://localhost:5000/api/records/${rec.id}`, 
        { status: "active" }, 
        { withCredentials: true }
      );
      
      toast.success("Record restored successfully.");
      setConfirmAction(null);
      fetchRecords();
    } catch (err) {
      console.error("Error restoring record:", err);
      toast.error("Failed to restore record.");
    }
  };

  // Permanently delete record (Physical delete from DB)
  const handleDelete = async (rec) => {
    try {
      // NOTE: Ensure your backend has a route for permanent deletion
      // If your standard DELETE route just trashes it, you might need a different endpoint
      await axios.delete(`http://localhost:5000/api/records/${rec.id}/permanent`, { withCredentials: true });

      toast.success("Record permanently deleted.");
      setConfirmAction(null);
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
      toast.error("Failed to permanently delete.");
    }
  };

  // Pagination helpers
  const filteredRecords = records.filter((rec) =>
    (rec.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Trash Bin</h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search trashed items..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border-2 border-gray-200 p-2 rounded-lg focus:border-blue-500 outline-none w-full sm:w-64"
          />
        </div>
      </div>

      {/* Records list */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        {paginatedRecords.length === 0 ? (
          <div className="p-10 text-center text-gray-400 italic">
            No records in the trash.
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Date Trashed</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-red-50/30 transition">
                    <td className="p-4 font-semibold text-gray-700">{rec.title || "Untitled"}</td>
                    <td className="p-4 text-gray-500 text-xs">{rec.community} / {rec.collection}</td>
                    <td className="p-4 text-gray-500">
                      {rec.updated_at ? new Date(rec.updated_at).toLocaleDateString() : "Unknown"}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => setConfirmAction({ type: "restore", record: rec })}
                        className="text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-md text-xs font-bold border border-emerald-200 transition"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: "delete", record: rec })}
                        className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-xs font-bold border border-red-200 transition"
                      >
                        DELETE PERMENENTLY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <span className="text-gray-500 text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl ${confirmAction.type === 'restore' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {confirmAction.type === 'restore' ? '↺' : '🗑️'}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {confirmAction.type === "restore" ? "Restore Record?" : "Permanent Delete?"}
            </h3>
            <p className="text-gray-500 text-sm mb-8">
                {confirmAction.type === "restore" 
                  ? "This record will be visible again in the main library." 
                  : "This action cannot be undone. All metadata and files will be lost."}
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