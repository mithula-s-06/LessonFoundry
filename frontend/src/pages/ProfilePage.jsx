import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/api';
import { Badge } from '../components/common/Badge';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Lock, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  ShieldCheck,
  ArrowLeft,
  Check,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, role, updateUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('general'); // 'general', 'security', 'role'
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Name State
  const [fullName, setFullName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  // Fetch full profile details
  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await authApi.getProfile();
      setProfileData(res.data);
      setFullName(res.data.fullName || user?.fullName || '');
    } catch (err) {
      console.error('Failed to load profile:', err);
      // Fallback to local user
      setProfileData(user);
      setFullName(user?.fullName || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Handle Full Name Update
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      addToast('Full name cannot be blank', 'error');
      return;
    }
    if (fullName.trim() === profileData?.fullName) {
      addToast('No changes made to full name', 'info');
      return;
    }

    setSavingName(true);
    try {
      const res = await authApi.updateProfile({ fullName: fullName.trim() });
      setProfileData(res.data);
      updateUser(res.data);
      addToast('Profile name updated successfully!', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update name';
      addToast(errMsg, 'error');
    } finally {
      setSavingName(false);
    }
  };

  // Handle Password Change
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
      addToast('New password and confirmation do not match', 'error');
      return;
    }
    if (currentPassword === newPassword) {
      addToast('New password must be different from current password', 'warning');
      return;
    }

    setSavingPass(true);
    try {
      const res = await authApi.updateProfile({
        currentPassword,
        newPassword
      });
      setProfileData(res.data);
      updateUser(res.data);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Password changed successfully! Your account is secured.', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to change password. Please check your current password.';
      addToast(errMsg, 'error');
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'STUDENT') return '/student/dashboard';
    return '/teacher/dashboard';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation Bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={getDashboardPath()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Signed in as:</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{profileData?.email || user?.email}</span>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 shadow-xl p-6 sm:p-8 mb-8 text-white">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white shadow-lg shadow-cyan-500/30 border-2 border-white/20">
              {getInitials(profileData?.fullName || user?.fullName)}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-emerald-500 text-white rounded-full ring-4 ring-slate-900 shadow-md" title="Active Account">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* User Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {profileData?.fullName || user?.fullName || 'User Profile'}
              </h1>
              <Badge status={role} />
            </div>

            <p className="text-sm text-cyan-300/90 font-medium flex items-center justify-center sm:justify-start gap-1.5 mb-4">
              <Mail className="w-4 h-4" />
              <span>{profileData?.email || user?.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Joined: <strong>{formatDate(profileData?.createdAt)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Last Active: <strong>{formatDate(profileData?.lastLoginAt)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
              activeTab === 'general'
                ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-cyan-500" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
              activeTab === 'security'
                ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActiveTab('role')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
              activeTab === 'role'
                ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Role & Access</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="lg:col-span-3">
          {/* TAB 1: GENERAL INFORMATION */}
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-500" />
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update your display name and review account information.
                  </p>
                </div>
                <button
                  onClick={loadProfile}
                  title="Refresh profile"
                  className="p-2 text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <form onSubmit={handleUpdateName} className="space-y-6">
                {/* Full Name Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Prof. Sarah Jenkins"
                      className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm font-medium transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    This name is displayed across lesson packs, author attributions, and class audit records.
                  </p>
                </div>

                {/* Email (Read-Only) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileData?.email || user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-sm font-mono cursor-not-allowed select-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Email is locked for account safety and tied to your institution's login credentials.</span>
                  </p>
                </div>

                {/* System Role & Status Info Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Assigned Role</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{role?.toLowerCase()}</span>
                    </div>
                    <Badge status={role} />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Account Status</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active & Verified
                      </span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>

                {/* Submit Name Button */}
                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={savingName || !fullName.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                  >
                    {savingName ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Name Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" />
                  Change Account Password
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Protect your studio credentials by choosing a strong, unique password.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="Enter your current password"
                      className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm font-medium transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Enter new password (min. 6 characters)"
                      className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm font-medium transition-all"
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            newPassword.length < 6
                              ? 'w-1/4 bg-rose-500'
                              : newPassword.length < 9
                              ? 'w-2/3 bg-amber-500'
                              : 'w-full bg-emerald-500'
                          }`}
                        ></div>
                      </div>
                      <span className={`text-[11px] font-bold ${
                        newPassword.length < 6 ? 'text-rose-500' : newPassword.length < 9 ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {newPassword.length < 6 ? 'Too Short' : newPassword.length < 9 ? 'Medium Strength' : 'Strong Password'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Re-type new password"
                      className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm font-medium transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Passwords do not match.</span>
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-[11px] text-emerald-500 font-semibold mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passwords match!</span>
                    </p>
                  )}
                </div>

                {/* Submit Password Button */}
                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={savingPass || !currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    {savingPass ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ROLE & PERMISSIONS OVERVIEW */}
          {activeTab === 'role' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  Role Capabilities & Privileges
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Overview of your account permissions and studio authorization level.
                </p>
              </div>

              {role === 'ADMIN' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-extrabold text-slate-900 dark:text-white">Administrator Access Privileges</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      As an Administrator, you possess full platform governance over user access, role modification, account lifecycle management, and immutable audit logs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Manage, inspect & delete user accounts</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Promote or demote user RBAC roles</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Paginated Audit Trail & activity logs</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>View and manage all generated lesson packs</span>
                    </div>
                  </div>
                </div>
              )}

              {role === 'TEACHER' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Layers className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      <h3 className="font-extrabold text-slate-900 dark:text-white">Educator & Author Privileges</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      You are authorized to upload institutional curriculum materials, trigger constraint-aware RAG pack generation, review pedagogical quality guardrails, and publish learning packs to students.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>Multi-source syllabus & PDF ingestion</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>Generate 7-asset learning packs</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>Targeted asset regeneration & revision</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>Publish approved packs to students</span>
                    </div>
                  </div>
                </div>
              )}

              {role === 'STUDENT' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="font-extrabold text-slate-900 dark:text-white">Student Learner Privileges</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      You have full access to published learning packs, step-by-step worked solutions, interactive practice quizzes with instant feedback, and the grounded AI Study Copilot.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Access verified curriculum study packs</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Submit formative quizzes & get grading</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Ask AI Copilot for step-by-step algebra</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Download revision sheets & practice guides</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
