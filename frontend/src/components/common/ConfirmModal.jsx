import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, AlertTriangle, HelpCircle, CheckCircle2, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary', // 'primary' | 'danger' | 'success'
  loading = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const getStyle = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-rose-500 dark:text-rose-400" />,
          badgeBg: 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30',
          btnBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30',
          border: 'border-rose-300 dark:border-rose-500/30'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
          badgeBg: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
          btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/30',
          border: 'border-emerald-300 dark:border-emerald-500/30'
        };
      default:
        return {
          icon: <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
          badgeBg: 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30',
          btnBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/30',
          border: 'border-cyan-300 dark:border-cyan-500/30'
        };
    }
  };

  const currentStyle = getStyle();

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md"
      onClick={(e) => {
        if (!loading && e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`relative w-full max-w-md rounded-3xl border ${currentStyle.border} bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-7 overflow-hidden z-10 text-slate-900 dark:text-slate-100 animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${currentStyle.badgeBg} border shrink-0`}>
            {currentStyle.icon}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 ${currentStyle.btnBg}`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
