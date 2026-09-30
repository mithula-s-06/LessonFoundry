import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`relative w-full ${maxWidth} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] z-10 text-slate-900 dark:text-slate-100 animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors shrink-0 ml-3"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-3.5 overflow-y-auto flex-1 pr-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
