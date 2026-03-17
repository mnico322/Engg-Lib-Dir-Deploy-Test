import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const role = user?.role?.toLowerCase() || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  // 1. Log Action Helper (Standardized)
  const logAction = async (action, details) => {
    try {
      await axios.post("http://localhost:5000/api/logs", {
        action: action.toUpperCase(),
        resourceId: details?.recordId || null,
        resourceType: "RECORD",
        title: details?.title || "Navigation",
        description: details?.description || `${action} performed by ${user?.displayName || "Guest"}`
      }, { withCredentials: true });
    } catch (error) {
      console.error("Logging failed:", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/records", { withCredentials: true });
      const recordsArray = Array.isArray(res.data) ? res.data : (res.data.records || []);
      const activeRecords = recordsArray.filter((r) => r.status !== "trashed");
      setRecords(activeRecords);
    } catch (err) {
      toast.error("Failed to fetch records.");
    }
  };

  useEffect(() => {
    if (!loading) fetchRecords();
  }, [loading]);

  const handleView = (rec) => {
    logAction("VIEW", { recordId: rec.id, title: rec.title });
    navigate(`/records/${rec.id}`, { state: { record: rec } });
  };

  const handleAddRecord = () => {
    logAction("NAVIGATE", { title: "Add Record Page", description: "User clicked Add Record" });
    navigate("/records/add");
  };

  const handleDelete = async (id) => {
    try {
      const recordToDelete = records.find((r) => r.id === id);
      await axios.delete(`http://localhost:5000/api/records/${id}`, { withCredentials: true });
      
      toast.success(`"${recordToDelete?.title}" moved to trash.`);
      setConfirmDelete(null);
      
      // Update local state immediately
      setRecords(prev => prev.filter(r => r.id !== id));
      
      logAction("DELETE", { recordId: id, title: recordToDelete?.title });
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  // Pagination & Filtering Logic
  const filteredRecords = records.filter((rec) =>
    (rec.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <div className="p-6 text-center text-gray-500">Loading records...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header section remains the same as your code */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Archive Records</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Title..."
            className="border p-2 rounded w-full sm:w-64 focus:ring-2 focus:ring-orange-500 outline-none"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          {canEdit && (
            <button onClick={handleAddRecord} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow-sm transition-all">
              + Add Record
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-4 border-b">Access Code</th>
              <th className="p-4 border-b">Title</th>
              <th className="p-4 border-b">Author</th>
              <th className="p-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRecords.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600 font-mono">{rec.accessCode || "N/A"}</td>
                <td className="p-4 font-semibold text-gray-800">{rec.title}</td>
                <td className="p-4 text-gray-600">{rec.author || rec.creator || "Anonymous"}</td>
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => handleView(rec)} className="text-blue-600 hover:underline px-2">View</button>
                  {canEdit && (
                    <button onClick={() => setConfirmDelete(rec)} className="text-red-600 hover:underline px-2">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedRecords.length === 0 && <p className="p-10 text-center text-gray-400">No matching records found.</p>}
      </div>

      {/* Reusable Pagination Controls would go here */}
      {/* Reusable Delete Modal would go here */}
    </div>
  );
}