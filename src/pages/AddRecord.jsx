import React, { useState, useEffect } from "react";
import { fieldConfig } from "../config/fieldConfig";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AddRecord() {
  const { id } = useParams(); // Catch the ID from the URL
  const navigate = useNavigate();
  const { userData, loading } = useAuth();

  const isEditMode = Boolean(id); // If ID exists, we are updating
  
  // Form State
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(isEditMode); // Loading state for fetching data

  const role = userData?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  // 1. Authorization Check
  useEffect(() => {
    if (!loading) {
      if (!userData) {
        toast.error("Please login to continue.");
        navigate("/login");
      } else if (!canEdit) {
        toast.error("You are not authorized to manage records.");
        navigate("/records");
      }
    }
  }, [loading, userData, canEdit, navigate]);

  // 2. Fetch Existing Data if in Edit Mode
  useEffect(() => {
    if (isEditMode && canEdit) {
      const fetchRecord = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/records/${id}`, {
            withCredentials: true,
          });
          // Pre-fill the form with existing data
          setFormData(res.data);
        } catch (err) {
          console.error("Error fetching record:", err);
          toast.error("Failed to load record details.");
          navigate("/records");
        } finally {
          setFetching(false);
        }
      };
      fetchRecord();
    }
  }, [id, isEditMode, canEdit, navigate]);

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
  setSaving(true);

  try {
    const payload = new FormData();
    
    // 1. Add User info for logs
    payload.append("userName", userData?.displayName || "System User");
    payload.append("userRole", userData?.role || "Librarian");

    // 2. Filter out internal database fields before sending
    // These are the likely causes of the 500 error
    const internalFields = ["id", "created_at", "updated_at", "status", "fileUrl"];

    Object.entries(formData).forEach(([key, value]) => {
      if (!internalFields.includes(key) && value !== null && value !== undefined) {
        payload.append(key, value);
      }
    });

    // 3. Add the new file if one was selected
    if (file) {
      payload.append("file", file);
    }

    // 4. Determine URL and Method
    const url = isEditMode 
      ? `http://localhost:5000/api/records/${id}` 
      : `http://localhost:5000/api/records`;
    
    const method = isEditMode ? "put" : "post";

    await axios({
      method: method,
      url: url,
      data: payload,
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(isEditMode ? "Record updated!" : "Record saved!");
    navigate("/records");
  } catch (err) {
    console.error("Save Error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Internal Server Error");
  } finally {
    setSaving(false);
  }
};

  if (loading || fetching) return <div className="p-10 text-center">Loading Data...</div>;
  if (!userData || !canEdit) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? "Edit Record" : "Add New Record"}
        </h1>
        <p className="text-gray-500">
          {isEditMode ? "Modify the entry details below." : "Enter the details below to archive the new entry."}
        </p>
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
                  value={formData[field.name] || ""} // Controlled component
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md h-24 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              ) : field.type === "file" ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {isEditMode && formData.fileUrl && !file && (
                    <p className="text-xs text-gray-400 italic">Current file exists. Upload new to replace.</p>
                  )}
                </div>
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ""} // Controlled component
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
                  value={formData[field.name] || ""} // Controlled component
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
            onClick={() => navigate(-1)} // Goes back to previous page
            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-600 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-orange-700 disabled:opacity-50 transition-all"
          >
            {saving ? "Saving..." : isEditMode ? "Update Record" : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
}