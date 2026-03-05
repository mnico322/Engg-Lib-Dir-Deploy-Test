// src/pages/RecordDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fieldConfig } from "../config/fieldConfig";
import toast from "react-hot-toast";

export default function RecordDetails({ records = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, currentUser } = useAuth();

  const [record, setRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    // Simulate fetching record from local "records" prop
    const rec = records.find((r) => r.id === id);
    if (rec) {
      setRecord({
        ...rec,
        dateCreated: rec.dateCreated
          ? new Date(rec.dateCreated).toISOString().split("T")[0]
          : "",
      });
    }
  }, [id, records]);

  if (!record) return <div className="p-6 text-gray-600">Loading...</div>;

  const role = userData?.role || "guest";
  const isEditable = role === "librarian" || role === "admin";

  // Save changes (simulate update)
  const handleUpdate = () => {
    // In local mode, we just show a toast
    toast.success("Record updated successfully (simulated).");
    setEditMode(false);
  };

  // Move record to trash (simulate delete)
  const handleDelete = () => {
    toast.success("Record moved to trash (simulated).");
    setShowConfirmModal(false);
    navigate("/records");
  };

  // Handle input change
  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  // Dropdown options
  const communityOptions = Object.keys(fieldConfig);
  const collectionOptions = record.community
    ? Object.keys(fieldConfig[record.community]?.collections || {})
    : [];
  const subCollectionOptions =
    record.community && record.collection
      ? Object.keys(
          fieldConfig[record.community]?.collections[record.collection]
            ?.subCollections || {}
        )
      : [];
  const subSubCollectionOptions =
    record.community && record.collection && record.subCollection
      ? Object.keys(
          fieldConfig[record.community]?.collections[record.collection]
            ?.subCollections[record.subCollection]?.subSubCollections || {}
        )
      : [];

  // Dynamic fields
  const currentFields = (() => {
    if (record.subSubCollection) {
      return (
        fieldConfig[record.community]?.collections[record.collection]
          ?.subCollections[record.subCollection]?.subSubCollections[
          record.subSubCollection
        ] || []
      );
    }
    if (record.subCollection) {
      return (
        fieldConfig[record.community]?.collections[record.collection]
          ?.subCollections[record.subCollection] || []
      );
    }
    if (record.collection) {
      return fieldConfig[record.community]?.collections[record.collection] || [];
    }
    return [];
  })();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <Link to="/records" className="text-blue-600 hover:underline">
          ← Back to Records
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-[#000000]">Record Details</h2>

      {/* Path Section */}
      <div className="mb-6 space-y-3">
        <div>
          <span className="font-semibold">Community: </span>
          {record.community || "—"}
        </div>
        {record.collection && (
          <div>
            <span className="font-semibold">Collection: </span>
            {record.collection || "—"}
          </div>
        )}
        {record.subCollection && (
          <div>
            <span className="font-semibold">Sub-Collection: </span>
            {record.subCollection || "—"}
          </div>
        )}
        {record.subSubCollection && (
          <div>
            <span className="font-semibold">Sub-Sub-Collection: </span>
            {record.subSubCollection || "—"}
          </div>
        )}
      </div>

      {/* Dynamic Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {currentFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {editMode && isEditable ? (
              field.type === "select" ? (
                <select
                  name={field.name}
                  value={record[field.name] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={record[field.name] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={record[field.name] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              )
            ) : (
              <div className="text-gray-800 bg-gray-100 px-3 py-2 rounded">
                {record[field.name] || "—"}
              </div>
            )}
          </div>
        ))}

        {/* File field */}
        {record.fileUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attached File
            </label>
            <a
              href={record.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View / Download File
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      {isEditable && (
        <div className="flex justify-between items-center">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#ff8400] text-white px-4 py-2 rounded hover:brightness-110"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          )}

          <button
            onClick={() => setShowConfirmModal(true)}
            className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to move this record to trash?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
