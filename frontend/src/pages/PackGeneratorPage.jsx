import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { sourceApi, packApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { 
  Sparkles, 
  Target, 
  FileText, 
  Plus, 
  Trash2, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  BookOpen,
  ArrowLeft,
  Upload,
  FileUp,
  X,
  Layers,
  FileCode2,
  CheckSquare,
  Square
} from 'lucide-react';

const GENERATION_STEPS = [
  'Reading and tokenizing educational source files',
  'Executing RAG vector retrieval across all uploaded files',
  'Synthesizing grounded multi-source Concept Explanation',
  'Constructing step-by-step Guided Worked Examples',
  'Generating Formative Quiz and aligned Answer Key',
  'Creating Differentiated Practice (Guided & Advanced)',
  'Generating Quick Revision and Exam Cheat-Sheet',
  'Calculating Objective Alignment Coverage Matrix',
  'Verifying Cross-Asset Consistency & Quality Guardrails',
  'Finalizing and persisting classroom-ready pack'
];

export const PackGeneratorPage = () => {
  const [searchParams] = useSearchParams();
  const initialSourceId = searchParams.get('sourceId') || '';
  const navigate = useNavigate();
  const toast = useToast();

  const [sources, setSources] = useState([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState(initialSourceId ? [initialSourceId] : []);
  const [topic, setTopic] = useState('Linear Equations in One Variable');
  const [gradeLevel, setGradeLevel] = useState('Undergraduate');
  const [difficulty, setDifficulty] = useState('Beginner');

  // Multi-file upload & delete state
  const [sourceMode, setSourceMode] = useState('select'); // 'select' | 'upload' | 'text'
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [rawTextContent, setRawTextContent] = useState('');
  const [rawTextTitle, setRawTextTitle] = useState('');

  // Delete modal state
  const [sourceToDelete, setSourceToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Dynamic Objectives List (unlimited)
  const [objectives, setObjectives] = useState([
    { id: '1', objectiveCode: 'OBJ-1', description: 'Explain what a linear equation in one variable is and identify its standard form (ax + b = c).' },
    { id: '2', objectiveCode: 'OBJ-2', description: 'Solve one-variable linear equations using systematic inverse operations on both sides.' },
    { id: '3', objectiveCode: 'OBJ-3', description: 'Verify calculated solutions by substituting back into the Left Hand Side and Right Hand Side.' }
  ]);

  // Generation counts
  const [quizCount, setQuizCount] = useState(5);
  const [easyCount, setEasyCount] = useState(3);
  const [advCount, setAdvCount] = useState(3);

  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState('');

  const fetchSources = async () => {
    try {
      const res = await sourceApi.getAll();
      const allSrc = res.data || [];
      setSources(allSrc);
      if (selectedSourceIds.length === 0 && allSrc.length > 0) {
        setSelectedSourceIds([allSrc[0].id]);
      }
    } catch (err) {
      console.error("Failed to fetch sources:", err);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  // Multi-source selection toggle
  const toggleSourceSelection = (id) => {
    setSelectedSourceIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1 if clicking active
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle Multi-file Upload (PDF, TXT, DOCX, MD, etc.)
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    setError('');

    const newUploadedList = [...uploadedFiles];
    const newlyAddedIds = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('description', `Uploaded source document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      formData.append('file', file);

      try {
        const res = await sourceApi.upload(formData);
        newUploadedList.push(res.data);
        newlyAddedIds.push(res.data.id);
        toast.success(`Uploaded & indexed: ${file.name}`);
      } catch (err) {
        console.error("File upload failed for:", file.name, err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploadedFiles(prev => {
      const map = new Map();
      prev.forEach(item => map.set(item.id, item));
      newUploadedList.forEach(item => map.set(item.id, item));
      return Array.from(map.values());
    });
    setSelectedSourceIds(prev => [...new Set([...prev, ...newlyAddedIds])]);
    setUploadingFiles(false);
    await fetchSources();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleRawTextSubmit = async () => {
    if (!rawTextContent.trim()) {
      toast.error('Please enter source text content.');
      return;
    }
    setUploadingFiles(true);
    const formData = new FormData();
    formData.append('title', rawTextTitle.trim() || `${topic} Curriculum Notes`);
    formData.append('description', 'Pasted educational notes text');
    formData.append('rawText', rawTextContent.trim());

    try {
      const res = await sourceApi.upload(formData);
      setUploadedFiles(prev => [...prev, res.data]);
      setSelectedSourceIds(prev => [...prev, res.data.id]);
      setRawTextContent('');
      setRawTextTitle('');
      toast.success('Text notes uploaded and indexed successfully!');
      await fetchSources();
    } catch (err) {
      toast.error('Failed to index pasted text.');
    } finally {
      setUploadingFiles(false);
    }
  };

  // Delete Source File
  const confirmDeleteSource = async () => {
    if (!sourceToDelete) return;
    setDeleteLoading(true);
    try {
      await sourceApi.delete(sourceToDelete.id);
      toast.success(`Deleted file: ${sourceToDelete.title}`);
      setUploadedFiles(prev => prev.filter(f => f.id !== sourceToDelete.id));
      setSelectedSourceIds(prev => prev.filter(id => id !== sourceToDelete.id));
      setSources(prev => prev.filter(s => s.id !== sourceToDelete.id));
      setSourceToDelete(null);
      await fetchSources();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete source document.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddObjective = () => {
    const nextNum = objectives.length + 1;
    setObjectives([
      ...objectives,
      { id: String(Date.now()), objectiveCode: `OBJ-${nextNum}`, description: '' }
    ]);
  };

  const handleRemoveObjective = (idx) => {
    if (objectives.length <= 1) return;
    const updated = objectives.filter((_, i) => i !== idx);
    const renumbered = updated.map((obj, i) => ({
      ...obj,
      objectiveCode: `OBJ-${i + 1}`
    }));
    setObjectives(renumbered);
  };

  const handleObjectiveChange = (idx, value) => {
    const updated = [...objectives];
    updated[idx].description = value;
    setObjectives(updated);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (selectedSourceIds.length === 0) {
      setError('Please select or upload at least one educational source document.');
      toast.error('Source document is required.');
      return;
    }
    if (!topic.trim()) {
      setError('Please provide a lesson topic.');
      return;
    }
    const validObjectives = objectives.filter(o => o.description.trim().length > 0);
    if (validObjectives.length === 0) {
      setError('Please define at least one valid learning objective.');
      return;
    }

    setError('');
    setLoading(true);
    setCurrentStepIndex(0);

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < GENERATION_STEPS.length - 2 ? prev + 1 : prev));
    }, 600);

    try {
      const createRes = await packApi.create({
        sourceId: selectedSourceIds.join(','),
        topic: topic.trim(),
        gradeLevel: gradeLevel.trim(),
        difficulty,
        objectives: validObjectives,
        quizQuestionCount: Number(quizCount),
        easyPracticeCount: Number(easyCount),
        advancedPracticeCount: Number(advCount)
      });

      const packId = createRes.data.id;

      await packApi.generate(packId);

      setCurrentStepIndex(GENERATION_STEPS.length - 1);
      clearInterval(interval);
      toast.success('Learning pack generated with 7 consistent assets across all selected sources!');

      setTimeout(() => {
        navigate(`/teacher/packs/${packId}`);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to generate learning pack.');
      toast.error('Generation failed. Please review inputs.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/teacher/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Constraint-Aware Multi-Source Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Configure & Generate Learning Pack
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Upload and combine multiple files (PDFs, textbook chapters, notes). The AI RAG engine will analyze all documents together and ground all 7 learning assets strictly without hallucinations.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Generation Configuration Error:</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="glass-panel rounded-3xl p-8 border border-cyan-500/40 shadow-2xl glow-blue text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Analyzing {selectedSourceIds.length} Source Document{selectedSourceIds.length > 1 ? 's' : ''} & Generating Grounded Pack
            </h2>
            <p className="text-xs text-slate-400 mt-1">Executing multi-document RAG retrieval, contract alignment & hallucination guardrails</p>
          </div>

          <div className="max-w-xl mx-auto space-y-2.5 text-left bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            {GENERATION_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-colors ${
                    isDone ? 'text-emerald-400 font-medium' : isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* 1. Source Selector & Multi-File Uploader Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. Educational Source Selection ({selectedSourceIds.length} Selected)
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSourceMode('select')}
                  className={`px-3 py-1 rounded-lg transition-all ${sourceMode === 'select' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Choose Existing ({sources.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`px-3 py-1 rounded-lg transition-all ${sourceMode === 'upload' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Upload Files
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('text')}
                  className={`px-3 py-1 rounded-lg transition-all ${sourceMode === 'text' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {/* Mode A: Select Existing Sources with Multi-Select & Delete */}
            {sourceMode === 'select' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Select one or more sources to combine for generation:</span>
                  <span className="text-cyan-400 font-semibold">{selectedSourceIds.length} file{selectedSourceIds.length > 1 ? 's' : ''} active</span>
                </div>

                {sources.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p>No sources found. Switch to "Upload Files" tab above to add documents.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {sources.map(src => {
                      const isSelected = selectedSourceIds.includes(src.id);
                      return (
                        <div
                          key={src.id}
                          className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 transition-all ${
                            isSelected 
                              ? 'bg-cyan-950/50 border-cyan-500/60 shadow-md text-slate-200' 
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div 
                            onClick={() => toggleSourceSelection(src.id)}
                            className="flex items-start gap-2.5 flex-1 cursor-pointer"
                          >
                            <div className="mt-0.5 text-cyan-400">
                              {isSelected ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-white block truncate">{src.title}</span>
                              <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                                {src.filename} • {src.chunkCount || 0} chunks • {src.fileType || 'PDF'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSourceToDelete(src);
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors shrink-0"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Mode B: Multi-File Drag & Drop Uploader */}
            {sourceMode === 'upload' && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
                    isDragOver 
                      ? 'border-cyan-500 bg-cyan-950/20' 
                      : 'border-slate-700 hover:border-slate-600 bg-slate-950/50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-white">Upload multiple educational files</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Drag & drop PDF, TXT, DOCX, or markdown files here, or click to browse</p>
                  
                  <label className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 cursor-pointer transition-colors">
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Select Multiple Files</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt,.docx,.doc,.md"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadingFiles && (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Vectorizing uploaded files into semantic chunks...</span>
                  </div>
                )}

                {/* Uploaded Files List with Delete Buttons */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">Uploaded Sources ({uploadedFiles.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={file.id || idx}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between gap-2"
                        >
                          <div className="truncate flex-1">
                            <span className="font-semibold text-white block truncate">{file.title}</span>
                            <span className="text-[10px] text-slate-400">{file.filename} • {file.chunkCount || 0} chunks</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">Ready</span>
                            <button
                              type="button"
                              onClick={() => setSourceToDelete(file)}
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                              title="Delete file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode C: Paste Text Notes */}
            {sourceMode === 'text' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Source Title</label>
                  <input
                    type="text"
                    value={rawTextTitle}
                    onChange={(e) => setRawTextTitle(e.target.value)}
                    placeholder="e.g. NCERT Chapter 4 Notes"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pasted Text Content *</label>
                  <textarea
                    rows={4}
                    value={rawTextContent}
                    onChange={(e) => setRawTextContent(e.target.value)}
                    placeholder="Paste textbook definitions, lecture transcripts, or curriculum syllabus text..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 resize-y"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRawTextSubmit}
                  disabled={uploadingFiles || !rawTextContent.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 transition-colors disabled:opacity-50"
                >
                  {uploadingFiles ? 'Indexing Notes...' : 'Save & Use As Source'}
                </button>
              </div>
            )}
          </div>

          {/* 2. Topic & Grade Contract Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Pedagogical Contract & Target Level</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Subject Matter *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Linear Equations in One Variable"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Academic / Target Level *</label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="e.g. Undergraduate / Higher Ed / Intermediate"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Standard)</option>
                  <option value="Advanced">Advanced (Challenge & Mastery)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Learning Objectives Contract (Add as many as needed) */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Explicit Learning Objectives Contract ({objectives.length}) *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Add as many specific curriculum competencies as required. All assets will be rigorously aligned.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Objective</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {objectives.map((obj, idx) => (
                  <div key={obj.id} className="flex items-center gap-2">
                    <span className="w-14 px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-center text-xs font-mono font-semibold text-cyan-400 shrink-0">
                      {obj.objectiveCode}
                    </span>
                    <input
                      type="text"
                      value={obj.description}
                      onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                      placeholder={`Objective #${idx + 1} description (e.g. Master inverse operations to isolate unknown x)`}
                      required
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(idx)}
                      disabled={objectives.length <= 1}
                      className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-500 rounded-lg shrink-0"
                      title="Remove Objective"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Generation Counts */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Asset Quantity & Differentiation Specs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Formative Quiz Questions</label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  value={quizCount}
                  onChange={(e) => setQuizCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Level 1 (Foundational) Exercises</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={easyCount}
                  onChange={(e) => setEasyCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Level 2 (Advanced) Problems</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={advCount}
                  onChange={(e) => setAdvCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/teacher/dashboard"
              className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || uploadingFiles}
              className="px-8 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate 7 Grounded Learning Assets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Delete Source Confirmation Modal */}
      <ConfirmModal
        isOpen={!!sourceToDelete}
        onClose={() => setSourceToDelete(null)}
        onConfirm={confirmDeleteSource}
        title="Delete Source File"
        message={`Are you sure you want to permanently delete "${sourceToDelete?.title}" (${sourceToDelete?.filename})?`}
        confirmText="Delete File"
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  );
};
