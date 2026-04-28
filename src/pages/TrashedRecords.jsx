import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function TrashedRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");

  // State for the jump-to-page input
  const [jumpPage, setJumpPage] = useState("1");

  // Sync jumpPage input when currentPage changes via Prev/Next
  useEffect(() => {
    setJumpPage(currentPage.toString());
  }, [currentPage]);

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

  const handleView = (rec) => {
    navigate(`/records/${rec.id || rec._id}`, { state: { record: rec } });
  };

  const handleRestore = async (rec) => {
    const recordId = rec.id || rec._id;
    try {
      await axios.put(`http://localhost:5000/api/records/${recordId}`, 
        { 
          status: "active",
          userEmail: user?.email, 
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
          userEmail: user?.email, 
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
    <div className="p-6 max-w-7xl mx-auto">
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

            {/* Pagination Controls with Jump Input */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-100 transition text-sm font-medium"
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
                    className="no-spinner w-12 text-center border-2 border-gray-200 rounded-md p-1 focus:border-blue-500 outline-none transition"
                    min="1"
                    max={totalPages}
                  />
                  <span>of {totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-100 transition text-sm font-medium"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase hidden sm:inline">Press Enter to Jump</span>
                <select 
                  className="border-2 border-gray-200 p-1.5 rounded-lg text-sm bg-white outline-none focus:border-blue-500" 
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
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition">Cancel</button>
              <button
                onClick={() => confirmAction.type === "restore" ? handleRestore(confirmAction.record) : handleDelete(confirmAction.record)}
                className={`flex-1 py-2 rounded-xl text-white text-sm font-bold shadow-lg transition ${confirmAction.type === "restore" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : "bg-red-600 hover:bg-red-700 shadow-red-200"}`}
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