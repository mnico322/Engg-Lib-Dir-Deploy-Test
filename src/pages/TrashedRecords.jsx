// src/pages/TrashedRecords.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

export default function TrashedRecords() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const fetchTrashedRecords = async () => {
    const querySnapshot = await getDocs(collection(db, 'records'));
    const trashed = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(
        rec =>
          rec.status === 'trashed' &&
          (!rec.trashedAt || rec.trashedAt.toDate() < new Date(new Date().getTime() + 30 * 86400000))
      );
    setRecords(trashed);
  };

  useEffect(() => {
    fetchTrashedRecords();
  }, []);

  // Auto-delete records older than 30 days
  useEffect(() => {
    const deleteOldRecords = async () => {
      const now = new Date();
      for (const rec of records) {
        if (rec.trashedAt && rec.trashedAt.toDate() <= new Date(now.getTime() - 30 * 86400000)) {
          await deleteDoc(doc(db, 'records', rec.id));
        }
      }
    };
    deleteOldRecords();
  }, [records]);

  const handleExport = () => {
    const data = records.map(rec => ({
      Title: rec.title,
      'Material Type': rec.materialType,
      'Date Created': rec.dateCreated?.toDate().toLocaleDateString(),
      'Date Encoded': rec.dateEncoded?.toDate().toLocaleDateString(),
      Creator: rec.creator,
      Status: rec.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trashed Records');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, 'trashed_records.xlsx');
  };

  const filtered = records.filter(rec =>
    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === '' || rec.materialType === filterType)
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">🗑️ Trashed Records</h2>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/2"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="College Executive Board (CEB)">CEB</option>
          <option value="College Academic Personnel Committee (CAPC)">CAPC</option>
          <option value="Graduate Faculty Council">GFC</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="mb-4">
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇ Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Material Type</th>
              <th className="px-4 py-2">Trashed At</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2">{record.title}</td>
                  <td className="px-4 py-2">{record.materialType}</td>
                  <td className="px-4 py-2">
                    {record.trashedAt?.toDate().toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      to={`/records/${record.id}`}
                      state={{ from: '/trash' }}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-6 text-gray-500">
                  No trashed records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
