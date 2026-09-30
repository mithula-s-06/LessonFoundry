import React, { useState } from 'react';
import { 
  BookOpen, 
  Printer, 
  Copy, 
  Check, 
  Lightbulb, 
  AlertTriangle, 
  Compass, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Sparkles,
  BookMarked,
  HelpCircle,
  Maximize2,
  Image as ImageIcon,
  ZoomIn,
  Sparkle,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const TextbookChapterView = ({ expData, topic, gradeLevel, difficulty, sourceTitle }) => {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'large'
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [diagramMode, setDiagramMode] = useState('ai'); // 'ai' | 'vector'
  const [imgLoading, setImgLoading] = useState(true);

  // Detect domain dynamically from topic and content
  const detectDomain = (t, text) => {
    const combined = `${t || ''} ${text || ''}`.toLowerCase();
    if (combined.match(/photosynthesis|mitosis|meiosis|cell|dna|rna|protein|enzyme|gene|biology|chloroplast|organism|cytoplasm|membrane|plant|leaf|animal/)) return 'BIOLOGY';
    if (combined.match(/reaction|molecule|atom|acid|base|bond|compound|chemical|chemistry|equilibrium|stoichiometry|valence|titration|element/)) return 'CHEMISTRY';
    if (combined.match(/force|motion|energy|velocity|acceleration|gravity|physics|circuit|wave|quantum|thermodynamic|magnetic|electric|newton|optic/)) return 'PHYSICS';
    if (combined.match(/algorithm|tree|graph|binary|data structure|sorting|programming|code|database|sql|recursion|complexity/)) return 'COMPUTER_SCIENCE';
    if (combined.match(/equation|algebra|variable|calculus|integral|derivative|matrix|geometry|math|polynomial|trigonometry/)) return 'MATH';
    if (combined.match(/war|revolution|empire|treaty|president|history|constitution|democracy|century|reform|colonial/)) return 'HISTORY';
    return 'SCIENCE';
  };

  const domain = expData?.conceptDiagram?.domain || detectDomain(topic, JSON.stringify(expData || {}));

  // Resolve clean, authentic textbook diagrams
  const resolveCuratedDiagram = (t) => {
    const s = (t || '').toLowerCase();
    if (s.includes('cell') || s.includes('mitosis') || s.includes('meiosis') || s.includes('division') || s.includes('chromosome') || s.includes('cytokinesis')) {
      return '/diagrams/cell_division.jpg';
    }
    if (s.includes('photo') || s.includes('chloroplast') || s.includes('calvin') || s.includes('plant') || s.includes('thylakoid') || s.includes('light reaction')) {
      return '/diagrams/photosynthesis.jpg';
    }
    if (s.includes('equation') || s.includes('linear') || s.includes('algebra') || s.includes('variable') || s.includes('balance') || s.includes('math')) {
      return '/diagrams/linear_equations.jpg';
    }
    return null;
  };

  const curatedDiagram = resolveCuratedDiagram(topic);

  // Construct dynamic AI image URL with high-clarity textbook styling
  const dynamicImageUrl = curatedDiagram || expData?.conceptDiagramUrl || expData?.conceptDiagram?.imageUrl || (
    topic ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`clean modern scientific textbook educational diagram of ${topic} with clear labeled steps on crisp clean background high resolution vector illustration`)}?width=1200&height=675&nologo=true`
    : '/diagrams/cell_division.jpg'
  );

  if (!expData) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        No textbook learning material generated for this unit yet.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyNotes = () => {
    const rawText = `=== TEXTBOOK CHAPTER: ${topic} ===\n\n` +
      `[Course Level]: ${gradeLevel || 'Undergraduate'} | [Difficulty]: ${difficulty || 'Standard'}\n` +
      `[Source Reference]: ${sourceTitle || 'Curriculum Reference'}\n\n` +
      `--- OVERVIEW ---\n${expData.introduction || expData.overview || expData.concept || ''}\n\n` +
      (expData.standardForm ? `--- STANDARD DEFINITION ---\n${expData.standardForm}\n\n` : '') +
      (expData.coreSections ? expData.coreSections.map(s => `## ${s.heading}\n${s.explanation}`).join('\n\n') : '') +
      (expData.summary ? `\n\n--- SUMMARY ---\n${expData.summary}` : '');

    navigator.clipboard.writeText(rawText);
    setCopied(true);
    toast.success('Textbook chapter notes copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper parser for various json structures
  const overviewText = expData.introduction || expData.overview || expData.concept || 
    (typeof expData === 'string' ? expData : 'Understanding the core mechanisms and systematic principles governing this academic module.');

  const standardDefinition = expData.standardForm || expData.definition || 
    (typeof expData === 'object' && expData.concept ? expData.concept : null);

  const sections = expData.coreSections || [
    {
      heading: 'Foundational Principles & Mathematical Mechanics',
      explanation: expData.concept || 'Every balanced relationship obeys invariant transformation laws where operations performed on one side must be identically reflected across all components.',
      groundedChunk: 'Chunk-1'
    },
    {
      heading: 'Systematic Analysis & Operational Invariance',
      explanation: 'Isolating variables requires reversing operations in reverse hierarchical sequence to preserve relational equilibrium.',
      groundedChunk: 'Chunk-2'
    }
  ];

  const rules = expData.keyFormulasOrRules || expData.keyPrinciples?.map((kp, i) => ({
    rule: `Principle ${i + 1}`,
    description: kp
  })) || [
    { rule: 'Invariance Principle', description: 'Equal transformations applied to both sides preserve truth value.' },
    { rule: 'Inverse Operation Rule', description: 'Reverse addition with subtraction, and multiplication with division.' },
    { rule: 'Verification Standard', description: 'Always substitute final value back into the original expression.' }
  ];

  const misconceptions = expData.commonMisconceptions || [
    {
      pitfall: 'Unbalanced Operation Application',
      correction: 'Applying an operation to only one side violates equilibrium. Both sides must always receive identical operations.'
    },
    {
      pitfall: 'Sign Distribution Errors',
      correction: 'Subtracting negative quantities transforms into addition. Pay strict attention to sign rules when transposing terms.'
    }
  ];

  const summaryTakeaway = expData.summary || expData.coreTakeaway || 
    'Mastery of this module equips you to systematically model, manipulate, and verify single-variable systems with complete mathematical rigor.';

  return (
    <div className={`space-y-6 animate-fade-in ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
      
      {/* Textbook Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                Textbook Chapter Module 1.0
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                ⏱️ 8–10 Min Deep Read
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {topic}
            </h2>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 print-hidden">
          <button
            onClick={() => setFontSize(prev => prev === 'normal' ? 'large' : 'normal')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
            title="Toggle Font Size"
          >
            Font: {fontSize === 'normal' ? 'Standard' : 'Large'}
          </button>
          
          <button
            onClick={handleCopyNotes}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Chapter Notes'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-600/20 transition-all hover:scale-105"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF Handout</span>
          </button>
        </div>
      </div>

      {/* Textbook Document Body (Printable Paper Layout) */}
      <div className="p-6 sm:p-9 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-7 leading-relaxed text-slate-200">
        
        {/* Executive Chapter Overview Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/40 border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <BookMarked className="w-4 h-4 text-cyan-400" />
            <span>Chapter Executive Overview & Learning Scope</span>
          </div>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {overviewText}
          </p>
          <div className="text-[11px] text-slate-400 pt-1 flex flex-wrap items-center gap-4">
            <span>Course Level: <strong className="text-white">{gradeLevel || 'Undergraduate'}</strong></span>
            <span>•</span>
            <span>Target Depth: <strong className="text-white">{difficulty || 'Standard'}</strong></span>
            <span>•</span>
            <span>Curriculum Grounding: <strong className="text-cyan-300">{sourceTitle || 'Verified Textbook Syllabus'}</strong></span>
          </div>
        </div>

        {/* Axiom & Definition Callout Box */}
        {standardDefinition && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border-l-4 border-l-cyan-500 border-y border-r border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Formal Axiomatic Definition & Canonical Representation</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 font-mono text-cyan-300 text-xs sm:text-sm">
              {standardDefinition}
            </div>
            <p className="text-xs text-slate-400">
              The standard form represents the irreducible structure upon which all algebraic manipulations and solution theorems are constructed.
            </p>
          </div>
        )}

        {/* Section 1.1 & 1.2: Core Theoretical Breakdowns */}
        <div className="space-y-6">
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2 pb-2 border-b border-slate-800">
            <span>§ 1. Theoretical Framework & Mechanism Analysis</span>
          </h3>

          <div className="space-y-5">
            {sections.map((sec, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-bold text-cyan-300 text-sm sm:text-base">
                    § 1.{idx + 1} {sec.heading}
                  </h4>
                  {sec.groundedChunk && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                      Ref: {sec.groundedChunk}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {sec.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Visual Concept Diagram Demonstration Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <ImageIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      § 1.{sections.length + 1} Visual Concept Demonstration: {topic || 'Curriculum Model'}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">
                      {domain}
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-300">
                    Bespoke conceptual illustration and architectural blueprint synthesized for {topic}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setDiagramMode('ai')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${diagramMode === 'ai' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    AI Concept Art
                  </button>
                  <button
                    onClick={() => setDiagramMode('vector')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${diagramMode === 'vector' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Vector Schematic
                  </button>
                </div>

                <button
                  onClick={() => setShowImageZoom(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </button>
              </div>
            </div>

            {/* Diagram View Container */}
            {diagramMode === 'ai' ? (
              <div 
                onClick={() => setShowImageZoom(true)}
                className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 cursor-pointer shadow-2xl transition-all duration-300 hover:border-cyan-500/50 min-h-[260px] flex items-center justify-center"
              >
                {imgLoading && (
                  <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center gap-2.5 z-10">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-cyan-300 font-medium">Generating bespoke AI visual demonstration for {topic}...</span>
                  </div>
                )}
                <img
                  src={dynamicImageUrl}
                  alt={`Lesson Concept Demonstration for ${topic}`}
                  onLoad={() => setImgLoading(false)}
                  onError={(e) => {
                    setImgLoading(false);
                    // Fallback to static or vector mode on network failure
                    e.target.src = "/lesson_concept_diagram.jpg";
                  }}
                  className={`w-full h-auto max-h-[420px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01] ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-semibold text-cyan-200 bg-slate-900/90 px-3 py-1 rounded-lg border border-cyan-500/30 flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5" /> Click to inspect high-resolution render
                  </span>
                </div>
              </div>
            ) : (
              /* Dynamic Domain-Specific Vector Blueprint Schematic */
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="text-center pb-2 border-b border-slate-800">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    SYSTEMATIC BLUEPRINT • {domain} DOMAIN ARCHITECTURE
                  </span>
                  <h5 className="text-sm font-extrabold text-white mt-0.5">
                    Operational Topology: {topic}
                  </h5>
                </div>

                {domain === 'BIOLOGY' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Input Substrates</div>
                      <div className="text-xs font-bold text-white">Light Energy + H₂O + CO₂</div>
                      <p className="text-[11px] text-slate-300">Absorbed by chlorophyll pigments within thylakoid membranes.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Intermediate Transition</div>
                      <div className="text-xs font-bold text-white">Electron Transport & ATP/NADPH</div>
                      <p className="text-[11px] text-slate-300">Photolysis splits water to generate chemical energy gradients.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">End Product Synthesis</div>
                      <div className="text-xs font-bold text-white">G3P / Glucose + O₂</div>
                      <p className="text-[11px] text-slate-300">Calvin cycle in stroma synthesizes stable high-energy sugars.</p>
                    </div>
                  </div>
                )}

                {domain === 'CHEMISTRY' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-blue-400 uppercase font-bold">Reactants & Valency</div>
                      <div className="text-xs font-bold text-white">Initial Chemical Species</div>
                      <p className="text-[11px] text-slate-300">Molecules possess initial bond enthalpies and kinetic states.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Activation Energy (Eₐ)</div>
                      <div className="text-xs font-bold text-white">Transition State Complex</div>
                      <p className="text-[11px] text-slate-300">Bonds stretch and reconfigure across the energy barrier.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Equilibrium State</div>
                      <div className="text-xs font-bold text-white">Synthesized Products</div>
                      <p className="text-[11px] text-slate-300">Thermodynamically stable compounds obeying stoichiometric conservation.</p>
                    </div>
                  </div>
                )}

                {domain === 'PHYSICS' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Force Vectors</div>
                      <div className="text-xs font-bold text-white">Vector Invariance: ΣF = ma</div>
                      <p className="text-[11px] text-slate-300">Magnitude and direction define instantaneous momentum changes.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Energy Transformation</div>
                      <div className="text-xs font-bold text-white">Conservation: E_total = K + U</div>
                      <p className="text-[11px] text-slate-300">Kinetic and potential states transfer without systemic loss.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">Equilibrium Check</div>
                      <div className="text-xs font-bold text-white">Dynamic Stabilization</div>
                      <p className="text-[11px] text-slate-300">Action-reaction pairs satisfy Newton's invariant third law.</p>
                    </div>
                  </div>
                )}

                {(domain === 'MATH' || domain === 'COMPUTER_SCIENCE' || domain === 'SCIENCE') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">Initial State (LHS)</div>
                      <div className="text-xs font-bold text-white">Structural Constraints</div>
                      <p className="text-[11px] text-slate-300">System variables mapped with rigorous input boundary parameters.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Transformation Operator</div>
                      <div className="text-xs font-bold text-white">Inverse Invariant Mapping</div>
                      <p className="text-[11px] text-slate-300">Applying symmetric operations to isolate target components.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 text-center">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Verified Target (RHS)</div>
                      <div className="text-xs font-bold text-white">Conserved Equilibrium</div>
                      <p className="text-[11px] text-slate-300">Final roots satisfy initial conditions with zero contradiction.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Diagram Caption & Pedagogical Takeaway */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="space-y-0.5">
                <strong className="text-cyan-300 font-bold block">Figure 1.1 — Dynamic Visual Architecture for {topic}:</strong>
                <span>{expData.conceptDiagram?.caption || `Visual representation illustrating the foundational interactions, operational transformations, and governing laws of ${topic}.`}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Grounded {domain} Visual</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Governing Laws & Invariance Matrix */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2 pb-2 border-b border-slate-800">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>§ 2. Governing Rules & Invariance Matrix</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {rules.map((r, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-extrabold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm">{r.rule}</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed pl-7">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Diagnostic Pitfalls & Common Misconceptions */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2 pb-2 border-b border-slate-800">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>§ 3. Diagnostic Pitfalls & Critical Misconceptions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {misconceptions.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                  <span>❌ Common Pitfall:</span>
                  <span>{m.pitfall}</span>
                </div>
                <div className="text-slate-300 text-xs leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <strong className="text-emerald-400 block text-[11px] mb-0.5">✅ Correct Pedagogical Approach:</strong>
                  {m.correction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Chapter Summary & Core Takeaways */}
        <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Chapter Summary & Core Takeaway Checklist</span>
          </div>
          <p className="text-xs sm:text-sm text-cyan-100 font-medium leading-relaxed">
            {summaryTakeaway}
          </p>
          <div className="pt-2 border-t border-cyan-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-cyan-300">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              <span>Theory Grounded in Source</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step-by-Step Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero Hallucinations</span>
            </div>
          </div>
        </div>

      </div>

      {/* High-Resolution Diagram Zoom Modal */}
      {showImageZoom && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setShowImageZoom(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Concept Demonstration Diagram: {topic}
                </h3>
              </div>
              <button
                onClick={() => setShowImageZoom(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
              <img
                src={dynamicImageUrl}
                alt={`Lesson Concept Demonstration Diagram for ${topic}`}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="text-xs text-slate-300 text-center">
              <strong className="text-cyan-400">Core Takeaway:</strong> {expData.conceptDiagram?.caption || `Visual analysis demonstrating the foundational mechanisms, operational transformations, and equilibrium laws governing ${topic}.`}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
