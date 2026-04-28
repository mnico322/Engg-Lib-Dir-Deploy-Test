// src/pages/AccountAdministration.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountAdministration() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
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

  // 1. SECURITY REDIRECT: Prevent non-admins from even seeing the page layout
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast.error("Access denied. Admins only.");
      navigate("/records"); // Kick them out immediately
    }
  }, [user, authLoading, navigate]);

  // 2. Fetch Users Logic
  const fetchUsers = async () => {
    try {
      // SECURITY: withCredentials sends the secure cookies to the backend
      const res = await axios.get("http://localhost:5000/api/users", {
        params: { searchTerm, filterRole },
        withCredentials: true,
      });
      
      const userData = Array.isArray(res.data) ? res.data : [];
      setUsers(userData);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 403) {
        toast.error("Unauthorized action.");
      } else {
        toast.error("Failed to fetch users.");
      }
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
      // Backend checks the session cookie to see if YOU are an admin before allowing this patch
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
      toast.error(err.response?.data?.message || "Failed to update role.");
    } finally {
      setRoleModalOpen(false);
    }
  };

  const confirmDelete = async () => {
    try {
      // If the Librarian tries to call this, the backend will stop them because their 'role' cookie isn't 'admin'
      await axios.delete(`http://localhost:5000/api/users/${userToDelete.id}`, { withCredentials: true });
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      toast.success("User deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  // Pagination Helper
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  if (authLoading) return <div className="p-6 text-center font-medium text-gray-500">Checking Authorization...</div>;
  if (!user || user.role !== 'admin') return null; // Component returns null while redirect happens

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Account Administration</h2>
          <p className="text-gray-500">Manage user access levels and pending approvals.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border-2 border-gray-100 rounded-xl w-full sm:w-80 focus:border-blue-500 outline-none transition-all"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border-2 border-gray-100 rounded-xl bg-white focus:border-blue-500 outline-none transition-all"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="librarian">Librarian</option>
          <option value="user">User (Pending)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Display Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Approved</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentItems.map(u => (
              <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${u.approved === 0 ? 'bg-orange-50/50' : ''}`}>
                <td className="px-6 py-4 font-semibold text-gray-700">{u.displayName || 'No Name'}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={u.role || 'user'}
                    onChange={(e) => onRoleSelectChange(u, e.target.value)}
                    className="border-2 border-gray-100 rounded-lg px-2 py-1 text-sm bg-white focus:border-blue-400 outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="librarian">Librarian</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-center">
                  {u.approved ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Approved</span>
                  ) : (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {!u.approved && (
                    <button onClick={() => handleApprove(u.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all">Approve</button>
                  )}
                  <button onClick={() => { setUserToDelete(u); setDeleteModalOpen(true); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Confirmation Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Update Permissions?</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">Change {selectedUser?.displayName}'s role to <strong className="text-blue-600">{newRole}</strong>? This affects their system access.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRoleModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">Cancel</button>
              <button onClick={confirmRoleChange} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all">Confirm Change</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Account?</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">Are you sure you want to remove <strong>{userToDelete?.displayName}</strong>? Their access will be revoked immediately.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">Cancel</button>
              <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all">Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}