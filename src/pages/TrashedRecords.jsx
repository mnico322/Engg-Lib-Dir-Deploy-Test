// src/pages/TrashedRecords.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function TrashedRecords() {
  const [records, setRecords] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null); // {type: "restore"|"delete", record}
  const { userData, loading } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const role = userData?.role || "guest";

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/records/trashed", { 
        withCredentials: true 
      });
      setRecords(res.data?.records || []);
    } catch (err) {
      console.error("Error fetching trashed records:", err);
      toast.error("Failed to load trashed records.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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

  const handleDelete = async (rec) => {
    try {
      await axios.delete(`http://localhost:5000/api/records/${rec.id}/permanent`, { withCredentials: true });
      toast.success("Record permanently deleted.");
      setConfirmAction(null);
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
      toast.error("Failed to permanently delete.");
    }
  };

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

  if (loading) return <p className="p-6 text-center">Loading authentication...</p>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Trash Bin</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
            Total: {filteredRecords.length}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search trashed items..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded flex-grow"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        {paginatedRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No records found in the trash.</p>
        ) : (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#e8e8e8] text-black">
                  <th className="p-3 text-left border-b border-gray-300">Accession No.</th>
                  <th className="p-3 text-left border-b border-gray-300">Box Number</th>
                  <th className="p-3 text-left border-b border-gray-300">Title</th>
                  <th className="p-3 text-left border-b border-gray-300">Place of Publication</th>
                  <th className="p-3 text-left border-b border-gray-300">Publisher</th>
                  <th className="p-3 text-left border-b border-gray-300">Date Trashed</th>
                  <th className="p-3 text-center border-b border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((rec, idx) => (
                  <tr key={rec.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="p-3 border-b border-gray-200">{rec.accessionNo || "-"}</td>
                    <td className="p-3 border-b border-gray-200">{rec.boxNumber || "-"}</td>
                    <td className="p-3 border-b border-gray-200 font-medium">
                      {rec.title ? rec.title : <span className="text-gray-400 italic">No Title</span>}
                    </td>
                    <td className="p-3 border-b border-gray-200">{rec.placeOfPublication || "-"}</td>
                    <td className="p-3 border-b border-gray-200">{rec.publisher || "-"}</td>
                    <td className="p-3 border-b border-gray-200">
                        {rec.updated_at ? new Date(rec.updated_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <button 
                                onClick={() => setConfirmAction({ type: "restore", record: rec })} 
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors font-medium"
                            >
                                Restore
                            </button>
                            <button 
                                onClick={() => setConfirmAction({ type: "delete", record: rec })} 
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors font-medium uppercase"
                            >
                                Permanent Delete
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors text-black">Prev</button>
                <span className="mx-2 text-black">Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors text-black">Next</button>
                <span className="ml-2 italic">Showing {paginatedRecords.length} of {filteredRecords.length} trashed items</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="font-medium text-sm text-gray-700">Rows per page:</label>
                <select id="pageSize" className="border p-1 rounded text-sm" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
                  {[10, 50, 100].map((size) => (<option key={size} value={size}>{size}</option>))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
                {confirmAction.type === "restore" ? "Confirm Restore" : "Confirm Permanent Delete"}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmAction.type === "restore" 
                ? `Are you sure you want to restore "${confirmAction.record.title}" to the main records?`
                : `Warning: You are about to permanently delete "${confirmAction.record.title}". This action cannot be undone.`}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-700 font-medium transition-colors">Cancel</button>
              <button 
                onClick={() => confirmAction.type === "restore" ? handleRestore(confirmAction.record) : handleDelete(confirmAction.record)} 
                className={`${confirmAction.type === 'restore' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 rounded font-medium transition-colors shadow-sm`}
              >
                {confirmAction.type === "restore" ? "Restore" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}