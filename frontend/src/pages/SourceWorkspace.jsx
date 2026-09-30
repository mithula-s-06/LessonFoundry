import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sourceApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { 
  FileText, 
  Upload, 
  Search, 
  Trash2, 
  Eye, 
  Sparkles, 
  FileUp, 
  AlertCircle, 
  Layers, 
  Plus, 
  CheckCircle2, 
  X,
  FileCode2,
  Wand2
} from 'lucide-react';

const SAMPLE_SOURCES = [
  {
    name: '📐 Grade 8 Math: Linear Equations',
    title: 'NCERT Grade 8 Mathematics: Linear Equations in One Variable',
    desc: 'Core chapter covering standard algebraic definitions (ax + b = c), inverse operations, verification checks, and word problems.',
    text: `CHAPTER 2: LINEAR EQUATIONS IN ONE VARIABLE\n\n2.1 Introduction\nAn algebraic equation is an equality involving variables and constants. It has an equality sign (=). The expression on the left of the equality sign is the Left Hand Side (LHS) and the expression on the right is the Right Hand Side (RHS).\nIn a linear equation in one variable, the highest exponent of the variable occurring in the equation is 1.\nStandard form: ax + b = c, where a and b are real numbers and a != 0.\n\n2.2 Solving Linear Equations\nTo solve an equation, we perform identical mathematical operations on both sides to isolate the variable:\n1. Add the same number to both sides.\n2. Subtract the same number from both sides.\n3. Multiply both sides by the same non-zero number.\n4. Divide both sides by the same non-zero number.\n\n2.3 Verification of Solutions\nA value of the variable which makes the equation a true statement is called a solution or root of the equation. To verify, substitute the candidate numerical value back into LHS and evaluate. If LHS equals RHS, the solution is verified and correct.\n\n2.4 Application Word Problems\nWhen translating word problems into linear equations:\n- Define the unknown quantity with a variable (e.g. let x be the cost).\n- Translate verbal relationships into mathematical operations.\n- Solve the linear equation and check if the result makes practical sense.`
  },
  {
    name: '⚡ Grade 9 Physics: Newton\'s Laws',
    title: 'Physics Chapter 9: Force and Newton\'s Laws of Motion',
    desc: 'Foundations of mechanics: Inertia, F=ma, action-reaction pairs, and momentum conservation.',
    text: `FORCE AND LAWS OF MOTION\n\n1. First Law of Motion (Inertia)\nAn object remains in a state of rest or of uniform motion in a straight line unless compelled to change that state by an applied external unbalanced force. This property is termed inertia.\n\n2. Second Law of Motion (F = m * a)\nThe rate of change of momentum of an object is directly proportional to the applied unbalanced force in the direction of force. Force = mass * acceleration (F = m * a). SI unit is Newton (N).\n\n3. Third Law of Motion\nTo every action, there is always an equal and opposite reaction. Forces always occur in matched action-reaction pairs acting on two different bodies.\n\n4. Conservation of Linear Momentum\nIn an isolated system where no external force acts, the total linear momentum before collision equals the total linear momentum after collision.`
  },
  {
    name: '🌿 Grade 10 Biology: Photosynthesis',
    title: 'Life Processes: Photosynthesis and Energy Conversion in Plants',
    desc: 'Biochemical pathways of chlorophyll, light reactions, Calvin cycle, and stomatal gas regulation.',
    text: `PLANT PHYSIOLOGY: PHOTOSYNTHESIS\n\n1. Biochemical Definition\nPhotosynthesis is the process by which autotrophic organisms synthesize glucose from inorganic carbon dioxide (CO2) and water (H2O) using solar photon energy absorbed by chlorophyll pigments.\nEquation: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2\n\n2. Cellular Site\nPhotosynthesis occurs inside specialized organelles called Chloroplasts. Light reactions take place in the thylakoid grana, while the dark reactions (carbon fixation) occur in the stroma.\n\n3. Primary Stages\n- Absorption of light energy by chlorophyll.\n- Photolysis of water: Splitting of H2O molecules into hydrogen ions, electrons, and oxygen gas.\n- Reduction of carbon dioxide into carbohydrates (glucose).\n\n4. Stomatal Gas Exchange\nGuard cells regulate stomatal pore aperture through turgor pressure changes, enabling CO2 uptake while minimizing transpirational water loss.`
  }
];

