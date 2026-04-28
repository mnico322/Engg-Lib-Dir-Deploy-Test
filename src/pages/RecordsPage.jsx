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
  const [searchCategory, setSearchCategory] = useState("title");
  
  const [jumpPage, setJumpPage] = useState("1");

  useEffect(() => {
    setJumpPage(currentPage.toString());
  }, [currentPage]);

  if (loading) return <p className="p-6 text-center">Loading authentication...</p>;

  const role = user?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/records", { withCredentials: true });
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch records:", err);
      toast.error("Failed to fetch records.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleView = (rec) => {
    navigate(`/records/${rec.id}`, { state: { record: rec } });
  };

  const handleDownload = async (rec) => {
    if (!rec.file_path) {
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
      link.setAttribute("download", rec.title || "document");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download file.");
    }
  }

  const moveToTrash = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/records/${id}`, {
        data: { userEmail: user?.email, userRole: user?.role },
        withCredentials: true
      });
      toast.success("Moved to trash!");
      setConfirmDelete(null); 
      fetchRecords();
    } catch (err) {
      toast.error("Failed to move to trash.");
    }
  };

  const filteredRecords = records.filter((rec) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    const val = rec[searchCategory] || "";
    return val.toString().toLowerCase().includes(term);
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleJumpPage = (e) => {
    if (e.key === "Enter") {
      const val = parseInt(jumpPage);
      if (!isNaN(val) && val >= 1 && val <= totalPages) {
        setCurrentPage(val);
      } else {
        toast.error(`Please enter a page between 1 and ${totalPages}`);
        setJumpPage(currentPage.toString());
      }
    }
  };

  return (
    <div className="p-6">
      {/* CSS to remove number arrows */}
      <style>{`
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>

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
            <option value="description_content">Description/Content</option>
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
            <button onClick={() => navigate("/records/add")} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
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
                  <th className="p-3 text-left border-b border-gray-300">Box #</th>
                  <th className="p-3 text-left border-b border-gray-300">Accession #</th>
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
                    <td className="p-3 border-b border-gray-200 font-mono text-xs text-blue-700">{rec.accession_no || "-"}</td>
                    <td className="p-3 border-b border-gray-200 font-medium max-w-xs truncate">{rec.title || "-"}</td>
                    <td className="p-3 border-b border-gray-200">{rec.content_type || "-"}</td>
                    <td className="p-3 border-b border-gray-200 max-w-xs text-xs">
                       {rec.keywords || "-"}
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center space-x-2 whitespace-nowrap">
                      <button onClick={() => handleView(rec)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs">View</button>
                      {rec.file_path && <button onClick={() => handleDownload(rec)} className="bg-green-500 text-white px-3 py-1 rounded text-xs">Download</button>}
                      {canEdit && <button onClick={() => setConfirmDelete(rec)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Trash</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION WITH NO-SPINNER INPUT */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md disabled:opacity-40 hover:bg-gray-200 transition"
                >
                  Prev
                </button>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <span>Page</span>
                  <input
                    type="number"
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    onKeyDown={handleJumpPage}
                    className="no-spinner w-12 text-center border border-gray-300 rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    min="1"
                    max={totalPages}
                  />
                  <span>of {totalPages}</span>
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md disabled:opacity-40 hover:bg-gray-200 transition"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 italic">Press Enter to jump</span>
                <select 
                  className="border p-1.5 rounded-md text-sm bg-gray-50 focus:outline-none" 
                  value={pageSize} 
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                >
                  {[10, 50, 100].map((size) => (
                    <option key={size} value={size}>{size} rows</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Move to Trash?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to trash <strong>{confirmDelete.title}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="bg-gray-100 px-4 py-2 rounded">Cancel</button>
              <button onClick={() => moveToTrash(confirmDelete.id)} className="bg-red-600 text-white px-4 py-2 rounded">Move to Trash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}