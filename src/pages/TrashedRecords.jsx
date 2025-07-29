import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../AuthContext';

export default function TrashedRecords() {
  const { userData } = useAuth();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchTrashed = async () => {
      const snapshot = await getDocs(collection(db, 'records'));
      const now = new Date();

      const cleanedRecords = [];

      for (const d of snapshot.docs) {
        const data = d.data();
        if (data.status === 'trashed') {
          const createdAt = data.createdAt?.toDate?.() || new Date();
          const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

          if (diffDays >= 30) {
            await deleteDoc(doc(db, 'records', d.id)); // auto-delete after 30 days
            continue;
          }

          cleanedRecords.push({ id: d.id, ...data });
        }
      }

      setRecords(cleanedRecords);
    };

    fetchTrashed();
  }, []);

  const handleRestore = async (id) => {
    await updateDoc(doc(db, 'records', id), { status: 'active' });
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handlePermanentDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to permanently delete this record? This cannot be undone.');
    if (!confirm) return;

    await deleteDoc(doc(db, 'records', id));
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const exportToCSV = () => {
    const headers = [
      "Title", "Access Code", "Material Type", "Creator", "Provenance", "Created By", "Date Created"
    ];

    const rows = records.map(record => [
      record.title,
      record.accessCode,
      record.materialType,
      record.creator,
      record.provenance,
      record.createdBy,
      record.dateCreated
    ]);

    const csvContent =
      [headers, ...rows]
        .map(e => e.map(v => `"${v || ''}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "trashed_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (userData?.role !== 'librarian') {
    return <p>You do not have permission to view trashed records.</p>;
  }

  const filteredRecords = records.filter(record =>
    (
      record.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.accessCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.creator?.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filterType === '' || record.materialType === filterType)
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Trashed Records</h2>

      {/* Search and Filter */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by title, access code, or creator..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Material Types</option>
          <option value="College Executive Board (CEB)">College Executive Board (CEB)</option>
          <option value="College Academic Personnel Committee (CAPC)">College Academic Personnel Committee (CAPC)</option>
          <option value="Graduate Faculty Council">Graduate Faculty Council</option>
          <option value="Others">Others</option>
        </select>

        <button onClick={exportToCSV} style={{ marginLeft: '10px' }}>
          Export to CSV
        </button>
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <p>No trashed records found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Title</th>
              <th>Access Code</th>
              <th>Material Type</th>
              <th>Creator</th>
              <th>Provenance</th>
              <th>Created By</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(record => (
              <tr key={record.id}>
                <td>{record.title}</td>
                <td>{record.accessCode}</td>
                <td>{record.materialType}</td>
                <td>{record.creator}</td>
                <td>{record.provenance}</td>
                <td>{record.createdBy}</td>
                <td>{record.dateCreated}</td>
                <td>
                  <button onClick={() => handleRestore(record.id)}>Restore</button>
                  <button
                    onClick={() => handlePermanentDelete(record.id)}
                    style={{ color: 'red', marginLeft: '10px' }}
                  >
                    Delete Forever
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
