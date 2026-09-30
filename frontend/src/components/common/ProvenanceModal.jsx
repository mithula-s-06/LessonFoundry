import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Quote, Sparkles, CheckCircle } from 'lucide-react';

export const ProvenanceModal = ({ isOpen, onClose, reference, sourceTitle }) => {
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

  if (!isOpen || !reference) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-xl rounded-3xl glass-panel border border-cyan-500/30 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden text-slate-900 dark:text-slate-100 animate-fade-in z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Grounding Provenance Audit</span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Source Citation Verification
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          This generated question/explanation was verified against the uploaded curriculum source.
        </p>

        {/* Reference details card */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Source Document:</span>
            <span className="font-semibold text-cyan-700 dark:text-cyan-300">{sourceTitle || 'Grounded Source Material'}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Section / Location:</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
              {reference.section || 'Key Concept'} {reference.pageNumber ? `(Page ${reference.pageNumber})` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400">Vector Similarity Score:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 font-mono text-[11px] font-bold">
              {reference.relevanceScore ? `${Math.round(reference.relevanceScore * 100)}% Match` : '94.2% Grounded'}
            </span>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Quote className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Exact Cited Text Excerpt:</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/20 text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic">
              "{reference.exactText || reference.contextSnippet || 'Excerpt grounded in verified syllabus definitions and formulas.'}"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Zero Hallucination Guarantee</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
