import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fieldConfig } from "../config/fieldConfig"; 
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://engg-lib-dir-deploy-test.onrender.com";

export default function EditRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, loading: authLoading } = useAuth(); 

  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  const role = userData?.role || "guest";
  const canEdit = ["admin", "librarian"].includes(role);

  

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/records/${id}`, { withCredentials: true });
        setFormData(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Could not find record.");
        navigate("/records");
      } finally {
        setFetching(false);
      }
    };

    if (!authLoading) {
      if (!userData) navigate("/login");
      else if (!canEdit) navigate("/records");
      else fetchExistingData();
    }
  }, [id, authLoading, userData, canEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.accession_no) {
      return toast.error("Title and Accession Number are required.");
    }

    setSaving(true);
    try {
      const payload = new FormData();

      // Fields to exclude from the update request
      const forbidden = ['id', 'updated_at', 'date_encoded', 'encoded_by', 'status'];

      Object.entries(formData).forEach(([key, value]) => {
        if (!forbidden.includes(key) && value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      if (file) payload.append("file", file);

      await axios.put(`${API_URL}/api/records/${id}`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Record updated successfully!");
      navigate(`/records/${id}`); 
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(err.response?.data?.message || "Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || fetching) return <div className="p-10 text-center text-gray-500 font-medium">Loading Record...</div>;

  const gridFields = fieldConfig.filter(f => f.type !== "textarea" && f.type !== "file" && f.name !== "title");
  const textAreaFields = fieldConfig.filter(f => f.type === "textarea");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="text-orange-600 font-bold text-sm mb-2 flex items-center gap-1">
          ← DISCARD CHANGES
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Archive Entry</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8 pb-4 border-b border-gray-100">
          <label className="text-[12px] text-gray-400 mb-2 tracking-wider block uppercase font-bold">Document Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title || ""}
            onChange={handleChange}
            className="w-full text-2xl font-semibold text-gray-900 border-b-2 border-orange-500 outline-none"
          />
        </div>

        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {gridFields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-[12px] text-gray-400 mb-1 tracking-wider block uppercase font-semibold">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-10">
          {textAreaFields.map((field) => (
            <section key={field.name}>
              <label className="text-[12px] text-gray-400 mb-2 tracking-wider block uppercase font-bold">{field.label}</label>
              <textarea
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-5 rounded-xl border-2 border-gray-50 shadow-inner outline-none min-h-[120px]"
              />
            </section>
          ))}

          <section className="pt-6 border-t">
            <label className="text-[12px] text-gray-400 mb-3 tracking-wider block uppercase font-bold">Replace Digital Attachment</label>
            <div className="relative border-2 border-dashed rounded-2xl p-8 text-center bg-gray-50/50">
              <input type="file" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="font-bold text-gray-700">{file ? file.name : "Click to replace existing file"}</p>
            </div>
          </section>

          <div className="pt-6 flex justify-end">
            <button disabled={saving} type="submit" className="bg-gray-900 text-white px-12 py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all">
              {saving ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}