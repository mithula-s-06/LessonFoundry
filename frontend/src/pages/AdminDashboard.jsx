import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi, sourceApi, packApi, auditApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  BookOpen, 
  Activity, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Lock,
  User as UserIcon 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [sources, setSources] = useState([]);
  const [packs, setPacks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statRes, srcRes, packRes, auditRes] = await Promise.all([
          userApi.getStats(),
          sourceApi.getAll(),
          packApi.getAll(),
          auditApi.getLogs()
        ]);
        setStats(statRes.data || {});
        setSources(srcRes.data || []);
        setPacks(packRes.data || []);
        setAuditLogs((auditRes.data || []).slice(0, 10));
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-6 bg-slate-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-900 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Admin Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>System Administration Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administration & Security Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Manage system users, assign role-based permissions (RBAC), and review chronological security audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-purple-200 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 transition-all"
            >
              <UserIcon className="w-4 h-4 text-purple-400" />
              <span>My Profile</span>
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-500/20 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Manage Users</span>
            </Link>
            <Link
              to="/admin/audit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>Full Audit Logs</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</div>
            <div className="text-2xl font-black text-white mt-1">{stats.totalUsers || 0}</div>
            <div className="text-[11px] text-purple-400 mt-1">Active registered accounts</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Teachers</div>
            <div className="text-2xl font-black text-white mt-1">{stats.totalTeachers || 0}</div>
            <div className="text-[11px] text-blue-400 mt-1">Instructors & Creators</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sources Uploaded</div>
            <div className="text-2xl font-black text-white mt-1">{sources.length}</div>
            <div className="text-[11px] text-cyan-400 mt-1">Grounded PDF/TXT datasets</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Learning Packs</div>
            <div className="text-2xl font-black text-white mt-1">{packs.length}</div>
            <div className="text-[11px] text-emerald-400 mt-1">AI Generated Curricula</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* System Activity Trail */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Recent System Audit Trail</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time immutable activity records across all roles.</p>
          </div>
          <Link to="/admin/audit" className="text-xs font-semibold text-purple-400 hover:underline">
            View All Records →
          </Link>
        </div>

        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-300 font-mono text-[11px] uppercase">
                    {log.action?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">By: <strong className="text-white">{log.performedBy}</strong></span>
                  <span className="text-slate-500">({log.userRole})</span>
                </div>
                <p className="text-slate-300 text-[11px]">{log.details}</p>
              </div>
              <div className="text-right text-[11px] text-slate-500 shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
