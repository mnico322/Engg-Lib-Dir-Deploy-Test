// src/pages/AccountAdministration.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AccountAdministration() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 1. Auth Guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast.error("Access denied. Admins only.");
    }
  }, [user, authLoading]);

  // 2. Fetch Users Logic
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        params: { searchTerm, filterRole },
        withCredentials: true,
      });
      
      const userData = Array.isArray(res.data) ? res.data : [];
      setUsers(userData);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [searchTerm, filterRole, user]);

  /* ================= HANDLERS ================= */

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}/approve`, {}, { withCredentials: true });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, approved: 1 } : u)); 
      toast.success("User approved!");
    } catch (err) {
      toast.error("Failed to approve user.");
    }
  };

  const onRoleSelectChange = (userObj, role) => {
    setSelectedUser(userObj);
    setNewRole(role);
    setRoleModalOpen(true);
  };

  const confirmRoleChange = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${selectedUser.id}/role`, 
        { role: newRole }, 
        { withCredentials: true }
      );
      setUsers(prev => prev.map(u => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));
      toast.success("Role updated.");
    } catch (err) {
      toast.error("Failed to update role.");
    } finally {
      setRoleModalOpen(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userToDelete.id}`, { withCredentials: true });
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      toast.success("User deleted.");
    } catch (err) {
      toast.error("Failed to delete user.");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  // Pagination Helper
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  if (authLoading) return <div className="p-6">Loading Auth...</div>;
  if (!user || user.role !== 'admin') return <div className="p-6 text-red-500">Access Denied</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-64"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="librarian">Librarian</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">Display Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase">Role</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase">Approved</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map(u => (
              <tr key={u.id} className={`hover:bg-gray-50 ${u.approved === 0 ? 'bg-orange-50' : ''}`}>
                <td className="px-4 py-3 font-medium">{u.displayName || 'No Name'}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role || 'user'}
                    onChange={(e) => onRoleSelectChange(u, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="admin">Admin</option>
                    <option value="librarian">Librarian</option>
                    <option value="guest">Guest</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  {u.approved ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-red-500 font-bold">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {!u.approved && (
                    <button onClick={() => handleApprove(u.id)} className="bg-green-500 text-white px-3 py-1 rounded text-xs">Approve</button>
                  )}
                  <button onClick={() => { setUserToDelete(u); setDeleteModalOpen(true); }} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Confirmation Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="font-bold mb-4">Change Role?</h3>
            <p className="text-sm mb-6">Change {selectedUser?.displayName}'s role to <strong>{newRole}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRoleModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmRoleChange} className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="font-bold mb-4 text-red-600">Delete User?</h3>
            <p className="text-sm mb-6">Are you sure you want to delete {userToDelete?.displayName}? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}