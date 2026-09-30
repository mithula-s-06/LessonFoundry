import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Overlay Container - Always on top, high visibility */}
      <div className="fixed top-6 right-6 z-[10000] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-fade-in transition-all ${
              t.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/95 dark:border-emerald-500/50 dark:text-emerald-100 shadow-emerald-500/10'
                : t.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-950 dark:bg-rose-950/95 dark:border-rose-500/50 dark:text-rose-100 shadow-rose-500/10'
                : t.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/95 dark:border-amber-500/50 dark:text-amber-100 shadow-amber-500/10'
                : 'bg-cyan-50 border-cyan-300 text-cyan-950 dark:bg-cyan-950/95 dark:border-cyan-500/50 dark:text-cyan-100 shadow-cyan-500/10'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />}
            
            <p className="text-xs font-semibold flex-1 leading-snug">{t.message}</p>
            
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 rounded transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
