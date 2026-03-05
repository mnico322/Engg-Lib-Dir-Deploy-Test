// src/pages/TrashedRecords.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function TrashedRecords() {
  const [records, setRecords] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null); // {type: "restore"|"delete", record}
  const { currentUser, userData } = useAuth();
  const role = userData?.role || "guest";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch trashed records
  const fetchRecords = async () => {
    const querySnapshot = await getDocs(collection(db, "records"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRecords(data.filter((r) => r.status === "trashed"));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Restore record
  const handleRestore = async (rec) => {
    try {
      const recordRef = doc(db, "records", rec.id);
      await updateDoc(recordRef, {
        status: "active",
        restoredAt: serverTimestamp(),
      });

      await addDoc(collection(db, "logs"), {
        action: "restore",
        recordId: rec.id,
        title: rec.title || "(no title)",
        accessCode: rec.accessCode || "-",
        locationCode: rec.locationCode || "-",
        user: userData?.displayName || currentUser?.email,
        role,
        timestamp: serverTimestamp(),
      });

      setConfirmAction(null);
      fetchRecords();
      alert("Record restored successfully.");
    } catch (err) {
      console.error("Error restoring record:", err);
      alert("Failed to restore record.");
    }
  };

  // Permanently delete record
  const handleDelete = async (rec) => {
    try {
      await deleteDoc(doc(db, "records", rec.id));

      await addDoc(collection(db, "logs"), {
        action: "delete_permanent",
        recordId: rec.id,
        title: rec.title || "(no title)",
        accessCode: rec.accessCode || "-",
        locationCode: rec.locationCode || "-",
        user: userData?.displayName || currentUser?.email,
        role,
        timestamp: serverTimestamp(),
      });

      setConfirmAction(null);
      fetchRecords();
      alert("Record permanently deleted.");
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record.");
    }
  };

  // Pagination helpers
  const filteredRecords = records.filter((rec) =>
    (rec.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredRecords.length / pageSize);
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
        <h1 className="text-xl font-bold">Trashed Records</h1>

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
        </div>
      </div>

      {/* Records list */}
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        {paginatedRecords.length === 0 ? (
          <p className="text-gray-500">No trashed records found.</p>
        ) : (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#e8e8e8] text-black">
                  <th className="p-3 text-left border-b border-gray-300">
                    Access Code
                  </th>
                  <th className="p-3 text-left border-b border-gray-300">
                    Location Code
                  </th>
                  <th className="p-3 text-left border-b border-gray-300">
                    Author
                  </th>
                  <th className="p-3 text-left border-b border-gray-300">
                    Title
                  </th>
                  <th className="p-3 text-left border-b border-gray-300">
                    Date Trashed
                  </th>
                  <th className="p-3 text-center border-b border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((rec, idx) => (
                  <tr
                    key={rec.id}
                    className={`hover:bg-gray-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3 border-b border-gray-200">
                      {rec.accessCode || "-"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {rec.locationCode || "-"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {rec.creator || rec.author || "-"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {rec.title || "-"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {rec.trashedAt?.seconds
                        ? new Date(
                            rec.trashedAt.seconds * 1000
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center space-x-2">
                      {role !== "guest" && (
                        <>
                          <button
                            onClick={() =>
                              setConfirmAction({ type: "restore", record: rec })
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() =>
                              setConfirmAction({ type: "delete", record: rec })
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Delete Permanently
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {confirmAction.type === "restore" ? "Restore" : "Delete"}
            </h3>
            <p className="mb-6">
              Are you sure you want to{" "}
              {confirmAction.type === "restore" ? "restore" : "permanently delete"}{" "}
              <strong>{confirmAction.record.title || "(no title)"}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  confirmAction.type === "restore"
                    ? handleRestore(confirmAction.record)
                    : handleDelete(confirmAction.record)
                }
                className={`${
                  confirmAction.type === "restore"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } text-white px-4 py-2 rounded`}
              >
                {confirmAction.type === "restore" ? "Restore" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
