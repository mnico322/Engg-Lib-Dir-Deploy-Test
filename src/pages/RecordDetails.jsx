import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { fieldConfig } from "../config/fieldConfig";
import toast from "react-hot-toast";

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // Standardized to 'user'

  const [record, setRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const hasLogged = useRef(null);

  const role = user?.role?.toLowerCase() || "guest";
  const isStaff = role === "librarian" || role === "admin";

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/records/${id}`, { withCredentials: true });
      const data = res.data?.record || res.data;

      if (!data) {
        toast.error("Record not found");
        navigate("/records");
        return;
      }

      // 🛡️ Access Control Guard
      if (data.accessLevel === "Private (Staff Only)" && !isStaff) {
        toast.error("Access Denied: This record is private.");
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

  useEffect(() => {
    fetchRecord();
  }, [id, isStaff]); // Re-fetch if role changes or ID changes

  // 📝 Activity Logging Hook
  useEffect(() => {
    if (record && !loading && user && hasLogged.current !== id) {
      hasLogged.current = id; // Mark as logged immediately

      axios.post("http://localhost:5000/api/logs", {
        action: "VIEW",
        resourceId: id,
        resourceType: "RECORD",
        title: record.title,
        description: `Viewed record: ${record.title}`
      }, { withCredentials: true })
      .then(() => console.log("View logged for ID:", id))
      .catch(err => {
        console.error("Logging view failed", err);
        hasLogged.current = null; // Reset only on error
      });
    }
  }, [id, record, loading, user]);

  const canSeeFile = isStaff || record?.accessLevel === "Public (Metadata & File)";

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(record).forEach((key) => {
        if (record[key] !== null && record[key] !== undefined) {
          formData.append(key, record[key]);
        }
      });

      if (selectedFile) formData.append("file", selectedFile);

      await axios.put(`http://localhost:5000/api/records/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Record updated successfully");
      setEditMode(false);
      setSelectedFile(null);
      fetchRecord();
    } catch (err) {
      toast.error("Failed to update record");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/records/${id}`, { withCredentials: true });
      toast.success("Archived successfully");
      navigate("/records");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleChange = (e) => {
    setRecord((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Dynamic Field Logic
  const currentFields = (() => {
    if (!record) return [];
    const communityData = fieldConfig[record.community];
    if (!communityData) return [];
    if (Array.isArray(communityData)) return communityData;

    const collectionData = communityData.collections?.[record.collection];
    if (!collectionData) return [];
    if (Array.isArray(collectionData)) return collectionData;

    const subData = collectionData.subCollections?.[record.subCollection];
    if (!subData) return [];
    if (Array.isArray(subData)) return subData;

    const subSubData = subData.subSubCollections?.[record.subSubCollection];
    return Array.isArray(subSubData) ? subSubData : [];
  })();

  // ⚠️ LOADING & NULL GUARDS: Prevents "Cannot read property of null"
  if (authLoading || loading) return <div className="p-10 text-center text-gray-500">Loading record details...</div>;
  if (!record) return <div className="p-10 text-center">Record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <Link to="/records" className="text-blue-600 hover:underline text-sm block mb-1">← Back to Records</Link>
          <h1 className="text-2xl font-bold text-gray-800">{record.title || "Untitled Record"}</h1>
        </div>
        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${
          record.accessLevel?.includes("Private") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
        }`}>
          {record.accessLevel}
        </span>
      </div>

      {/* --- BREADCRUMBS --- */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase">Community</label>
          <p className="text-sm font-semibold text-gray-700">{record.community}</p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase">Collection</label>
          <p className="text-sm font-semibold text-gray-700">{record.collection}</p>
        </div>
        {(record.subCollection || record.subSubCollection) && (
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase">Sub-Category</label>
            <p className="text-sm font-semibold text-gray-700">
              {record.subCollection} {record.subSubCollection ? `> ${record.subSubCollection}` : ""}
            </p>
          </div>
        )}
      </div>

      {/* --- DYNAMIC FIELDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {currentFields.map((field) => (
          field.type !== "file" && (
            <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider">
                {field.label}
              </label>
              
              {editMode && isStaff ? (
                field.type === "textarea" ? (
                  <textarea name={field.name} value={record[field.name] || ""} onChange={handleChange} className="w-full border-2 border-gray-200 p-2 rounded text-sm focus:border-blue-500 outline-none transition min-h-[100px]" />
                ) : field.type === "select" ? (
                  <select name={field.name} value={record[field.name] || ""} onChange={handleChange} className="w-full border-2 border-gray-200 p-2 rounded text-sm focus:border-blue-500 outline-none">
                    <option value="">Select...</option>
                    {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input type={field.type === "date" ? "date" : "text"} name={field.name} value={record[field.name] || ""} onChange={handleChange} className="w-full border-2 border-gray-200 p-2 rounded text-sm focus:border-blue-500 outline-none" />
                )
              ) : (
                <div className="bg-white p-2.5 rounded text-gray-800 border-b border-gray-100 min-h-[35px]">
                  {record[field.name] || <span className="text-gray-300 italic">No Data</span>}
                </div>
              )}
            </div>
          )
        ))}
      </div>

      {/* --- FILE SECTION --- */}
      <div className="mt-12 p-6 bg-slate-50 border-2 border-slate-100 rounded-xl">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Document File</h3>
        
        {editMode && isStaff ? (
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-slate-300">
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-sm w-full cursor-pointer" />
          </div>
        ) : (
          canSeeFile ? (
            record.file_path ? (
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 text-red-500 flex items-center justify-center rounded font-bold text-xs">PDF</div>
                  <span className="text-sm font-medium text-gray-600">Attached Document</span>
                </div>
                <a href={`http://localhost:5000/${record.file_path}`} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition">View Full File</a>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 text-sm border-2 border-dashed rounded-lg">No file attached</div>
            )
          ) : (
            <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
              <span className="text-xl">🔒</span>
              <p className="text-xs"><strong>Restricted Access:</strong> Digital files are hidden for Public (Metadata Only) records.</p>
            </div>
          )
        )}
      </div>

      {/* --- STAFF ACTIONS --- */}
      {isStaff && (
        <div className="flex justify-end gap-4 mt-10 pt-8 border-t-2 border-gray-50">
          {!editMode ? (
            <>
              <button onClick={() => setEditMode(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md">Modify</button>
              <button onClick={() => setShowConfirmModal(true)} className="text-red-500 hover:bg-red-50 px-8 py-2.5 rounded-lg text-sm font-bold">Delete</button>
            </>
          ) : (
            <>
              <button onClick={() => { setEditMode(false); fetchRecord(); }} className="text-gray-500 px-6 py-2.5 text-sm font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleUpdate} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md">Save Changes</button>
            </>
          )}
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
            <h3 className="font-bold text-xl mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-8">Move this record to trash?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-3 text-sm font-bold text-gray-400 hover:text-gray-600">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}