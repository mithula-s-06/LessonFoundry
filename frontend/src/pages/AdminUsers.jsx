import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Eye, 
  Trash2, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  UserX, 
  Calendar, 
  Mail, 
  Shield, 
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminUsers = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // View User Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete User Confirmation State
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const toast = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userApi.updateRole(userId, newRole);
      toast.success(`Role updated to ${newRole} successfully.`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      if (selectedUser?.id === userId) {
        setSelectedUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await userApi.updateStatus(userId, !currentStatus);
      toast.success(`Account status updated to ${!currentStatus ? 'Active' : 'Disabled'}.`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: !currentStatus } : u));
      if (selectedUser?.id === userId) {
        setSelectedUser(prev => ({ ...prev, enabled: !currentStatus }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    try {
      setViewLoading(true);
      const res = await userApi.getById(user.id);
      if (res.data) {
        setSelectedUser(res.data);
      }
    } catch (err) {
      console.warn("Could not fetch detailed user info, showing basic details:", err);
    } finally {
      setViewLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeleteLoading(true);
      await userApi.deleteUser(userToDelete.id);
      toast.success(`User ${userToDelete.fullName || userToDelete.email} deleted successfully.`);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      if (selectedUser?.id === userToDelete.id) {
        setSelectedUser(null);
      }
      setUserToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const displayedUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);

  const roleColors = {
    ADMIN: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
    TEACHER: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
    STUDENT: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-purple-400" />
            <span>User Management Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View full user details, assign system privileges, activate/deactivate accounts, and safely remove users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold">
            Total Users: <strong className="text-purple-400 ml-1">{users.length}</strong>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 shrink-0 font-medium">Filter Role:</span>
          {['ALL', 'TEACHER', 'STUDENT', 'ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => {
                setRoleFilter(r);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === r 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Permission</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                      <span>Loading user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No users found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                displayedUsers.map(u => {
                  const isSelf = currentAdmin?.id === u.id || currentAdmin?.email === u.email;
                  return (
                    <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                            {u.fullName?.charAt(0) || u.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.fullName || 'Anonymous User'}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {u.id?.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-mono text-[11px]">{u.email}</td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={isSelf}
                          className={`bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-purple-500 transition-colors ${roleColors[u.role] || 'text-slate-200'} ${isSelf ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <option value="TEACHER">TEACHER</option>
                          <option value="STUDENT">STUDENT</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => !isSelf && handleStatusToggle(u.id, u.enabled)}
                          disabled={isSelf}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                            u.enabled 
                              ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/70' 
                              : 'bg-rose-950/70 text-rose-400 border-rose-500/30 hover:bg-rose-900/70'
                          } ${isSelf ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                          title={isSelf ? "Cannot disable your own admin account" : "Click to toggle account status"}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.enabled ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                          <span>{u.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewUser(u)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 border border-slate-700 transition-all"
                            title="View User Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setUserToDelete(u)}
                            disabled={isSelf}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isSelf 
                                ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-40' 
                                : 'bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 border-slate-700 cursor-pointer'
                            }`}
                            title={isSelf ? "Cannot delete yourself" : "Delete User"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Showing <strong className="text-white">{filteredUsers.length > 0 ? (safePage - 1) * pageSize + 1 : 0}</strong> to <strong className="text-white">{Math.min(safePage * pageSize, filteredUsers.length)}</strong> of <strong className="text-white">{filteredUsers.length}</strong> users
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg font-bold text-xs transition-all ${
                  safePage === page
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* VIEW USER MODAL / DRAWER */}
      {/* ==================================================== */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 sm:p-7 space-y-6 shadow-2xl relative bg-slate-950">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-purple-500/20">
                  {selectedUser.fullName?.charAt(0) || selectedUser.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{selectedUser.fullName || 'User Profile'}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Meta Grid */}
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Assigned Role</span>
                </div>
                <div className="font-bold text-purple-300 font-mono text-xs">{selectedUser.role}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Account Status</span>
                </div>
                <div className={`font-bold text-xs ${selectedUser.enabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedUser.enabled ? 'ACTIVE' : 'DISABLED'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Registration Date</span>
                </div>
                <div className="text-slate-200 font-mono text-[11px]">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) : 'Verified Account'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Unique ID</span>
                </div>
                <div className="text-slate-300 font-mono text-[10px] truncate" title={selectedUser.id}>
                  {selectedUser.id}
                </div>
              </div>
            </div>

            {/* Quick Actions inside modal */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Administrative Controls</h4>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => handleStatusToggle(selectedUser.id, selectedUser.enabled)}
                  disabled={currentAdmin?.id === selectedUser.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedUser.enabled
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500/30 hover:bg-rose-900/60'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                  } ${currentAdmin?.id === selectedUser.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {selectedUser.enabled ? 'Disable Account' : 'Activate Account'}
                </button>

                <button
                  onClick={() => {
                    const nextRole = selectedUser.role === 'TEACHER' ? 'STUDENT' : selectedUser.role === 'STUDENT' ? 'ADMIN' : 'TEACHER';
                    handleRoleChange(selectedUser.id, nextRole);
                  }}
                  disabled={currentAdmin?.id === selectedUser.id}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-950/60 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cycle Role ({selectedUser.role})
                </button>

                {currentAdmin?.id !== selectedUser.id && (
                  <button
                    onClick={() => setUserToDelete(selectedUser)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600 hover:text-white transition-all ml-auto flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete User</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ==================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-rose-500/40 p-6 sm:p-7 space-y-5 shadow-2xl bg-slate-950">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Confirm User Deletion</h3>
                <p className="text-xs text-rose-400/80">Permanent, irreversible action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the account for <strong className="text-white">{userToDelete.fullName || userToDelete.email}</strong> (<code className="text-purple-300">{userToDelete.email}</code>)?
            </p>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-[11px] text-rose-300">
              ⚠️ All associated user sessions and access permissions will be immediately revoked.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
