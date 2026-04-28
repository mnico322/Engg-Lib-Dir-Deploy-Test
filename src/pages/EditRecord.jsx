import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fieldConfig } from "../config/fieldConfig"; 
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function EditRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, loading: authLoading } = useAuth(); 

  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Check Permissions
  const role = userData?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  // 2. Fetch existing data
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/records/${id}`, { withCredentials: true });
        
        // Ensure accession_number maps to accessionNo so the form pre-fills correctly
        const data = res.data;
        if (data.accession_number) data.accessionNo = data.accession_number;
        
        setFormData(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not find record to edit.");
        navigate("/records");
      } finally {
        setFetching(false);
      }
    };

    if (!authLoading) {
      if (!userData) {
        toast.error("Please login to continue.");
        navigate("/login");
      } else if (!canEdit) {
        toast.error("Unauthorized.");
        navigate("/records");
      } else {
        fetchExistingData();
      }
    }
  }, [id, authLoading, userData, canEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields before sending to backend
    if (!formData.title) return toast.error("Title is required");
    if (!formData.accessionNo) return toast.error("Accession Number is required");

    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("userEmail", userData?.email);
      payload.append("userRole", userData?.role);

      // Append all fields from formData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== 'id') {
            payload.append(key, value);
        }
      });

      if (file) payload.append("file", file);

      await axios.put(`http://localhost:5000/api/records/${id}`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Record updated successfully!");
      navigate(`/records/${id}`); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || fetching) return <div className="p-10 text-center text-gray-500 font-medium">Loading Record Data...</div>;

  const gridFields = fieldConfig.filter(f => f.type !== "textarea" && f.type !== "file" && f.name !== "title");
  const textAreaFields = fieldConfig.filter(f => f.type === "textarea");

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="text-orange-600 hover:text-orange-700 font-bold text-sm mb-2 flex items-center gap-1 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> DISCARD CHANGES
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Archive Entry</h1>
        <p className="text-gray-500">Update the metadata and save to apply changes.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* Title Section */}
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
            className="w-full text-2xl font-semibold text-gray-900 border-b-2 border-orange-500 outline-none placeholder:text-gray-200"
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
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 outline-none"
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
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 outline-none"
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
              <label className="text-[12px] text-gray-400 mb-2 tracking-wider block uppercase font-bold">{field.label}</label>
              <textarea
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-5 rounded-xl border-2 border-gray-50 shadow-inner focus:border-orange-200 outline-none min-h-[120px] text-gray-700 leading-relaxed"
              />
            </section>
          ))}

          {/* File Update */}
          <section className="pt-6 border-t border-gray-100">
            <label className="text-[12px] text-gray-400 mb-3 tracking-wider block uppercase font-bold">Replace Digital Attachment (Optional)</label>
            <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-gray-50/50'}`}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="font-bold text-gray-700">{file ? file.name : "Click to replace existing file"}</p>
              {formData.file_path && !file && <p className="text-xs text-blue-500 mt-2 italic font-medium">Currently: {formData.file_path.split('/').pop()}</p>}
            </div>
          </section>

          <div className="pt-6 flex justify-end">
            <button
              disabled={saving}
              type="submit"
              className="w-full md:w-auto bg-gray-900 text-white px-12 py-4 rounded-xl font-bold shadow-lg hover:bg-black hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {saving ? "Updating Archive..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}