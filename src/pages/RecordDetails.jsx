// src/pages/RecordDetails.jsx
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function RecordDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const fromPath = location.state?.from || '/records';

  useEffect(() => {
    const fetchRecord = async () => {
      const docRef = doc(db, 'records', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRecord({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error('Record not found');
      }
    };
    fetchRecord();
  }, [id]);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  };

  if (!record) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading record...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">📄 Record Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <Detail label="Access Code" value={record.accessCode} />
        <Detail label="Location Code" value={record.locationCode} />
        <Detail label="Box No" value={record.boxNo} />
        <Detail label="Creator/Author" value={record.creator} />
        <Detail label="Provenance" value={record.provenance} />
        <Detail label="Date Created" value={formatDate(record.dateCreated)} />
        <Detail label="Title" value={record.title} />
        <Detail label="Material Type" value={record.materialType} />
        <Detail label="Physical Description" value={record.physicalDescription} />
        <Detail label="Date Encoded" value={formatDate(record.dateEncoded)} />
        <Detail label="Content Description" value={record.contentDescription} />
        <Detail label="Status" value={record.status || 'active'} />
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate(fromPath)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-600 font-semibold">{label}:</p>
      <p className="text-gray-800">{value || 'N/A'}</p>
    </div>
  );
}
