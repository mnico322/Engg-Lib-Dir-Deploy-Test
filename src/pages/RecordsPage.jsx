// src/pages/RecordsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function RecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    accessCode: '',
    locationCode: '',
    boxNo: '',
    creator: '',
    provenance: '',
    dateCreated: '',
    title: '',
    materialType: '',
    physicalDescription: '',
    dateEncoded: '',
    contentDescription: '',
    status: 'active',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const fetchRecords = async () => {
    const querySnapshot = await getDocs(collection(db, 'records'));
    const recordsData = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(record => record.status === 'active');
    setRecords(recordsData);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    const recordData = {
      ...newRecord,
      dateCreated: new Date(newRecord.dateCreated),
      dateEncoded: new Date(),
      createdBy: user?.email || 'guest',
      status: 'active',
    };
    await addDoc(collection(db, 'records'), recordData);
    setNewRecord({
      accessCode: '',
      locationCode: '',
      boxNo: '',
      creator: '',
      provenance: '',
      dateCreated: '',
      title: '',
      materialType: '',
      physicalDescription: '',
      dateEncoded: '',
      contentDescription: '',
      status: 'active',
    });
    fetchRecords();
  };

  const handleTrash = async (id) => {
    const recordRef = doc(db, 'records', id);
    await updateDoc(recordRef, { status: 'trashed', trashedAt: new Date() });
    fetchRecords();
  };

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === '' || record.materialType === filterType)
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">📁 Records Management</h2>

      {user?.role === 'librarian' && (
        <form
          onSubmit={handleAddRecord}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded shadow"
        >
          {[
            { label: 'Access Code', name: 'accessCode' },
            { label: 'Location Code', name: 'locationCode' },
            { label: 'Box No', name: 'boxNo' },
            { label: 'Creator/Author', name: 'creator' },
            { label: 'Provenance (Office/Unit/Department)', name: 'provenance' },
            { label: 'Date Created', name: 'dateCreated', type: 'date' },
            { label: 'Title', name: 'title' },
            {
              label: 'Material Type',
              name: 'materialType',
              type: 'select',
              options: [
                'College Executive Board (CEB)',
                'College Academic Personnel Committee (CAPC)',
                'Graduate Faculty Council',
                'Others',
              ],
            },
            { label: 'Physical Description', name: 'physicalDescription' },
            { label: 'Content Description', name: 'contentDescription' },
          ].map(field => (
            <div key={field.name}>
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={newRecord[field.name]}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
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
                  value={newRecord[field.name]}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
                />
              )}
            </div>
          ))}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              ➕ Add Record
            </button>
          </div>
        </form>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="">All Types</option>
          <option value="College Executive Board (CEB)">CEB</option>
          <option value="College Academic Personnel Committee (CAPC)">CAPC</option>
          <option value="Graduate Faculty Council">GFC</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Material Type</th>
              <th className="px-4 py-2">Date Created</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2">{record.title}</td>
                  <td className="px-4 py-2">{record.materialType}</td>
                  <td className="px-4 py-2">
                    {record.dateCreated?.toDate?.().toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Link
                      to={`/records/${record.id}`}
                      state={{ from: '/records' }}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    {user?.role === 'librarian' && (
                      <button
                        onClick={() => handleTrash(record.id)}
                        className="text-red-600 hover:underline"
                      >
                        Trash
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