export const SourceWorkspace = () => {
  const [sources, setSources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'text'
  const [isDragOver, setIsDragOver] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const loadSources = async () => {
    try {
      setLoading(true);
      const res = await sourceApi.getAll();
      setSources(res.data || []);
    } catch (err) {
      console.error("Failed to load sources:", err);
      toast.error('Failed to retrieve educational sources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please provide a title for the source document.');
      return;
    }
    if (uploadMode === 'file' && !file) {
      setUploadError('Please select a PDF or TXT file to upload.');
      return;
    }
    if (uploadMode === 'text' && !rawText.trim()) {
      setUploadError('Please paste your source text content.');
      return;
    }

    setUploadError('');
    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (uploadMode === 'file' && file) {
        formData.append('file', file);
      } else if (uploadMode === 'text') {
        formData.append('rawText', rawText);
      }

      const res = await sourceApi.upload(formData);
      toast.success(`Source "${res.data.title}" processed and indexed successfully!`);
      setUploadModalOpen(false);
      resetForm();
      loadSources();
      navigate(`/teacher/sources/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Failed to upload and process source.');
      toast.error('Upload failed. Check format and try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleLoadSample = (sample) => {
    setTitle(sample.title);
    setDescription(sample.desc);
    setRawText(sample.text);
    setUploadMode('text');
    toast.info(`Loaded sample curriculum: ${sample.name}`);
  };

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleOpenDelete = (id, title) => {
    setSourceToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!sourceToDelete) return;
    setDeleteLoading(true);
    try {
      await sourceApi.delete(sourceToDelete.id);
      toast.success(`Source "${sourceToDelete.title}" deleted successfully.`);
      setSources(sources.filter(s => s.id !== sourceToDelete.id));
      setDeleteModalOpen(false);
      setSourceToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete source.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setRawText('');
    setUploadError('');
    setIsDragOver(false);
  };

  const filteredSources = sources.filter(s =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Educational Sources Workspace</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage textbook PDFs, syllabus files, and lecture transcripts indexed for grounded RAG generation.
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setUploadModalOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Source Document</span>
        </button>
      </div>


      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sources by title, description or filename..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Sources Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-44 bg-slate-900 rounded-2xl"></div>)}
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl border border-slate-800">
          <FileUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No Educational Sources Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? 'No sources matched your search query.' : 'Upload a PDF or paste text to ground your learning pack generation.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSources.map((src) => (
            <div
              key={src.id}
              className="glass-card rounded-2xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20 font-semibold">
                    {src.fileType || 'PDF'} • v{src.version}
                  </span>
                  <Badge status={src.status} />
                </div>

                <Link
                  to={`/teacher/sources/${src.id}`}
                  className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-1"
                >
                  {src.title}
                </Link>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {src.description || 'Verified educational curriculum source document.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>Pages: <strong className="text-slate-200">{src.pageCount}</strong></div>
                  <div>Chunks: <strong className="text-slate-200">{src.chunkCount}</strong></div>
                  <div>Uploaded: <span className="text-slate-300">{new Date(src.createdAt).toLocaleDateString()}</span></div>
                  <div>By: <span className="text-slate-300 truncate block">{src.uploadedBy}</span></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link
                  to={`/teacher/generate?sourceId=${src.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/10 transition-all hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Pack</span>
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/teacher/sources/${src.id}`}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="View Extracted Text"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleOpenDelete(src.id, src.title)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Delete Source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Educational Source Document"
        subtitle="Extract text, create chunks, and index vectors for RAG generation."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{uploadError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Source Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grade 8 Mathematics - Chapter 2 Linear Equations"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Description / Notes</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Textbook chapter covering inverse operations and problem models."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${uploadMode === 'file' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Upload PDF / TXT File
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('text')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${uploadMode === 'text' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Paste Raw Text
            </button>
          </div>

          {uploadMode === 'file' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all bg-slate-900/40 ${
                isDragOver ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-700 hover:border-cyan-500/50'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.txt,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <FileUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                {file ? (
                  <div className="text-xs font-semibold text-emerald-400">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ) : (
                  <>
                    <div className="text-xs font-semibold text-slate-200">Click or Drag & Drop PDF / TXT file</div>
                    <div className="text-[11px] text-slate-500 mt-1">Supports PDF up to 25MB</div>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase text-slate-300">Source Text Content *</label>
                <span className="text-[11px] text-slate-500 font-mono">{rawText.length} characters</span>
              </div>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your textbook chapter or lesson transcript here..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {uploadLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Chunks & Vector Store...</span>
                </>
              ) : (
                <span>Upload & Index Document</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* In-App Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleExecuteDelete}
        title={`Delete Source Document`}
        message={`Are you sure you want to delete "${sourceToDelete?.title}"? All vectorized chunks and index metadata for this source will be removed.`}
        confirmText="Delete Source"
        cancelText="Keep Source"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  );
};
