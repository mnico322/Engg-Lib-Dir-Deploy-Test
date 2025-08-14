// src/pages/RecordDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, currentUser } = useAuth();

  const [record, setRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      const docRef = doc(db, 'records', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecord({
          ...data,
          dateCreated: data.dateCreated?.seconds
            ? new Date(data.dateCreated.seconds * 1000).toISOString().split('T')[0]
            : '',
        });
      }
    };
    fetchRecord();
  }, [id]);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'records', id);
      await updateDoc(docRef, {
        ...record,
        dateCreated: new Date(record.dateCreated),
        updatedAt: new Date(),
      });

      await addDoc(collection(db, 'logs'), {
        action: 'update',
        recordId: id,
        updatedBy: currentUser?.email || 'unknown',
        timestamp: new Date(),
      });

      setEditMode(false);
      toast.success('Record updated successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update record.');
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, 'records', id);
      await updateDoc(docRef, {
        status: 'trashed',
        trashedAt: new Date(),
      });

      await addDoc(collection(db, 'logs'), {
        action: 'delete',
        recordId: id,
        deletedBy: currentUser?.email || 'unknown',
        timestamp: new Date(),
      });

      toast.success('Record moved to trash.');
      navigate('/records');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete record.');
    }
  };

  if (!record) return <div className="p-6 text-gray-600">Loading...</div>;

  const isEditable = userData?.role === 'librarian';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <Link to="/records" className="text-blue-600 hover:underline">← Back to Records</Link>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-accent">📄 Record Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Access Code', name: 'accessCode' },
          { label: 'Location Code', name: 'locationCode' },
          { label: 'Box No', name: 'boxNo' },
          { label: 'Creator/Author', name: 'creator' },
          { label: 'Provenance', name: 'provenance' },
          { label: 'Date Created', name: 'dateCreated', type: 'date' },
          { label: 'Title', name: 'title' },
          {
            label: 'Material Type',
            name: 'materialType',
            type: 'select',
            options: ['College Executive Board (CEB)', 'College Academic Personnel Committee (CAPC)', 'Graduate Faculty Council', 'Others'],
          },
          { label: 'Physical Description', name: 'physicalDescription' },
          { label: 'Content Description', name: 'contentDescription' },
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            {editMode && isEditable ? (
              field.type === 'select' ? (
                <select
                  name={field.name}
                  value={record[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={record[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              )
            ) : (
              <div className="text-gray-800 bg-gray-100 px-3 py-2 rounded">{record[field.name] || '—'}</div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      {isEditable && (
        <div className="flex justify-between items-center">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#ff8400] text-white px-4 py-2 rounded hover:brightness-110"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          )}

          <button
            onClick={() => setShowConfirmModal(true)}
            className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to move this record to trash?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
