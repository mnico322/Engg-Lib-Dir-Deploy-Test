import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();
  
  // ✅ Extract 'user' and 'loading' from AuthContext
  const { user, loading } = useAuth();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Wait for auth to load before rendering content
  if (loading) return <p className="p-6 text-center">Loading authentication...</p>;

  // 🔹 Use 'user' instead of 'userData'
  const role = user?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  // Fetch records from MySQL
  const fetchRecords = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/records",
        { withCredentials: true }
      );

      const recordsArray = Array.isArray(res.data)
        ? res.data
        : res.data.records || [];

      const data = recordsArray.filter(
        (r) => r.status !== "trashed"
      );

      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
      toast.error("Failed to fetch records.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);


const logAction = async (action, details) => {
  try {
    await axios.post("http://localhost:5000/api/logs", { /* data */ });
  } catch (error) { // <--- ADD THIS (error)
    console.error("Log failed:", error); // <--- Use 'error' here
  }
};

  // Handle actions
  const handleView = async (rec) => {
    navigate(`/records/${rec.id}`, { state: { record: rec } });
    await logAction("view", { recordId: rec.id, title: rec.title });
  };

  const handleAddRecord = () => {
    navigate("/records/add");
    logAction("navigate-add");
  };

  const handleDelete = async (id) => {
    try {
      const record = records.find((r) => r.id === id);
      await axios.put(`http://localhost:5000/api/records/${id}/trash`, {}, { withCredentials: true });

      toast.success(`Record "${record?.title || "(no title)"}" moved to trash.`);
      setConfirmDelete(null);
      fetchRecords();

      await logAction("delete", {
        recordId: id,
        title: record?.title || "(no title)",
        accessCode: record?.accessCode || "-",
        locationCode: record?.locationCode || "-",
      });
    } catch (err) {
      console.error("Error deleting record:", err);
      toast.error("Failed to move record to trash.");
    }
  };

  const handleDownload = async (rec) => {
    if (!rec.filePath) {
      toast.error("No file attached.");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/records/${rec.id}/file`, { responseType: "blob", withCredentials: true });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", rec.fileName || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();

      await logAction("download", { recordId: rec.id, title: rec.title });
    } catch (err) {
      console.error("Failed to download file:", err);
      toast.error("Failed to download file.");
    }
  };

  // Pagination
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
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-xl font-bold">Records</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded flex-grow"
          />
          {/* ✅ This button will now show correctly for admin/librarian */}
          {canEdit && (
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded whitespace-nowrap transition-colors"
              onClick={handleAddRecord}
            >
              Add Record
            </button>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        {paginatedRecords.length === 0 ? (
          <p className="text-gray-500">No records found.</p>
        ) : (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#e8e8e8] text-black">
                  <th className="p-3 text-left border-b border-gray-300">Access Code</th>
                  <th className="p-3 text-left border-b border-gray-300">Location Code</th>
                  <th className="p-3 text-left border-b border-gray-300">Author</th>
                  <th className="p-3 text-left border-b border-gray-300">Title</th>
                  <th className="p-3 text-left border-b border-gray-300">Date Encoded</th>
                  <th className="p-3 text-center border-b border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((rec, idx) => (
                  <tr key={rec.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="p-3 border-b border-gray-200">{rec.accessCode || "-"}</td>
                    <td className="p-3 border-b border-gray-200">{rec.locationCode || "-"}</td>
                    <td className="p-3 border-b border-gray-200">{rec.creator || rec.author || "-"}</td>
                    <td className="p-3 border-b border-gray-200 font-medium">{rec.title || "-"}</td>
                    <td className="p-3 border-b border-gray-200">{rec.dateEncoded ? new Date(rec.dateEncoded).toLocaleDateString() : "-"}</td>
                    <td className="p-3 border-b border-gray-200 text-center space-x-2">
                      <button onClick={() => handleView(rec)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors">View</button>
                      {rec.filePath && (
                        <button onClick={() => handleDownload(rec)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors">
                          Download
                        </button>
                      )}
                      {canEdit && (
                        <button onClick={() => setConfirmDelete(rec)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
              <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors">Prev</button>
                <span className="mx-2">Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors">Next</button>
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

      {/* Delete Modal */}
      {confirmDelete && canEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to move the record <strong>{confirmDelete.title || "(no title)"}</strong> to trash?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-700 font-medium transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors shadow-sm">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}