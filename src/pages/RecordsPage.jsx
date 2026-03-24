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

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");

  if (loading) return <p className="p-6 text-center">Loading authentication...</p>;

  const role = user?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  // Fetch records from MySQL
  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/records", { withCredentials: true });
      // The backend now returns the array directly
      setRecords(Array.isArray(res.data) ? res.data : []);
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
      await axios.post("http://localhost:5000/api/logs", {
        action: action.toUpperCase(),
        title: details.title,
        user: user?.displayName || "Nico",
        role: user?.role || "Guest",
        description: `${action} record: ${details.title}`
      }, { withCredentials: true });
    } catch (error) {
      console.error("Log failed:", error);
    }
  };

  const handleView = (rec) => {
    navigate(`/records/${rec.id}`, { state: { record: rec } });
  };

  const handleAddRecord = () => {
    navigate("/records/add");
  };

  const handleDelete = async (id) => {
    try {
      const record = records.find((r) => r.id === id);
      await axios.delete(`http://localhost:5000/api/records/${id}`, {
        withCredentials: true,
        data: { user: user?.displayName || "System", role: user?.role || "Librarian" }
      });

      toast.success(`Record "${record?.title || "Record"}" moved to trash.`);
      setConfirmDelete(null);
      fetchRecords(); 
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  const handleDownload = async (rec) => {
    if (!rec.file_path) { // 🔹 Updated to underscore match SQL
      toast.error("No file attached.");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/records/${rec.id}/file`, { 
        responseType: "blob", 
        withCredentials: true 
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      // Extract filename from path or use default
      link.setAttribute("download", rec.title || "document");
      document.body.appendChild(link);
      link.click();
      link.remove();
      await logAction("download", { title: rec.title });
    } catch (err) {
      toast.error("Failed to download file.");
    }
  };

  // Filter based on Title or Keywords
  const filteredRecords = records.filter((rec) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    switch (searchCategory) {
      case "accession_no":
        return (rec.accession_no || "").toLowerCase().includes(term);
      case "keywords":
        return (rec.keywords || "").toLowerCase().includes(term);
      case "box_number":
        return (rec.box_number || "").toLowerCase().includes(term);
      case "place_of_publication":
        return (rec.place_of_publication || "").toLowerCase().includes(term);
      case "publisher":
        return (rec.publisher || "").toLowerCase().includes(term);
      case "date_of_publication":
        return (rec.date_of_publication || "").toLowerCase().includes(term);
      case "description_content":
        return (rec.description_content || "").toLowerCase().includes(term);
      case "content_type":
        return (rec.content_type || "").toLowerCase().includes(term);
      case "paper":
        return (rec.paper || "").toLowerCase().includes(term);
        
      case "title":
      default:
        return (rec.title || "").toLowerCase().includes(term);
    }
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-xl font-bold">Archives Index</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <select 
            value={searchCategory}
            onChange={(e) => { setSearchCategory(e.target.value); setCurrentPage(1); }}
            className="border p-2 rounded bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">Title</option>
            <option value="accession_no">Accession #</option>
            <option value="keywords">Keywords</option>
            <option value="box_no">Box #</option>
            <option value="place_of_publication">Place of Publication</option>
            <option value="publisher">Publisher</option>
            <option value="date_of_publication">Date of Publication</option>
            <option value="description_conent">Description/Content</option>
            <option value="content_type">Type</option>
            <option value="paper">Paper</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchCategory.replace('_', ' ')}...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="border p-2 rounded flex-grow min-w-[300px]"
          />
          {canEdit && (
            <button onClick={handleAddRecord} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
              Add Record
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm">
        <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-blue-700 font-medium">
          Total Documents: <span className="font-bold">{records.length}</span>
        </div>
        
        {searchTerm && (
          <div className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-gray-600">
            Matching Results: <span className="font-bold">{filteredRecords.length}</span>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        {paginatedRecords.length === 0 ? (
          <p className="text-gray-500">No records found.</p>
        ) : (
          <>
            <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#e8e8e8] text-black">
            <th className="p-3 text-left border-b border-gray-300">Box #</th>
            <th className="p-3 text-left border-b border-gray-300">Accession #</th> {/* 🔹 Changed from Publisher */}
            <th className="p-3 text-left border-b border-gray-300">Title</th>
            <th className="p-3 text-left border-b border-gray-300">Type</th>
            <th className="p-3 text-left border-b border-gray-300">Keywords</th>
            <th className="p-3 text-center border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRecords.map((rec, idx) => (
            <tr key={rec.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <td className="p-3 border-b border-gray-200">{rec.box_number || "-"}</td>
              
              {/* 🔹 Display Accession Number instead of Publisher */}
              <td className="p-3 border-b border-gray-200 font-mono text-xs text-blue-700">
                {rec.accession_no || "-"}
              </td>

              <td className="p-3 border-b border-gray-200 font-medium max-w-xs truncate">
                {rec.title || "-"}
              </td>
              
              <td className="p-3 border-b border-gray-200">{rec.content_type || "-"}</td>
              
              <td className="p-3 border-b border-gray-200 max-w-xs">
                <div className="flex flex-wrap gap-1">
                  {rec.keywords ? (
                    rec.keywords.split('\n').slice(0, 2).map((word, i) => (
                      <span key={i} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100">
                        {word.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic text-xs">None</span>
                  )}
                  {rec.keywords?.split('\n').length > 2 && <span className="text-gray-400 text-xs">...</span>}
                </div>
              </td>

              <td className="p-3 border-b border-gray-200 text-center space-x-2 whitespace-nowrap">
                <button onClick={() => handleView(rec)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs">View</button>
                {rec.file_path && (
                  <button onClick={() => handleDownload(rec)} className="bg-green-500 text-white px-3 py-1 rounded text-xs">Download</button>
                )}
                {canEdit && (
                  <button onClick={() => setConfirmDelete(rec)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Trash</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
              </div>
              <select className="border p-1 rounded text-sm" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
                {[10, 50, 100].map((size) => (<option key={size} value={size}>{size} rows</option>))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Move to Trash?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to trash <strong>{confirmDelete.title}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="bg-gray-100 px-4 py-2 rounded">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="bg-red-600 text-white px-4 py-2 rounded">Move to Trash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}