import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../services/api';
import { Badge } from './Badge';
import { 
  User, 
  Mail, 
  Lock, 
  Key, 
  X, 
  Save, 
  Check, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, role, updateUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'password'
  const [fullName, setFullName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFullName(user?.fullName || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveTab('general');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      addToast('Full name cannot be empty', 'error');
      return;
    }
    if (fullName.trim() === user?.fullName) {
      addToast('No changes made to full name', 'info');
      return;
    }

    setSavingName(true);
    try {
      const res = await authApi.updateProfile({ fullName: fullName.trim() });
      updateUser(res.data);
      addToast('Full name updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update name', 'error');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('Please enter your current password', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      addToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    setSavingPass(true);
    try {
      const res = await authApi.updateProfile({
        currentPassword,
        newPassword
      });
      updateUser(res.data);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Password updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Incorrect current password', 'error');
    } finally {
      setSavingPass(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/20 border-2 border-white/20">
              {getInitials(user?.fullName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-tight">
                  {user?.fullName || 'User Profile'}
                </h3>
                <Badge status={role} />
              </div>
              <p className="text-xs text-cyan-300/90 font-medium flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'password'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'general' ? (
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2 pl-9 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address (Fixed)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3.5 py-2 pl-9 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-mono cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Account Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Profile Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="submit"
                  disabled={savingName || !fullName.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20"
                >
                  {savingName ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 pl-9 pr-9 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password (min. 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2 pl-9 pr-9 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2 pl-9 pr-9 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingPass || !currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 transition-all shadow-md shadow-amber-500/20"
                >
                  {savingPass ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
