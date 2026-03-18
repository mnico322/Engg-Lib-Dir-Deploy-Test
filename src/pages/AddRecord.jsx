import React, { useState, useEffect } from "react";
import { fieldConfig } from "../config/fieldConfig"; // This is now your array
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AddRecord() {
  const navigate = useNavigate();
  const { userData, loading } = useAuth();

  // Form State
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const role = userData?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  // Authorization Check
  useEffect(() => {
    if (!loading) {
      if (!userData) {
        toast.error("Please login to continue.");
        navigate("/login");
      } else if (!canEdit) {
        toast.error("You are not authorized to add records.");
        navigate("/records");
      }
    }
  }, [loading, userData, canEdit, navigate]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required");
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("userName", userData?.displayName || "System User");
      payload.append("userRole", userData?.role || "Librarian");

      // Map all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (file) payload.append("file", file);

      await axios.post("http://localhost:5000/api/records", payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Record saved successfully!");
      navigate("/records");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error saving record");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Session...</div>;
  if (!userData || !canEdit) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Record</h1>
        <p className="text-gray-500">Enter the details below to archive the new entry.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldConfig.map((field) => (
            <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md h-24 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              ) : field.type === "file" ? (
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={() => navigate("/records")}
            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-600 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-orange-700 disabled:opacity-50 transition-all"
          >
            {saving ? "Saving to Archive..." : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
}