import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const logAction = async (action, targetEmail) => {
    const admin = auth.currentUser;
    if (!admin) return;

    await addDoc(collection(db, 'activity_logs'), {
      adminEmail: admin.email,
      action,
      targetUser: targetEmail,
      timestamp: serverTimestamp()
    });
  };

  const handleApprove = async (id) => {
    const user = users.find(u => u.id === id);
    await updateDoc(doc(db, 'users', id), { approved: true });
    await logAction('Approved user', user.email);
    setUsers(prev =>
      prev.map(user => user.id === id ? { ...user, approved: true } : user)
    );
  };

  const handleRoleChange = async (id, newRole) => {
    const user = users.find(u => u.id === id);
    await updateDoc(doc(db, 'users', id), { role: newRole });
    await logAction(`Changed role to ${newRole}`, user.email);
    setUsers(prev =>
      prev.map(user => user.id === id ? { ...user, role: newRole } : user)
    );
  };

  const handleDelete = async (id) => {
    const user = users.find(u => u.id === id);
    await deleteDoc(doc(db, 'users', id));
    await logAction('Deleted user', user.email);
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Search & Filter */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="guest">Guest</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* User Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(user =>
              user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (filterRole === '' || user.role === filterRole)
            )
            .map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="guest">Guest</option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{user.approved ? '✅' : '❌'}</td>
                <td>
                  {!user.approved && (
                    <button onClick={() => handleApprove(user.id)}>Approve</button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{ marginLeft: '10px', color: 'red' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
