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
  // New State for Advanced Search
  const [searchField, setSearchField] = useState("all"); 

  const role = user?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

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
    if (!details) return;
    const recordTitle = details.title || "Untitled Record";
    try {
      await axios.post("http://localhost:5000/api/logs", {
        action: action.toUpperCase(),
        title: recordTitle,
        user: user?.displayName || "Nico",
        role: user?.role || "Guest",
        description: `${action} record: ${recordTitle}`
      }, { withCredentials: true });
    } catch (error) {
      console.error("Log failed:", error);
    }
  };

  const handleView = async (rec) => {
    await logAction("view", rec);
    navigate(`/records/${rec.id}`, { state: { record: rec } });
  };

  const handleAddRecord = () => {
    navigate("/records/add");
  };

  const handleDelete = async (id) => {
    const recordToDelete = records.find((r) => r.id === id);
    if (!recordToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/records/${id}`, {
        withCredentials: true,
        data: { 
          user: user?.displayName || "Nico", 
          role: user?.role || "Librarian" 
        }
      });

      await logAction("delete", recordToDelete);
      toast.success(`Record moved to trash.`);
      setConfirmDelete(null);
      fetchRecords(); 
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete record.");
    }
  };

  const handleDownload = async (rec) => {
  if (!rec.filePath) {
    toast.error("No file attached.");
    return;
  }

  try {
    // 1. Construct the absolute URL (flip backslashes for the browser)
    const fileUrl = `http://localhost:5000/${rec.filePath.replace(/\\/g, '/')}`;
    
    // 2. Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = fileUrl;
    
    // 3. Set the download attribute (optional, but helps with naming)
    const fileName = rec.filePath.split(/[\\/]/).pop();
    link.setAttribute("download", fileName);
    
    document.body.appendChild(link);
    link.click();
    link.remove();

    // 4. Log the action as usual
    await logAction("download", rec);
  } catch (err) {
    console.error("Failed to download file:", err);
    toast.error("Failed to download file.");
  }
};

  // UPDATED: Global and Advanced Search Logic
  const filteredRecords = records.filter((rec) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    if (searchField === "all") {
      // Global Search: searches all object values
      return Object.values(rec).some(val => 
        String(val).toLowerCase().includes(term)
      );
    } else {
      // Advanced Search: searches only the selected field
      return String(rec[searchField] || "").toLowerCase().includes(term);
    }
  });

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
          <h1 className="text-xl font-bold">Records</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
            Total: {filteredRecords.length}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* New Advanced Search Select Dropdown */}
          <select 
            value={searchField}
            onChange={(e) => { setSearchField(e.target.value); setCurrentPage(1); }}
            className="border p-2 rounded text-sm bg-white"
          >
            <option value="all">All</option>
            <option value="title">Title</option>
            <option value="accessionNo">Accession No.</option>
            <option value="boxNumber">Box Number</option>
            <option value="publisher">Publisher</option>
            <option value="placeOfPublication">Place of Publication</option>
            <option value="keywords">Keywords</option>
            <option value="abstract">Abstract</option>
          </select>

          <input
            type="text"
            placeholder={searchField === "all" ? "Search records..." : `Search by ${searchField}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded flex-grow min-w-[200px]"
          />
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

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        {paginatedRecords.length === 0 ? (
          <p className="text-gray-500">No records found.</p>
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
                  <th className="p-3 text-left border-b border-gray-300">Date of Publication</th>
                  <th className="p-3 text-left border-b border-gray-300">Date Encoded</th>
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
                    <td className="p-3 border-b border-gray-200">{rec.dateOfPublication || "-"}</td>
                    <td className="p-3 border-b border-gray-200">
                        {rec.dateEncoded ? new Date(rec.dateEncoded).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center space-x-2">
                        <div className="flex items-center justify-center gap-2">
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
                <span className="ml-2 italic">Showing {paginatedRecords.length} of {filteredRecords.length} records</span>
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

      {confirmDelete && canEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to move the record <strong>{confirmDelete.title || "this untitled record"}</strong> to trash?
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