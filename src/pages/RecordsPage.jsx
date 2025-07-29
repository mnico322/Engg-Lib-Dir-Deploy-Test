import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../AuthContext';

export default function RecordsPage() {
  const { userData } = useAuth();
  const [records, setRecords] = useState([]);

  // Form state
  const [accessCode, setAccessCode] = useState('');
  const [locationCode, setLocationCode] = useState('');
  const [boxNo, setBoxNo] = useState('');
  const [creator, setCreator] = useState('');
  const [provenance, setProvenance] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [title, setTitle] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      const snapshot = await getDocs(collection(db, 'records'));
      const items = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => item.status !== 'trashed');
      setRecords(items);
    };

    fetchRecords();
  }, []);

  const resetForm = () => {
    setAccessCode('');
    setLocationCode('');
    setBoxNo('');
    setCreator('');
    setProvenance('');
    setDateCreated('');
    setTitle('');
    setMaterialType('');
    setPhysicalDescription('');
    setContentDescription('');
    setEditingId(null);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    const data = {
      accessCode,
      locationCode,
      boxNo,
      creator,
      provenance,
      dateCreated,
      title,
      materialType,
      physicalDescription,
      contentDescription,
      createdBy: auth.currentUser.email,
      createdAt: serverTimestamp(),
      status: 'active'
    };

    if (editingId) {
      await updateDoc(doc(db, 'records', editingId), data);
      setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...data } : r));
    } else {
      const docRef = await addDoc(collection(db, 'records'), data);
      setRecords(prev => [...prev, { id: docRef.id, ...data }]);
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    await updateDoc(doc(db, 'records', id), { status: 'trashed' });
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleEdit = (record) => {
    setAccessCode(record.accessCode || '');
    setLocationCode(record.locationCode || '');
    setBoxNo(record.boxNo || '');
    setCreator(record.creator || '');
    setProvenance(record.provenance || '');
    setDateCreated(record.dateCreated || '');
    setTitle(record.title || '');
    setMaterialType(record.materialType || '');
    setPhysicalDescription(record.physicalDescription || '');
    setContentDescription(record.contentDescription || '');
    setEditingId(record.id);
  };

  return (
    <div>
      <h2>Records</h2>

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
      </div>

      {/* Form */}
      {userData?.role === 'librarian' && (
        <form onSubmit={handleAddOrUpdate} style={{ marginBottom: '1rem' }}>
          <input type="text" placeholder="Access Code" value={accessCode} onChange={e => setAccessCode(e.target.value)} required /><br />
          <input type="text" placeholder="Location Code" value={locationCode} onChange={e => setLocationCode(e.target.value)} required /><br />
          <input type="text" placeholder="Box No" value={boxNo} onChange={e => setBoxNo(e.target.value)} required /><br />
          <input type="text" placeholder="Creator/Author" value={creator} onChange={e => setCreator(e.target.value)} required /><br />
          <input type="text" placeholder="Provenance (Office/Unit/Department)" value={provenance} onChange={e => setProvenance(e.target.value)} required /><br />
          <input type="date" placeholder="Date Created" value={dateCreated} onChange={e => setDateCreated(e.target.value)} required /><br />
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required /><br />
          <select value={materialType} onChange={e => setMaterialType(e.target.value)} required>
            <option value="">Select Material Type</option>
            <option value="College Executive Board (CEB)">College Executive Board (CEB)</option>
            <option value="College Academic Personnel Committee (CAPC)">College Academic Personnel Committee (CAPC)</option>
            <option value="Graduate Faculty Council">Graduate Faculty Council</option>
            <option value="Others">Others</option>
          </select><br />
          <input type="text" placeholder="Physical Description" value={physicalDescription} onChange={e => setPhysicalDescription(e.target.value)} required /><br />
          <textarea placeholder="Content Description" value={contentDescription} onChange={e => setContentDescription(e.target.value)} required /><br />
          <button type="submit">{editingId ? 'Update' : 'Add'} Record</button>
        </form>
      )}

      {/* Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Access Code</th>
            <th>Location Code</th>
            <th>Box No</th>
            <th>Creator</th>
            <th>Provenance</th>
            <th>Date Created</th>
            <th>Title</th>
            <th>Material Type</th>
            <th>Physical Description</th>
            <th>Content Description</th>
            <th>Created By</th>
            {userData?.role === 'librarian' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {records
            .filter(record =>
              (
                record.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.accessCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.creator?.toLowerCase().includes(searchTerm.toLowerCase())
              ) &&
              (filterType === '' || record.materialType === filterType)
            )
            .map(record => (
              <tr key={record.id}>
                <td>{record.accessCode}</td>
                <td>{record.locationCode}</td>
                <td>{record.boxNo}</td>
                <td>{record.creator}</td>
                <td>{record.provenance}</td>
                <td>{record.dateCreated}</td>
                <td>{record.title}</td>
                <td>{record.materialType}</td>
                <td>{record.physicalDescription}</td>
                <td>{record.contentDescription}</td>
                <td>{record.createdBy}</td>
                {userData?.role === 'librarian' && (
                  <td>
                    <button onClick={() => handleEdit(record)}>Edit</button>
                    <button onClick={() => handleDelete(record.id)} style={{ color: 'red', marginLeft: '10px' }}>
                      Trash
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
