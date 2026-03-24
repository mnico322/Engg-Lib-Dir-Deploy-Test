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

  const exportToCSV = () => {
    if (logs.length === 0) return toast.error("No logs to export");
    const headers = ["Timestamp", "Action", "User", "Details"];
    const rows = logs.map(log => [
      new Date(log.timestamp || log.created_at).toLocaleString(),
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

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      (log.user || "").toLowerCase().includes(term) ||
      (log.action || "").toLowerCase().includes(term) ||
      (log.description || "").toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  if (loading) return <div className="p-6 text-gray-600 font-medium">Loading activity logs...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            Export CSV
          </button>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg w-full sm:w-64 focus:border-orange-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-4 text-left w-[180px]">Timestamp</th>
              <th className="px-4 py-4 text-center w-[140px]">Action</th> {/* Centered header */}
              <th className="px-4 py-4 text-left w-[220px]">User</th> {/* Longer User column */}
              <th className="px-4 py-4 text-left w-auto">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log, idx) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition">
                  {/* Timestamp */}
                  <td className="px-4 py-4 align-top">
                    <div className="font-bold text-gray-900">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Action: Centered Content */}
                  <td className="px-4 py-4 align-top text-center">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                      log.action === 'DELETE' ? 'bg-red-50 text-red-600 border-red-100' :
                      log.action === 'ADD' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  {/* User: Longer Column */}
                  <td className="px-4 py-4 align-top font-medium text-gray-700 break-words">
                    {log.user || "System"}
                  </td>

                  {/* Details: Flexing Column */}
                  <td className="px-4 py-4 align-top text-gray-600 whitespace-normal break-words italic leading-relaxed">
                    {log.description || "No details provided"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-10 text-gray-400 italic">No activity logs found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border rounded shadow-sm disabled:opacity-50 text-xs font-bold"
            >Prev</button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border rounded shadow-sm disabled:opacity-50 text-xs font-bold"
            >Next</button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs">Page {currentPage} of {totalPages}</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="border rounded p-1 text-xs bg-white outline-none"
            >
              {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size} rows</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}