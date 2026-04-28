// src/pages/RecordDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://engg-lib-dir-deploy-test.onrender.com";

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 'user' will be null or undefined if not logged in
  const { user } = useAuth(); 
  
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/records/${id}`, {
          withCredentials: true,
        });
        setRecord(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Record not found or access denied.");
        navigate("/"); // Send non-logged-in users back to the Search Home
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id, navigate]);

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading Record...</div>;
  if (!record) return <div className="p-10 text-center text-red-500 font-medium">Record not found.</div>;

  // Define which fields to show in the metadata grid
  const detailFields = [
    { label: "Accession No.", value: record.accession_no },
    { label: "Box Number", value: record.box_number },
    { label: "Content Type", value: record.content_type },
    { label: "Publisher", value: record.publisher },
    { label: "Date", value: record.date_of_publication },
    { label: "Access Level", value: record.accessLevel },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header with Conditional Navigation */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button 
            onClick={() => navigate(user ? "/records" : "/")}
            className="text-orange-600 hover:text-orange-700 font-bold text-sm mb-2 flex items-center gap-1 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            {user ? "BACK TO ARCHIVE DASHBOARD" : "BACK TO SEARCH"}
          </button>
          <h1 className="text-gray-900 text-3xl font-bold">{record.title}</h1>
        </div>

        {/* 🔐 STAFF ONLY: Only show if user is logged in AND is Admin/Librarian */}
        {user && (user.role === "admin" || user.role === "librarian") && (
          <button 
            onClick={() => navigate(`/records/edit/${id}`)}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold shadow hover:bg-gray-800 transition-all"
          >
            Edit Record
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Metadata Grid */}
        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailFields.map((field, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[11px] text-gray-400 mb-1 tracking-widest uppercase font-bold">
                  {field.label}
                </span>
                <span className="text-gray-900 font-semibold">
                  {field.value || <span className="text-gray-300 italic font-normal">N/A</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-[11px] text-gray-400 mb-2 tracking-widest uppercase font-bold">Description</h2>
            <div className="text-gray-700 leading-relaxed bg-white p-5 rounded-xl border border-gray-200">
              {record.description_content || "No description provided."}
            </div>
          </section>

          {/* Download Action (Visible to Everyone) */}
          <div className="pt-6 border-t border-gray-100 flex justify-center md:justify-end">
            {record.file_path ? (
              <a 
                href={`${API_URL}/${record.file_path}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full md:w-auto bg-orange-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-3"
              >
                Download PDF / Document
              </a>
            ) : (
              <span className="text-gray-400 italic">No digital file available for this record.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}