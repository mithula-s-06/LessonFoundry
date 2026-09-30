import React, { useState, useEffect } from 'react';
import { auditApi } from '../services/api';
import { 
  Activity, 
  Search, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Filter,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';

export const AdminAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditApi.getLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      (l.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.performedBy || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.details || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.resourceType || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'ALL' || (l.action && l.action.startsWith(actionFilter));
    return matchesSearch && matchesAction;
  });

  // 10 logs per page calculation
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const displayedLogs = filteredLogs.slice((safePage - 1) * pageSize, safePage * pageSize);

  const getActionBadgeStyle = (action = '') => {
    if (action.includes('USER')) {
      return 'bg-purple-950/80 text-purple-300 border-purple-500/30';
    }
    if (action.includes('PACK') || action.includes('ASSET')) {
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
    }
    if (action.includes('SOURCE')) {
      return 'bg-blue-950/80 text-blue-300 border-blue-500/30';
    }
    if (action.includes('LOGIN') || action.includes('LOGOUT')) {
      return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Security & Compliance Auditing</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-purple-400" />
            <span>Immutable System Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological, tamper-evident logs for all curriculum generations, user access changes, and security events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold">
            Total Recorded Events: <strong className="text-purple-400 ml-1">{logs.length}</strong>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
            placeholder="Search by action, operator email, or details..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 shrink-0 font-medium">Category:</span>
          {[
            { label: 'ALL', prefix: 'ALL' },
            { label: 'USER', prefix: 'USER' },
            { label: 'PACKS', prefix: 'PACK' },
            { label: 'ASSETS', prefix: 'ASSET' },
            { label: 'SOURCES', prefix: 'SOURCE' },
          ].map(f => (
            <button
              key={f.label}
              onClick={() => {
                setActionFilter(f.prefix);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                actionFilter === f.prefix 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Action Event</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Resource Target</th>
                <th className="p-4">Event Details</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                      <span>Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No audit records found matching your filters.
                  </td>
                </tr>
              ) : (
                displayedLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <span className={`font-mono font-bold uppercase text-[10px] px-2.5 py-1 rounded-lg border inline-block ${getActionBadgeStyle(log.action)}`}>
                        {log.action?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{log.performedBy}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Role: <span className="text-purple-300 font-semibold">{log.userRole}</span></div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {log.resourceType || 'SYSTEM'}
                      </span>
                      {log.resourceId && (
                        <div className="text-[10px] text-slate-500 font-mono mt-1 truncate max-w-[120px]" title={log.resourceId}>
                          ID: {log.resourceId.substring(0, 8)}...
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-300 max-w-md">
                      <div className="text-xs leading-relaxed">{log.details}</div>
                    </td>
                    <td className="p-4 text-right text-[11px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 10 Logs Per Page Pagination Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Showing logs <strong className="text-white">{filteredLogs.length > 0 ? (safePage - 1) * pageSize + 1 : 0}</strong> to <strong className="text-white">{Math.min(safePage * pageSize, filteredLogs.length)}</strong> of <strong className="text-white">{filteredLogs.length}</strong> events (10 per page)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous 10</span>
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
              <span>Next 10</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
