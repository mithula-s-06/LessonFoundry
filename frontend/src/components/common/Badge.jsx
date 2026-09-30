import React from 'react';

export const Badge = ({ status, type = 'default', className = '' }) => {
  const getBadgeStyle = () => {
    switch (status?.toUpperCase()) {
      case 'READY':
      case 'APPROVED':
      case 'PUBLISHED':
      case 'PASS':
      case 'COVERED':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30';
      case 'PROCESSING':
      case 'IN_REVIEW':
      case 'DRAFT':
        return 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 animate-pulse';
      case 'PARTIALLY_COVERED':
      case 'WARNING':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30';
      case 'NEEDS_REVISION':
      case 'FAILED':
      case 'ERROR':
      case 'NOT_COVERED':
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30';
      case 'ADMIN':
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30';
      case 'TEACHER':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30';
      case 'STUDENT':
        return 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700';
    }
  };

  const getLabel = () => {
    if (!status) return 'UNKNOWN';
    if (status.toUpperCase() === 'DRAFT') return 'IN REVIEW';
    return status.replace(/_/g, ' ');
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getBadgeStyle()} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {getLabel()}
    </span>
  );
};
