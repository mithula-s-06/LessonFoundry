import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  Target, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  RefreshCw, 
  ShieldCheck, 
  History, 
  ArrowRight, 
  FileCheck2, 
  BookOpen, 
  Lock, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-cyan-900/20 dark:via-slate-950/80 dark:to-slate-950 bg-gradient-to-b from-sky-50/70 via-indigo-50/30 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-8 shadow-sm animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Constraint-Aware Educational AI Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Turn trusted teaching material into <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400">classroom-ready learning packs</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Turn trusted teaching material into consistent, classroom-ready learning packs with grounded Generative AI.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-all shadow-sm"
            >
              <span>Sign In</span>
            </Link>
          </div>

          {/* Studio Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl glass-panel p-2.5 sm:p-4 border border-slate-200 dark:border-slate-700/80 shadow-2xl glow-blue">
            <div className="bg-white dark:bg-slate-900/90 rounded-xl p-6 border border-slate-200 dark:border-slate-800/80 text-left shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">LessonFoundry Studio / Pack Generator</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                    Source Grounded: 100%
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30">
                    Alignment: Verified
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-sm">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider mb-1">Source Context</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">NCERT Chapter 2: Linear Equations</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Chunk #14 • Page 12 • 4 Key Rules Extracted</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">Learning Contract</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">3 Specific Objectives Defined</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Grade 8 • Beginner to Intermediate</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Generated Pack</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">7 Inter-Consistent Assets</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Explanation • Quiz • Practice • Revision</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xs uppercase font-bold text-rose-500 dark:text-rose-400 tracking-widest mb-3">The Educator's Challenge</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Generic AI Fails the Classroom
            </h3>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Teachers spend significant time converting trusted source material into Explanations, Worked Examples, Quizzes, Practice, and Revision material—and manually checking whether all generated material is consistent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-2xl glass-card border border-rose-500/20 hover:border-rose-500/40 transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 border border-rose-200 dark:border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Hallucinations & Drift</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generic chatbots introduce off-syllabus facts, unfamiliar notation, or unsolvable questions not covered in the approved textbook.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-rose-500/20 hover:border-rose-500/40 transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 border border-rose-200 dark:border-rose-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Cross-Asset Discrepancies</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Quiz questions often don't match the answer key, practice sets ignore the stated grade difficulty, and explanations skip target objectives.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-rose-500/20 hover:border-rose-500/40 transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 border border-rose-200 dark:border-rose-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Lack of Versioning & Provenance</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Regenerating content typically wipes out the entire pack instead of letting the teacher fine-tune a single question with preserved provenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Pipeline Section */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-widest mb-3">The LessonFoundry Solution</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            End-to-End Grounded Generation Pipeline
          </h3>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            From raw curriculum PDF to fully verified, multi-asset learning packs with teacher oversight.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: '1. Source Upload', icon: FileText, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/20' },
              { label: '2. Objectives Contract', icon: Target, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-500/20' },
              { label: '3. Grounded Generation', icon: Cpu, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/20' },
              { label: '4. Guardrails & Validation', icon: ShieldCheck, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/20' },
              { label: '5. Teacher Review', icon: FileCheck2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/20' },
              { label: '6. Published Pack', icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/20' },
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl glass-card border border-slate-200 dark:border-slate-700/80 shadow-sm">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${step.bg}`}>
                    <step.icon className={`w-3.5 h-3.5 ${step.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{step.label}</span>
                </div>
                {idx < 5 && <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 hidden lg:block" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 border-t border-slate-200/80 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-widest mb-3">Studio Capabilities</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for Rigorous Educational Workflows
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                title: 'Source Grounding',
                desc: 'Upload PDFs or texts. AI extracts and indexes semantic chunks with vector retrieval to eliminate hallucinations.',
                icon: FileText,
                glow: 'hover:border-cyan-500/50',
                color: 'text-cyan-600 dark:text-cyan-400',
                bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/20'
              },
              {
                title: 'Objective Alignment',
                desc: 'Every asset is mapped to teacher objectives with calculated coverage matrices (Covered, Partial, Not Covered).',
                icon: Target,
                glow: 'hover:border-sky-500/50',
                color: 'text-sky-600 dark:text-sky-400',
                bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-500/20'
              },
              {
                title: 'AI Generation',
                desc: 'Generates 7 complete assets: Explanation, Worked Example, Formative Quiz, Answer Key, Practice, and Revision.',
                icon: Cpu,
                glow: 'hover:border-indigo-500/50',
                color: 'text-indigo-600 dark:text-indigo-400',
                bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/20'
              },
              {
                title: 'Consistency Checking',
                desc: 'Automated guardrails verify quiz questions match answer keys, examples match theory, and difficulty matches grade.',
                icon: ShieldCheck,
                glow: 'hover:border-purple-500/50',
                color: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/20'
              },
              {
                title: 'Provenance Traceability',
                desc: 'Every generated claim, question, and formula links back to the exact chunk ID, page number, and source quote.',
                icon: FileCheck2,
                glow: 'hover:border-emerald-500/50',
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/20'
              },
              {
                title: 'Controlled Regeneration',
                desc: 'Regenerate a single question or asset with specific pedagogical feedback without wiping the rest of the pack.',
                icon: RefreshCw,
                glow: 'hover:border-amber-500/50',
                color: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/20'
              },
              {
                title: 'Teacher Approval',
                desc: 'Complete review workflow: Draft, Approved, Needs Revision. Teacher retains full editorial sovereignty.',
                icon: CheckCircle2,
                glow: 'hover:border-cyan-500/50',
                color: 'text-cyan-600 dark:text-cyan-400',
                bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/20'
              },
              {
                title: 'Version History',
                desc: 'Full immutable version tracking. Inspect v1 vs v2 changes, revision reasons, and timestamps.',
                icon: History,
                glow: 'hover:border-pink-500/50',
                color: 'text-pink-600 dark:text-pink-400',
                bg: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-500/20'
              },
            ].map((feat, idx) => (
              <div key={idx} className={`p-6 rounded-2xl glass-card transition-all duration-200 border border-slate-200 dark:border-slate-800 ${feat.glow} hover:-translate-y-1 hover:shadow-lg`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${feat.bg}`}>
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h4>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/60 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-cyan-500 dark:text-cyan-400 tracking-widest mb-3">Workflow</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              7 Simple Steps to Classroom Excellence
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              A structured, human-in-the-loop curriculum authoring experience designed for pedagogical accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Upload Source',
                desc: 'Upload textbook chapter, lecture notes, or PDF curriculum.',
                icon: FileText,
                iconColor: 'text-cyan-500 dark:text-cyan-400',
                bgTint: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/20'
              },
              {
                title: 'Define Objectives',
                desc: 'Specify grade level, difficulty, and learning objective contract.',
                icon: Target,
                iconColor: 'text-sky-500 dark:text-sky-400',
                bgTint: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-500/20'
              },
              {
                title: 'Generate Pack',
                desc: 'AI executes RAG retrieval and synthesizes the full learning pack.',
                icon: Cpu,
                iconColor: 'text-indigo-500 dark:text-indigo-400',
                bgTint: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/20'
              },
              {
                title: 'Validate',
                desc: 'Review automated alignment matrix and cross-asset consistency guardrails.',
                icon: ShieldCheck,
                iconColor: 'text-purple-500 dark:text-purple-400',
                bgTint: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/20'
              },
              {
                title: 'Review & Refine',
                desc: 'Inspect provenance or regenerate individual questions with custom prompts.',
                icon: RefreshCw,
                iconColor: 'text-amber-500 dark:text-amber-400',
                bgTint: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/20'
              },
              {
                title: 'Approve',
                desc: 'Mark individual assets as approved with full version history logging.',
                icon: CheckCircle2,
                iconColor: 'text-emerald-500 dark:text-emerald-400',
                bgTint: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/20'
              },
              {
                title: 'Publish',
                desc: 'Make approved learning packs accessible in Student Mode.',
                icon: BookOpen,
                iconColor: 'text-teal-500 dark:text-teal-400',
                bgTint: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-500/20'
              },
            ].map((st, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl glass-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-4 ${st.bgTint}`}>
                    <st.icon className={`w-5 h-5 ${st.iconColor}`} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {st.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/60 bg-gradient-to-b from-slate-50 via-cyan-50/30 to-white dark:from-slate-950 dark:to-cyan-950/30 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to build constraint-aware learning assets?
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Experience the precision of grounded generative AI tailored for teachers, curriculum designers, and students.
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
            >
              <span>Create Your First Learning Pack</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">LessonFoundry</span>
            <span className="text-slate-400 dark:text-slate-500">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-cyan-600 dark:hover:text-slate-200 transition-colors">About</Link>
            <a href="#features" className="hover:text-cyan-600 dark:hover:text-slate-200 transition-colors">Features</a>
            <Link to="/login" className="hover:text-cyan-600 dark:hover:text-slate-200 transition-colors">Sign In</Link>
            <Link to="/login" className="hover:text-cyan-600 dark:hover:text-slate-200 transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
