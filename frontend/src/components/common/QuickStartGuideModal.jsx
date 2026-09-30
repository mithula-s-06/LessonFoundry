import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  Upload, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sliders, 
  GraduationCap,
  Play
} from 'lucide-react';

export const QuickStartGuideModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

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

  const steps = [
    {
      title: 'Ingest Trusted Educational Material',
      subtitle: 'Upload textbooks, lecture notes, or syllabus excerpts',
      icon: <Upload className="w-8 h-8 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-500/20',
      badge: 'Grounded Ingestion',
      description:
        'LessonFoundry never hallucinates from generic internet data. It chunks, tokenizes, and vectorizes your uploaded PDF or textbook notes into searchable knowledge embeddings.',
      tip: 'You can also use our 1-click built-in sample chapters (e.g. Newton’s Laws or Linear Equations) to test instantly!'
    },
    {
      title: 'Declare Explicit Learning Objectives',
      subtitle: 'Define Bloom-level goals and target academic level/difficulty',
      icon: <Target className="w-8 h-8 text-indigo-400" />,
      color: 'from-indigo-500/20 to-purple-500/20',
      badge: 'Constraint Contract',
      description:
        'Specify exactly what students should learn (e.g., OBJ-1: State fundamental theorem; OBJ-2: Solve real-world problem sets). Choose target level (Undergraduate, Higher Ed, High School) and difficulty tiers.',
      tip: 'Use our 1-click syllabus presets to auto-populate high-yield learning objectives in 1 second.'
    },
    {
      title: 'Generate 6 Coordinated Learning Assets',
      subtitle: 'A single generation produces an internally consistent pack',
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/20',
      badge: 'Multi-Asset Generation',
      description:
        'In seconds, LessonFoundry crafts: (1) Concept Explanation, (2) Step-by-Step Worked Example, (3) Formative Quiz, (4) Master Answer Key, (5) Differentiated Practice (Level 1 Foundation & Level 2 Extension), and (6) Quick Revision Sheet.',
      tip: 'Every single question references its exact source chapter chunk and learning objective.'
    },
    {
      title: 'Teacher Review & Single-Item Regeneration',
      subtitle: 'Full human-in-the-loop auditability and control',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/20',
      badge: 'Human Review',
      description:
        'Review the automated Objective Alignment Coverage Matrix (100% Bloom target coverage) and Quality Guardrails. Dislike a question? Regenerate just that single item with custom constraints without losing the rest of your pack!',
      tip: 'Version history (v1 -> v2) is preserved in immutable audit logs.'
    },
    {
      title: 'Export Handouts & Student Interactive Mode',
      subtitle: 'Print clean worksheets or publish to the Student Study Portal',
      icon: <GraduationCap className="w-8 h-8 text-pink-400" />,
      color: 'from-pink-500/20 to-rose-500/20',
      badge: 'Classroom Ready',
      description:
        'Once approved, switch to Student Preview Mode, export formatted Markdown, print clean classroom handouts without answer keys, or publish so students can take interactive quizzes online with instant scoring.',
      tip: 'Answers and explanations are automatically hidden from student test views.'
    }
  ];

  const current = steps[step];

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10 text-slate-900 dark:text-slate-100 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Tour • Step {step + 1} of {steps.length}</span>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-5 gap-2 my-4">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === step ? 'bg-cyan-500 shadow-sm shadow-cyan-400/50' : idx < step ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Card Content */}
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${current.color} border border-slate-200 dark:border-slate-700/60 my-6 transition-all`}>
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-inner shrink-0">
              {current.icon}
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 mb-2">
                {current.badge}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{current.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-200 mt-4 leading-relaxed">
            {current.description}
          </p>

          <div className="mt-4 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-xs text-cyan-800 dark:text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>Pro Tip:</strong> {current.tip}</span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Got it! Start Creating</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
