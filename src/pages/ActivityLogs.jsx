// src/pages/ActivityLogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/logs", {
        withCredentials: true
      });
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching logs:", err);
      toast.error("Failed to load activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // ✅ FIXED: CSV Export now uses correct database columns
  const exportToCSV = () => {
    if (logs.length === 0) return toast.error("No logs to export");

    const headers = ["Timestamp", "Action", "User", "Description"];
    const rows = logs.map(log => [
      log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A",
      log.action,
      log.user || "System",
      `"${(log.description || "").replace(/"/g, '""')}"` 
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `Activity_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-6 text-gray-600">Loading logs...</div>;

  // ✅ FIXED: Filtering logic now checks 'user' and 'description'
  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      (log.user || "").toLowerCase().includes(term) ||
      (log.action || "").toLowerCase().includes(term) ||
      (log.description || "").toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold text-black">Activity Logs</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition flex items-center gap-2 whitespace-nowrap"
          >
            📥 Export CSV
          </button>
          <input
            type="text"
            placeholder="Search by user, action, or details..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded w-full sm:w-64 focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log, idx) => (
                <tr key={log.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-sm text-gray-700">
                      {log.timestamp ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {new Date(log.timestamp).toLocaleDateString('en-PH', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString('en-PH', {
                              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                            })}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-orange-600">{log.action}</td>
                  <td className="px-4 py-3 font-medium">{log.user || "System"}</td>
                  <td className="px-4 py-3 text-gray-600 italic">{log.description || "No details provided"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-6 text-gray-500">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredLogs.length > 0 && (
        <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >Prev</button>
            <span className="py-1 text-sm">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >Next</button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <label>Rows per page:</label>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="border rounded p-1"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}