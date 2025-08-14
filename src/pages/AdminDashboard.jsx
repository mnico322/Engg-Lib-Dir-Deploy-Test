import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort so unapproved users are first
      usersData.sort((a, b) => (a.approved === b.approved ? 0 : a.approved ? 1 : -1));

      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { approved: true });
    setUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, approved: true } : u);
      return [...updated].sort((a, b) => (a.approved === b.approved ? 0 : a.approved ? 1 : -1));
    });
  };

  const onRoleSelectChange = (user, role) => {
    if (user.role !== role) {
      setSelectedUser(user);
      setNewRole(role);
      setRoleModalOpen(true);
    }
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, { role: newRole });
      setUsers(prev => prev.map(u => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update role.');
    } finally {
      setRoleModalOpen(false);
      setSelectedUser(null);
      setNewRole('');
    }
  };

  const cancelRoleChange = () => {
    setRoleModalOpen(false);
    setSelectedUser(null);
    setNewRole('');
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteDoc(doc(db, 'users', userToDelete.id));
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user.');
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Filtering
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.email?.toLowerCase().includes(searchLower) ||
        user.displayName?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower)) &&
      (filterRole === '' || user.role === filterRole)
    );
  });

  // Pagination logic
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Search + Filter + Items per page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Search by email, name, or role..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        <div>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
          >
            <option value={10}>View 10</option>
            <option value={50}>View 50</option>
            <option value={100}>View 100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Display Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-center">Approved</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map(user => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 ${!user.approved ? 'bg-orange-50' : ''}`}
                >
                  <td className="px-4 py-3">{user.displayName || '-'}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">
                    <select
                      value={user.role}
                      onChange={(e) => onRoleSelectChange(user, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="librarian">Librarian</option>
                      <option value="guest">Guest</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.approved ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-500 font-medium">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {!user.approved && (
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center px-4 py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info + Controls */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, totalItems)} of {totalItems} users
          </div>
          <div className="flex items-center gap-1">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                className={`px-3 py-1 border rounded ${currentPage === num ? 'bg-orange-500 text-white' : ''}`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Role Change</h3>
            <p className="mb-6">
              Change role of <strong>{selectedUser?.email}</strong> from <strong>{selectedUser?.role}</strong> to <strong>{newRole}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelRoleChange}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleChange}
                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete User</h3>
            <p className="mb-6">
              Are you sure you want to delete user <strong>{userToDelete?.email}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
