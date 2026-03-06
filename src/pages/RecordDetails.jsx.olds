// src/pages/RecordDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { fieldConfig } from "../config/fieldConfig";
import toast from "react-hot-toast";

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [record, setRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const role = userData?.role || "guest";
  const isEditable = role === "librarian" || role === "admin";

  // ✅ Fetch record from MySQL backend
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/records/${id}`,
          { withCredentials: true }
        );

        // In MySQL backend, sometimes response is { record: {...} }
        const data = res.data?.record || res.data;

        if (!data) {
          toast.error("Record not found");
          navigate("/records");
          return;
        }

        setRecord(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load record");
        navigate("/records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  if (!record) {
    return null;
  }

  // ✅ Update record
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/records/${id}`,
        record,
        { withCredentials: true }
      );

      toast.success("Record updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update record");
    }
  };

  // ✅ Soft delete (MySQL usually uses is_deleted = 1)
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/records/${id}`,
        { withCredentials: true }
      );

      toast.success("Record moved to trash");
      navigate("/records");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  const handleChange = (e) => {
    setRecord((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Dynamic dropdowns (safe optional chaining)
  const currentFields = (() => {
    if (!record?.community) return [];

    if (record.subSubCollection) {
      return (
        fieldConfig[record.community]
          ?.collections?.[record.collection]
          ?.subCollections?.[record.subCollection]
          ?.subSubCollections?.[record.subSubCollection] || []
      );
    }

    if (record.subCollection) {
      return (
        fieldConfig[record.community]
          ?.collections?.[record.collection]
          ?.subCollections?.[record.subCollection] || []
      );
    }

    if (record.collection) {
      return (
        fieldConfig[record.community]
          ?.collections?.[record.collection] || []
      );
    }

    return [];
  })();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <Link to="/records" className="text-blue-600 hover:underline text-sm">
        ← Back to Records
      </Link>

      <h2 className="text-2xl font-bold my-6">Record Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>

            {editMode && isEditable ? (
              field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={record[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={record[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={record[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              )
            ) : (
              <div className="bg-gray-100 p-2 rounded">
                {record[field.name] || "—"}
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditable && (
        <div className="flex justify-between mt-6">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          )}

          <button
            onClick={() => setShowConfirmModal(true)}
            className="border border-red-600 text-red-600 px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <p className="mb-4">
              Are you sure you want to move this record to trash?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
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