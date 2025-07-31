import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function RecordDetails() {
  const { id } = useParams();
  const location = useLocation();
  const backTo = location.state?.from || '/records';

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const docRef = doc(db, 'records', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecord(docSnap.data());
        } else {
          setRecord(null);
        }
      } catch (error) {
        console.error('Error loading record:', error);
        setRecord(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!record) return <p className="p-4 text-red-600">Record not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Record Details</h2>
      <ul className="space-y-2">
        <li><strong>Access Code:</strong> {record.accessCode}</li>
        <li><strong>Location Code:</strong> {record.locationCode}</li>
        <li><strong>Box No:</strong> {record.boxNo}</li>
        <li><strong>Creator/Author:</strong> {record.creator}</li>
        <li><strong>Provenance:</strong> {record.provenance}</li>
        <li><strong>Date Created:</strong> {record.dateCreated}</li>
        <li><strong>Title:</strong> {record.title}</li>
        <li><strong>Material Type:</strong> {record.materialType}</li>
        <li><strong>Physical Description:</strong> {record.physicalDescription}</li>
        <li><strong>File (Link):</strong> {record.fileLink}</li>
        <li><strong>Date Encoded:</strong> {record.dateEncoded}</li>
        <li><strong>Content Description:</strong> {record.contentDescription}</li>
      </ul>

      <Link to={backTo}>
        <button className="mt-6 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
          ← Back
        </button>
      </Link>
    </div>
  );
}
