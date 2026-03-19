import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, loading: authLoading } = useAuth();
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

  // Helper to extract filename from path (removes "uploads/" and timestamps)
  const getFileName = (path) => {
    if (!path) return "";
    return path.split(/[\\/]/).pop();
  };

  if (loading || authLoading) return <div className="p-10 text-center text-gray-500">Loading Record Details...</div>;
  if (!record) return <div className="p-10 text-center text-red-500">Record not found.</div>;

  const detailFields = [
    { label: "Title", value: record.title, fullWidth: true },
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
      <div className="mb-6 flex justify-between items-center">
        <button 
          onClick={() => navigate("/records")}
          className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-1 transition-colors uppercase tracking-tight"
        >
          ← Back to Archive
        </button>

        {["admin", "librarian"].includes(userData?.role) && (
          <button 
            onClick={() => navigate(`/records/edit/${id}`)}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-gray-700 transition-all text-sm uppercase"
          >
            Edit Entry
          </button>
        )}
      </div>

      <div className="space-y-4 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailFields.map((field, idx) => (
            <div key={idx} className={field.fullWidth ? "md:col-span-2" : ""}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="w-full p-2 border rounded-md bg-gray-50 text-gray-800 min-h-[42px] flex items-center overflow-hidden">
                {field.value || <span className="text-gray-300 italic">No data</span>}
              </div>
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description / Content
            </label>
            <div className="w-full p-2 border rounded-md h-32 bg-gray-50 text-gray-700 overflow-y-auto whitespace-pre-line text-sm leading-relaxed">
              {record.descriptionContent || "No description provided."}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Abstract
            </label>
            <div className="w-full p-2 border rounded-md h-24 bg-gray-50 text-gray-700 overflow-y-auto italic text-sm leading-relaxed">
              {record.abstract || "No abstract available."}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Keywords
            </label>
            <div className="w-full p-2 border rounded-md bg-white flex flex-wrap gap-2 min-h-[42px] items-center">
              {record.keywords?.split(',').map((tag, i) => (
                <span key={i} className="bg-orange-50 text-orange-700 px-3 py-1 text-xs font-semibold">
                  {tag.trim()}
                </span>
              )) || <span className="text-gray-400 text-xs italic">No keywords assigned.</span>}
            </div>
          </div>
        </div>

         {/* NEW: Explicit File Status Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Attached Document
            </label>
            <div className={`w-full p-3 border rounded-md flex items-center gap-3 ${record.filePath ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`p-2 rounded-full ${record.filePath ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${record.filePath ? 'text-green-700' : 'text-gray-500'}`}>
                  {record.filePath ? "File currently attached" : "No file attached"}
                </span>
                {record.filePath && (
                  <span className="text-xs text-green-600 font-mono truncate max-w-xs md:max-w-md">
                    {getFileName(record.filePath)}
                  </span>
                )}
              </div>
            </div>
          </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6">
          <div className="text-xs text-gray-400 font-medium">
            DB REF ID: <span className="font-mono text-gray-500 uppercase">{id.substring(0, 8)}...</span>
          </div>
          
          <div className="flex gap-3">
             {record.filePath ? (
                <a 
                  href={`http://localhost:5000/${record.filePath.replace(/\\/g, '/')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-orange-600 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-orange-700 transition-all text-center flex items-center justify-center gap-2 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Attached File
                </a>
              ) : (
                <div className="px-6 py-2 rounded-lg text-gray-400 bg-gray-100 text-xs font-bold border border-gray-200 uppercase tracking-widest">
                  No Document Available
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}