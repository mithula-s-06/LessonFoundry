import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';
import { QuickStartGuideModal } from './QuickStartGuideModal';
import { ConfirmModal } from './ConfirmModal';
import { ProfileModal } from './ProfileModal';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  FileText, 
  Users, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  GraduationCap,
  HelpCircle,
  User
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const handleConfirmLogout = () => {
    setShowSignoutModal(false);
    logout();
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
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-xl print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to={isAuthenticated ? `/${role?.toLowerCase()}/dashboard` : '/'} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    LessonFoundry
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                    Constraint-Aware GenAI Studio
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/') && location.pathname === '/' ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                    Overview
                  </Link>
                  <a href="/#features" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    Features
                  </a>
                  <a href="/#how-it-works" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    Workflow
                  </a>
                </>
              ) : (
                <>
                  {role === 'TEACHER' && (
                    <>
                      <Link to="/teacher/dashboard" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isActive('/teacher/dashboard') ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                        <Layers className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link to="/teacher/packs" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isActive('/teacher/packs') ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                        <BookOpen className="w-4 h-4" />
                        Learning Packs
                      </Link>
                      <Link to="/teacher/generate" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all hover:scale-105">
                        <PlusCircle className="w-4 h-4" />
                        Create Pack
                      </Link>
                    </>
                  )}

                  {role === 'STUDENT' && (
                    <>
                      <Link to="/student/dashboard" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/student/dashboard') ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                        <GraduationCap className="w-4 h-4" />
                        Study Catalog
                      </Link>
                    </>
                  )}

                  {role === 'ADMIN' && (
                    <>
                      <Link to="/admin/dashboard" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/dashboard') ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                        <ShieldCheck className="w-4 h-4" />
                        Admin Hub
                      </Link>
                      <Link to="/admin/users" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/users') ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                        <Users className="w-4 h-4" />
                        Users & RBAC
                      </Link>
                      <Link to="/admin/audit" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/audit') ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                        <FileText className="w-4 h-4" />
                        Audit Logs
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Controls: Quick Tour + User Auth */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Quick Tour Button */}
              <button
                onClick={() => setGuideOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title="Open Interactive Guided Tour"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Guide</span>
              </button>

              {!isAuthenticated ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <Link to="/login" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors">
                    Sign In
                  </Link>
                  <Link to="/login?mode=signup" className="px-3.5 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-md shadow-cyan-500/20 transition-all">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
                  {/* Profile Link Card */}
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all border group ${
                      isActive('/profile')
                        ? 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-300 dark:border-cyan-500/40 shadow-sm'
                        : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                    title="View & Edit Profile"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm group-hover:scale-105 transition-transform">
                      {getInitials(user?.fullName)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {user?.fullName}
                      </span>
                      <div className="mt-0.5">
                        <Badge status={role} />
                      </div>
                    </div>
                  </Link>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => setShowSignoutModal(true)}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg focus:outline-none"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => { setMobileOpen(false); setGuideOpen(true); }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 rounded-lg border border-cyan-200 dark:border-cyan-500/30"
              >
                <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Interactive Guide / Tour</span>
              </button>
            </div>

            {!isAuthenticated ? (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                  Overview
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                  Sign In
                </Link>
                <Link to="/login?mode=signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {getInitials(user?.fullName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{user?.fullName}</span>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">View & Edit Profile</span>
                    </div>
                  </div>
                  <Badge status={role} />
                </Link>

                {role === 'TEACHER' && (
                  <>
                    <Link to="/teacher/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</Link>
                    <Link to="/teacher/packs" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">Learning Packs</Link>
                    <Link to="/teacher/generate" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-cyan-600 dark:text-cyan-400 font-bold">Create New Pack</Link>
                  </>
                )}
                {role === 'STUDENT' && (
                  <Link to="/student/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">Study Catalog</Link>
                )}
                {role === 'ADMIN' && (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">Admin Hub</Link>
                    <Link to="/admin/users" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">Users & RBAC</Link>
                    <Link to="/admin/audit" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">Audit Logs</Link>
                  </>
                )}
                <button
                  onClick={() => { setMobileOpen(false); setShowSignoutModal(true); }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md font-semibold flex items-center gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        isOpen={showSignoutModal}
        onClose={() => setShowSignoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        type="danger"
      />

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* Interactive Guide Modal */}
      <QuickStartGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
};
