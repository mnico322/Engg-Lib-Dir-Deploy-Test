import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/records/${id}`, {
          withCredentials: true,
        });
        setRecord(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch record details");
        navigate("/records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id, navigate]);

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading Record Details...</div>;
  if (!record) return <div className="p-10 text-center text-red-500 font-medium">Record not found.</div>;

  // Mapping to match SQL underscore naming convention
  const detailFields = [
    { label: "Title", value: record.title},
    { label: "Accession No.", value: record.accession_no },
    { label: "Box Number", value: record.box_number },
    { label: "Place of Publication", value: record.place_of_publication },
    { label: "Publisher", value: record.publisher },
    { label: "Date of Publication", value: record.date_of_publication },
    { label: "Content Type", value: record.content_type },
    { label: "Paper/Journal", value: record.paper },
    { label: "Access Level", value: record.accessLevel },
    { label: "Status", value: record.status?.toUpperCase() },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button 
            onClick={() => navigate("/records")}
            className="text-orange-600 hover:text-orange-700 font-bold text-sm mb-2 flex items-center gap-1 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO ARCHIVE
          </button>
          <p className="text-gray-500 mt-1">Archive reference and digital metadata.</p>
        </div>

        {["admin", "librarian"].includes(user?.role?.toLowerCase()) && (
          <button 
            onClick={() => navigate(`/records/edit/${id}`)}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            Edit Record
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* 🔹 TITLE PLACED AT THE TOP OF THE BOX */}
        <div className="p-8 pb-0">
          <span className="text-[12px] text-gray-400 mb-1 tracking-wider block">
            Title
          </span>
          <h1 className="text-gray-900 text-3xl break-words">
            {record.title || <span className="text-gray-300 font-normal italic">No Title Provided</span>}
          </h1>
        </div>

        {/* Metadata Grid */}
        <div className="p-8 bg-gray-50/50 border-b border-gray-100 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {detailFields
              .filter(field => field.label !== "Title") // Prevents the title from appearing in the grid
              .map((field, idx) => (
              <div key={idx} className="flex flex-col group">
                <span className="text-[12px] text-gray-400 mb-1 tracking-wider block">
                  {field.label}
                </span>
                <span className="text-gray-900 font-semibold text-lg break-words">
                  {field.value || <span className="text-gray-300 font-normal italic">Not specified</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-10">
          <section>
            <h2 className="text-[12px] text-gray-400 mb-1 tracking-wider block">Description / Content</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-white p-5 rounded-xl border-2 border-gray-50 shadow-inner break-words">
              {record.description_content || "No detailed description available."}
            </div>
          </section>

          <section>
            <h2 className="text-[12px] text-gray-400 mb-1 tracking-wider block">Abstract</h2>
            <div className="text-gray-600 italic leading-relaxed bg-orange-50/30 p-5 rounded-xl border border-orange-100/50 break-words">
              {record.abstract || "No abstract provided for this record."}
            </div>
          </section>

          <section>
            <h2 className="text-[12px] text-gray-400 mb-1 tracking-wider block">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {record.keywords ? (
                record.keywords.split(/[\n,]+/).map((tag, i) => tag.trim() && (
                  <span key={i} className="bg-white text-orange-600 border border-orange-200 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                    {tag.trim()}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">No keywords assigned.</span>
              )}
            </div>
          </section>

          {/* Audit Metadata (System Info) */}
          <div className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="text-[11px] text-gray-400 uppercase tracking-widest">
               Encoded By: <span className="text-gray-600 font-bold">{record.encoded_by || 'Unknown'}</span>
             </div>
             <div className="text-[11px] text-gray-400 uppercase tracking-widest md:text-right">
               System ID: <span className="font-mono text-gray-600">{id}</span>
             </div>
          </div>

          {/* Download Action */}
          <div className="pt-6 flex justify-center md:justify-end">
            {record.file_path ? (
              <a 
                href={`http://localhost:5000/${record.file_path}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full md:w-auto bg-orange-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Full Document
              </a>
            ) : (
              <div className="px-8 py-4 bg-gray-100 text-gray-400 rounded-xl font-bold border border-dashed border-gray-300">
                No Digital File Attached
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}