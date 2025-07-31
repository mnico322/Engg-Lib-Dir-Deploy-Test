// src/pages/RecordsPage.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

export default function RecordsPage() {
  const { userData } = useAuth();
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    accessCode: '',
    locationCode: '',
    boxNo: '',
    creator: '',
    provenance: '',
    dateCreated: '',
    title: '',
    materialType: '',
    physicalDescription: '',
    fileLink: '',
    dateEncoded: '',
    contentDescription: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const fetchRecords = async () => {
    const querySnapshot = await getDocs(collection(db, 'records'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter(doc => doc.status !== 'trashed'); // Exclude trashed
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await addDoc(collection(db, 'records'), {
      ...formData,
      createdBy: userData?.email || 'unknown',
      createdAt: Timestamp.now(),
      status: 'active'
    });
    setFormData({
      accessCode: '',
      locationCode: '',
      boxNo: '',
      creator: '',
      provenance: '',
      dateCreated: '',
      title: '',
      materialType: '',
      physicalDescription: '',
      fileLink: '',
      dateEncoded: '',
      contentDescription: ''
    });
    fetchRecords();
  };

  const handleDelete = async id => {
    const recordRef = doc(db, 'records', id);
    await deleteDoc(recordRef);
    fetchRecords();
  };

  const handleTrash = async id => {
    const recordRef = doc(db, 'records', id);
    await recordRef.update({
      status: 'trashed',
      deletedAt: Timestamp.now()
    });
    fetchRecords();
  };

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === '' || record.materialType === filterType)
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Records Management</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input name="accessCode" placeholder="Access Code" value={formData.accessCode} onChange={handleChange} required />
          <input name="locationCode" placeholder="Location Code" value={formData.locationCode} onChange={handleChange} required />
          <input name="boxNo" placeholder="Box No" value={formData.boxNo} onChange={handleChange} required />
          <input name="creator" placeholder="Creator/Author" value={formData.creator} onChange={handleChange} required />
          <input name="provenance" placeholder="Provenance" value={formData.provenance} onChange={handleChange} required />
          <input type="date" name="dateCreated" value={formData.dateCreated} onChange={handleChange} required />
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <select name="materialType" value={formData.materialType} onChange={handleChange} required>
            <option value="">Select Material Type</option>
            <option value="College Executive Board (CEB)">CEB</option>
            <option value="College Academic Personnel Committee (CAPC)">CAPC</option>
            <option value="Graduate Faculty Council">Graduate Faculty Council</option>
            <option value="Others">Others</option>
          </select>
          <input name="physicalDescription" placeholder="Physical Description" value={formData.physicalDescription} onChange={handleChange} />
          <input name="fileLink" placeholder="File (Digital Copy)" value={formData.fileLink} onChange={handleChange} />
          <input type="date" name="dateEncoded" value={formData.dateEncoded} onChange={handleChange} />
          <textarea name="contentDescription" placeholder="Content Description" value={formData.contentDescription} onChange={handleChange} />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Record</button>
      </form>

      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Search title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-2 py-1 w-full md:w-1/3"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border px-2 py-1 w-full md:w-1/3"
        >
          <option value="">All Types</option>
          <option value="College Executive Board (CEB)">CEB</option>
          <option value="College Academic Personnel Committee (CAPC)">CAPC</option>
          <option value="Graduate Faculty Council">Graduate Faculty Council</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Material Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map(record => (
            <tr key={record.id}>
              <td className="border p-2">{record.title}</td>
              <td className="border p-2">{record.materialType}</td>
              <td className="border p-2 flex gap-2">
                <Link to={`/records/${record.id}`}>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">View</button>
                </Link>
                <button onClick={() => handleTrash(record.id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Trash</button>
                <button onClick={() => handleDelete(record.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
