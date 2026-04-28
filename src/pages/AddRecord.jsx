import React, { useState, useEffect } from "react";
import { fieldConfig } from "../config/fieldConfig"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://engg-lib-dir-deploy-test.onrender.com";

export default function AddRecord() {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); 

  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const role = user?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Please login to continue.");
        navigate("/login");
      } else if (!canEdit) {
        toast.error("You are not authorized to add records.");
        navigate("/records");
      }
    }
  }, [loading, user, canEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for required fields before processing
    if (!formData.title) return toast.error("Title is required");
    if (!formData.accession_no) return toast.error("Accession Number is required");
    
    setSaving(true);

    try {
      const payload = new FormData();

      // SECURITY UPDATE: We no longer manually append user identity fields.
      // The backend extracts 'encoded_by' and 'role' from the secure cookies.

      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      if (file) payload.append("file", file);

      await axios.post(`${API_URL}/api/records`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Record saved successfully!");
      navigate("/records");
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Error saving record");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading Session...</div>;
  if (!user || !canEdit) return null;

  const gridFields = fieldConfig.filter(f => f.type !== "textarea" && f.type !== "file" && f.name !== "title");
  const textAreaFields = fieldConfig.filter(f => f.type === "textarea");

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button 
            onClick={() => navigate("/records")}
            className="text-orange-600 hover:text-orange-700 font-bold text-sm mb-2 flex items-center gap-1 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> CANCEL & RETURN
          </button>
          <h1 className="text-3xl font-bold text-gray-800">New Archive Entry</h1>
          <p className="text-gray-500 mt-1">Fill out the metadata to index this document.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* Document Title Section */}
        <div className="p-8 pb-4 border-b border-gray-100">
          <label className="text-[12px] text-gray-400 mb-2 tracking-wider block uppercase font-bold">
            Document Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title || ""}
            onChange={handleChange}
            className="w-full text-2xl font-semibold text-gray-900 border-b-2 border-transparent focus:border-orange-500 outline-none transition-all placeholder:text-gray-200"
            placeholder="Enter the main document title..."
          />
        </div>

        {/* Metadata Grid */}
        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Archive Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {gridFields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-[12px] text-gray-400 mb-1 tracking-wider block uppercase font-semibold">
                  {field.label} {field.name === "accessionNo" && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.name === "accessionNo"}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.name === "accessionNo"} 
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder={`N/A`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-10">
          {textAreaFields.map((field) => (
            <section key={field.name}>
              <label className="text-[12px] text-gray-400 mb-2 tracking-wider block uppercase font-bold">
                {field.label}
              </label>
              <textarea
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-5 rounded-xl border-2 border-gray-50 shadow-inner focus:border-orange-200 outline-none min-h-[120px] text-gray-700 leading-relaxed transition-all"
                placeholder={`Provide the detailed ${field.label.toLowerCase()} here...`}
              />
            </section>
          ))}

          {/* File Upload Section */}
          <section className="pt-6 border-t border-gray-100">
            <label className="text-[12px] text-gray-400 mb-3 tracking-wider block uppercase font-bold">
              Digital Attachment (PDF/Image)
            </label>
            <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 hover:border-orange-300 bg-gray-50/50'}`}>
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                  {file ? '✓' : '+'}
                </div>
                <p className="font-bold text-gray-700">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-400 italic">Supports high-res documents and scans</p>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="pt-6 flex flex-col md:flex-row justify-end gap-4">
            <button
              disabled={saving}
              type="submit"
              className="w-full md:w-auto bg-orange-600 text-white px-12 py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? "Processing Archive..." : "Save Record to Library"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}