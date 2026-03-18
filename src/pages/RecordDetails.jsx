import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
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
        toast.error("Failed to fetch record details");
        navigate("/records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id, navigate]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Record Details...</div>;
  if (!record) return <div className="p-10 text-center text-red-500">Record not found.</div>;

  // Metadata mapping to match the AddRecord grid style
  const detailFields = [
    { label: "Accession No.", value: record.accessionNo },
    { label: "Box Number", value: record.boxNumber },
    { label: "Place of Publication", value: record.placeOfPublication },
    { label: "Publisher", value: record.publisher },
    { label: "Date of Publication", value: record.dateOfPublication },
    { label: "Type", value: record.type },
    { label: "Paper", value: record.paper },
    { label: "Access Level", value: record.accessLevel },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <button 
            onClick={() => navigate("/records")}
            className="text-orange-600 hover:text-orange-700 font-bold text-sm mb-2 flex items-center gap-1 transition-colors"
          >
            ← BACK TO ARCHIVE
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{record.title}</h1>
          <p className="text-gray-500">Detailed view of the archived digital record.</p>
        </div>

        {["admin", "librarian"].includes(userData?.role) && (
          <button 
            onClick={() => navigate(`/records/edit/${id}`)}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-gray-700 transition-all"
          >
            Edit Record
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Metadata Grid - Matching the AddRecord look */}
        <div className="p-8 border-b border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detailFields.map((field, idx) => field.value && (
              <div key={idx} className="flex flex-col">
                <span className="text-xs font-bold uppercase text-gray-400 mb-1 tracking-wider">
                  {field.label}
                </span>
                <span className="text-gray-800 font-medium border-b border-gray-50 pb-2">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Long Text Sections */}
        <div className="p-8 space-y-8 bg-white">
          <section>
            <h2 className="text-sm font-bold uppercase text-orange-600 mb-3 tracking-wide">Description / Content</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100">
              {record.descriptionContent || "No description provided."}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase text-orange-600 mb-3 tracking-wide">Abstract</h2>
            <div className="text-gray-700 italic leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
              {record.abstract || "No abstract available."}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase text-orange-600 mb-3 tracking-wide">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {record.keywords?.split(',').map((tag, i) => (
                <span key={i} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                  {tag.trim()}
                </span>
              )) || <span className="text-gray-400 text-sm">No keywords assigned.</span>}
            </div>
          </section>

          {/* Action Bar / File Section */}
          <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 italic">
              Record ID: <span className="font-mono">{id}</span>
            </div>
            
            {record.fileUrl ? (
              <a 
                href={`http://localhost:5000${record.fileUrl}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full md:w-auto bg-orange-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-orange-700 transition-all text-center flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Document
              </a>
            ) : (
              <div className="text-gray-400 text-sm font-medium">No digital file attached</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}