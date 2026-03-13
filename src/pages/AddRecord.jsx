import React, { useState, useEffect } from "react";
import { fieldConfig } from "../config/fieldConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AddRecord() {
  const navigate = useNavigate();
  const { userData, loading } = useAuth();

  // Cascading Selection State
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedSubCollection, setSelectedSubCollection] = useState("");
  const [selectedSubSubCollection, setSelectedSubSubCollection] = useState("");

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

  // --- Cascading Logic Calculations ---
  const communityOptions = Object.keys(fieldConfig);
  
  const currentCommunityData = fieldConfig[selectedCommunity];
  const collectionOptions = currentCommunityData?.collections 
    ? Object.keys(currentCommunityData.collections) 
    : [];

  const currentCollectionData = currentCommunityData?.collections?.[selectedCollection];
  const subCollectionOptions = currentCollectionData?.subCollections 
    ? Object.keys(currentCollectionData.subCollections) 
    : [];

  const currentSubColData = currentCollectionData?.subCollections?.[selectedSubCollection];
  const subSubCollectionOptions = currentSubColData?.subSubCollections 
    ? Object.keys(currentSubColData.subSubCollections) 
    : [];

  const currentFields = (() => {
    if (!selectedCommunity) return [];
    if (Array.isArray(currentCommunityData)) return currentCommunityData;
    if (!selectedCollection) return [];
    if (selectedSubSubCollection && Array.isArray(currentSubColData?.subSubCollections?.[selectedSubSubCollection])) {
      return currentSubColData.subSubCollections[selectedSubSubCollection];
    }
    if (selectedSubCollection && Array.isArray(currentCollectionData?.subCollections?.[selectedSubCollection])) {
      return currentCollectionData.subCollections[selectedSubCollection];
    }
    if (selectedCollection && Array.isArray(currentCollectionData)) {
      return currentCollectionData;
    }
    return [];
  })();

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
      payload.append("userName", userData?.displayName || "Nico");
      payload.append("userRole", userData?.role || "Librarian");
      payload.append("community", selectedCommunity);
      payload.append("collection", selectedCollection);
      payload.append("subCollection", selectedSubCollection);
      payload.append("subSubCollection", selectedSubSubCollection);

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (file) payload.append("file", file);

      // We only need this one call; the backend handles logging internally now
      console.log("What I'm sending:", Object.fromEntries(payload.entries()));
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
        <p className="text-gray-500">Select the appropriate category to reveal the data entry form.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Community</label>
          <select 
            className="border p-2.5 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" 
            value={selectedCommunity} 
            onChange={(e) => { 
              setSelectedCommunity(e.target.value); 
              setSelectedCollection(""); 
              setSelectedSubCollection(""); 
              setSelectedSubSubCollection(""); 
              setFormData({});
            }}
          >
            <option value="">Select Community</option>
            {communityOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>

        {selectedCommunity && (
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Collection</label>
            <select 
              className="border p-2.5 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" 
              value={selectedCollection} 
              onChange={(e) => { 
                setSelectedCollection(e.target.value); 
                setSelectedSubCollection(""); 
                setSelectedSubSubCollection(""); 
                setFormData({});
              }}
            >
              <option value="">Select Collection</option>
              {collectionOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        )}

        {subCollectionOptions.length > 0 && (
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Sub-Collection</label>
            <select 
              className="border p-2.5 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" 
              value={selectedSubCollection} 
              onChange={(e) => { 
                setSelectedSubCollection(e.target.value); 
                setSelectedSubSubCollection(""); 
                setFormData({});
              }}
            >
              <option value="">Select Sub-Collection</option>
              {subCollectionOptions.map((sc) => (<option key={sc} value={sc}>{sc}</option>))}
            </select>
          </div>
        )}

        {subSubCollectionOptions.length > 0 && (
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Specific Category</label>
            <select 
              className="border p-2.5 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" 
              value={selectedSubSubCollection} 
              onChange={(e) => {
                setSelectedSubSubCollection(e.target.value);
                setFormData({});
              }}
            >
              <option value="">Select Option</option>
              {subSubCollectionOptions.map((ssc) => (<option key={ssc} value={ssc}>{ssc}</option>))}
            </select>
          </div>
        )}
      </div>

      {currentFields.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentFields.map((field) => (
                <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {field.label}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md h-24"
                    />
                  ) : field.type === "file" ? (
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  ) : field.type === "select" ? (
                    /* This is the part that handles Access Level and other dropdowns */
                    <select
                      name={field.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md bg-white"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  )}
                </div>
              ))}
          </div>

          <div className="flex justify-end gap-3 pt-6">
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
      ) : (
        selectedCommunity && (
          <div className="text-center p-10 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic">Please complete your category selection above to load the entry form.</p>
          </div>
        )
      )}
    </div>
  );
}