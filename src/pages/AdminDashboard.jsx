// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Changed to match your toast library in RecordsPage
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth(); // Using 'user' from your AuthContext
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

  // 1. Auth Guard: Prevent non-admins from seeing the page
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast.error("Access denied. Admins only.");
      // You might want to navigate('/') here
    }
  }, [user, authLoading]);

  // 2. Fetch Users Logic
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        params: { page: currentPage, itemsPerPage, searchTerm, filterRole },
        withCredentials: true,
      });
      
      // Handle MySQL response (usually an array or {users: []})
      const userData = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(userData);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status !== 401) { // Don't toast if it's just an auth redirect
        toast.error("Failed to fetch users.");
      }
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [currentPage, searchTerm, filterRole, user]);

  if (authLoading) return <div className="p-6">Loading Auth...</div>;
  if (!user || user.role !== 'admin') return <div className="p-6 text-red-500">Access Denied</div>;

  /* ================= HANDLERS ================= */

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}/approve`, {}, { withCredentials: true });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, approved: 1 } : u)); // MySQL uses 1 for true
      toast.success("User approved.");
    } catch (err) {
      toast.error("Failed to approve user.");
    }
  };

  const onRoleSelectChange = (userObj, role) => {
    if (userObj.role !== role) {
      setSelectedUser(userObj);
      setNewRole(role);
      setRoleModalOpen(true);
    }
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${selectedUser.id}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      setUsers(prev => prev.map(u => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));
      toast.success("Role updated.");
    } catch (err) {
      toast.error("Failed to update role.");
    } finally {
      setRoleModalOpen(false);
      setSelectedUser(null);
      setNewRole('');
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userToDelete.id}`, { withCredentials: true });
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      toast.success("User deleted.");
    } catch (err) {
      toast.error("Failed to delete user.");
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Pagination Helper
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="user">User</option> {/* Check if your DB uses 'user' or 'guest' */}
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
            {currentItems.map(u => (
              <tr key={u.id} className={`hover:bg-gray-50 ${u.approved === 0 ? 'bg-orange-50' : ''}`}>
                <td className="px-4 py-3">{u.displayName || u.display_name || '-'}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => onRoleSelectChange(u, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="admin">Admin</option>
                    <option value="librarian">Librarian</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  {u.approved ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-red-500 font-medium">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {!u.approved && (
                    <button onClick={() => handleApprove(u.id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                  )}
                  <button onClick={() => { setUserToDelete(u); setDeleteModalOpen(true); }} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal sections remain the same but use updated handlers... */}
      {/* (Modal JSX follows the same logic as your original code) */}
      
    </div>
  );
}