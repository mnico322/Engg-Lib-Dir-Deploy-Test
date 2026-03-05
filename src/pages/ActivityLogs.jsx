// src/pages/ActivityLogs.jsx
import React, { useEffect, useState } from "react";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const q = query(collection(db, "activityLogs"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading logs...</div>;

  // Filtering
  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      (log.user || "").toLowerCase().includes(term) ||
      (log.action || "").toLowerCase().includes(term) ||
      (log.title || "").toLowerCase().includes(term)
    );
  });

  // Pagination
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
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold text-black">Activity Logs</h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by User, Action, or Title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded w-full sm:w-64 focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Record ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Access Code</th>
              <th className="px-4 py-3 text-left">Location Code</th>
              <th className="px-4 py-3 text-left">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log, idx) => (
                <tr
                  key={log.id}
                  className={`hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    {log.timestamp?.toDate
                      ? log.timestamp.toDate().toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#ff8400]">
                    {log.action}
                  </td>
                  <td className="px-4 py-3">{log.recordId || "—"}</td>
                  <td className="px-4 py-3">{log.title || "—"}</td>
                  <td className="px-4 py-3">{log.accessCode || "—"}</td>
                  <td className="px-4 py-3">{log.locationCode || "—"}</td>
                  <td className="px-4 py-3">{log.user || "guest"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center px-4 py-6 text-gray-500">
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredLogs.length > 0 && (
        <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="mx-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="font-medium">
              Rows per page:
            </label>
            <select
              id="pageSize"
              className="border p-1 rounded"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
