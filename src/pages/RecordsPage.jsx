import React, { useState, useEffect } from "react";
import { fieldConfig } from "../config/fieldConfig";
import { db } from "../firebase"; // adjust path
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Cascading dropdown state
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedSubCollection, setSelectedSubCollection] = useState("");
  const [selectedSubSubCollection, setSelectedSubSubCollection] = useState("");

  // Dynamic form state
  const [formData, setFormData] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch records from Firebase
  const fetchRecords = async () => {
    const querySnapshot = await getDocs(collection(db, "records"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Get available dropdown options
  const communityOptions = Object.keys(fieldConfig);
  const collectionOptions = selectedCommunity ? Object.keys(fieldConfig[selectedCommunity].collections) : [];
  const subCollectionOptions =
    selectedCommunity && selectedCollection && fieldConfig[selectedCommunity].collections[selectedCollection].subCollections
      ? Object.keys(fieldConfig[selectedCommunity].collections[selectedCollection].subCollections)
      : [];
  const subSubCollectionOptions =
    selectedCommunity &&
    selectedCollection &&
    selectedSubCollection &&
    fieldConfig[selectedCommunity].collections[selectedCollection].subCollections[selectedSubCollection]?.subSubCollections
      ? Object.keys(fieldConfig[selectedCommunity].collections[selectedCollection].subCollections[selectedSubCollection].subSubCollections)
      : [];

  // Get fields for current selection
  const currentFields = (() => {
    if (selectedSubSubCollection) {
      return fieldConfig[selectedCommunity]
        ?.collections[selectedCollection]
        ?.subCollections[selectedSubCollection]
        ?.subSubCollections[selectedSubSubCollection] || [];
    }
    if (selectedSubCollection) {
      return fieldConfig[selectedCommunity]
        ?.collections[selectedCollection]
        ?.subCollections[selectedSubCollection] || [];
    }
    if (selectedCollection) {
      return fieldConfig[selectedCommunity]?.collections[selectedCollection] || [];
    }
    return [];
  })();

  // Helpers
  const formatKey = (key) => {
    // Convert camelCase or PascalCase to words with spaces, capitalize first letter
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, " ");
  };

  // Handle input change for form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open modal for adding new record
  const openAddModal = () => {
    setEditRecord(null);
    setFormData({});
    setSelectedCommunity("");
    setSelectedCollection("");
    setSelectedSubCollection("");
    setSelectedSubSubCollection("");
    setIsModalOpen(true);
  };

  // Open modal for editing record, prefill form and selections
  const openEditModal = (rec) => {
    setEditRecord(rec);
    setFormData({ ...rec });

    // Set cascading dropdown selections from record if available
    setSelectedCommunity(rec.community || "");
    setSelectedCollection(rec.collection || "");
    setSelectedSubCollection(rec.subCollection || "");
    setSelectedSubSubCollection(rec.subSubCollection || "");
    setIsModalOpen(true);
  };

  // Close Add/Edit modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditRecord(null);
    setFormData({});
    setSelectedCommunity("");
    setSelectedCollection("");
    setSelectedSubCollection("");
    setSelectedSubSubCollection("");
  };

  // Submit add or edit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSave = {
      community: selectedCommunity,
      collection: selectedCollection,
      subCollection: selectedSubCollection,
      subSubCollection: selectedSubSubCollection,
      ...formData
    };

    try {
      if (editRecord) {
        // Update existing
        const docRef = doc(db, "records", editRecord.id);
        await updateDoc(docRef, dataToSave);
      } else {
        // Add new
        await addDoc(collection(db, "records"), dataToSave);
      }
      closeModal();
      fetchRecords();
    } catch (err) {
      console.error("Error saving record:", err);
      alert("Failed to save record.");
    }
  };

  // Delete a record
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "records", id));
      setConfirmDelete(null);
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record.");
    }
  };

  // Handle View button click
  const handleView = (rec) => {
    setViewRecord(rec);
  };

  // Close view modal
  const closeViewModal = () => {
    setViewRecord(null);
  };

  // Pagination helpers
  const filteredRecords = records.filter(rec =>
    (rec.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded flex-grow"
          />

          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded whitespace-nowrap"
            onClick={openAddModal}
          >
            Add Record
          </button>
        </div>
      </div>

      {/* Records list */}
      <div className="bg-white shadow rounded p-4">
        {paginatedRecords.length === 0 ? (
          <p className="text-gray-500">No records found.</p>
        ) : (
          <>
            <table className="w-full border table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Access Code</th>
                  <th className="p-2 border">Location Code</th>
                  <th className="p-2 border">Author</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Date Encoded</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((rec) => (
                  <tr key={rec.id}>
                    <td className="p-2 border">{rec.accessCode || "-"}</td>
                    <td className="p-2 border">{rec.locationCode || "-"}</td>
                    <td className="p-2 border">{rec.creator || rec.author || rec.creatorAuthor || "-"}</td>
                    <td className="p-2 border">{rec.title || "-"}</td>
                    <td className="p-2 border">{rec.dateEncoded ? new Date(rec.dateEncoded).toLocaleDateString() : "-"}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleView(rec)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(rec)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(rec)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
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
                <label htmlFor="pageSize" className="font-medium">Rows per page:</label>
                <select
                  id="pageSize"
                  className="border p-1 rounded"
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[10, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4 overflow-auto">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">{editRecord ? "Edit Record" : "Add Record"}</h2>

            {/* Step-by-step dropdowns */}
            <div className="space-y-3 mb-4">
              {/* Community */}
              <select
                className="border p-2 rounded w-full"
                value={selectedCommunity}
                onChange={(e) => {
                  setSelectedCommunity(e.target.value);
                  setSelectedCollection("");
                  setSelectedSubCollection("");
                  setSelectedSubSubCollection("");
                }}
              >
                <option value="">Select Community</option>
                {communityOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Collection */}
              {collectionOptions.length > 0 && (
                <select
                  className="border p-2 rounded w-full"
                  value={selectedCollection}
                  onChange={(e) => {
                    setSelectedCollection(e.target.value);
                    setSelectedSubCollection("");
                    setSelectedSubSubCollection("");
                  }}
                >
                  <option value="">Select Collection</option>
                  {collectionOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}

              {/* Sub-collection */}
              {subCollectionOptions.length > 0 && (
                <select
                  className="border p-2 rounded w-full"
                  value={selectedSubCollection}
                  onChange={(e) => {
                    setSelectedSubCollection(e.target.value);
                    setSelectedSubSubCollection("");
                  }}
                >
                  <option value="">Select Sub-Collection</option>
                  {subCollectionOptions.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
              )}

              {/* Sub-sub-collection */}
              {subSubCollectionOptions.length > 0 && (
                <select
                  className="border p-2 rounded w-full"
                  value={selectedSubSubCollection}
                  onChange={(e) => setSelectedSubSubCollection(e.target.value)}
                >
                  <option value="">Select Sub-Sub-Collection</option>
                  {subSubCollectionOptions.map(ssc => <option key={ssc} value={ssc}>{ssc}</option>)}
                </select>
              )}
            </div>

            {/* Dynamic fields */}
            {currentFields.length > 0 && (
              <form onSubmit={handleSubmit} className="space-y-3 max-h-96 overflow-y-auto">
                {currentFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        className="border p-2 rounded w-full"
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                      />
                    ) : field.type === "select" ? (
                      <select
                        name={field.name}
                        className="border p-2 rounded w-full"
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select...</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        className="border p-2 rounded w-full"
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View Record Modal */}
      {viewRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4 overflow-auto">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Record Details</h2>
            <button
              className="mb-4 bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
              onClick={closeViewModal}
            >
              Close
            </button>

            <div className="space-y-2">
              {Object.entries(viewRecord).map(([key, value]) => {
                if (key === "id") return null; // skip id
                if (value === undefined || value === null || value === "") return null;
                // Format date fields
                const displayValue = key.toLowerCase().includes("date") && value
                  ? new Date(value).toLocaleDateString()
                  : value.toString();
                return (
                  <div key={key} className="flex gap-4">
                    <div className="font-semibold capitalize w-48">{formatKey(key)}</div>
                    <div>{displayValue}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the record titled <strong>{confirmDelete.title || "(no title)"}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
