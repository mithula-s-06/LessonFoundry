import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { sourceApi } from '../services/api';
import { Badge } from '../components/common/Badge';
import { 
  FileText, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Layers, 
  FileCheck2, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const SourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadSource = async () => {
      try {
        setLoading(true);
        const res = await sourceApi.getById(id);
        setSource(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load source details.');
      } finally {
        setLoading(false);
      }
    };
    loadSource();
  }, [id]);

  const handleCopyText = () => {
    if (source?.textContent) {
      navigator.clipboard.writeText(source.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
        <div className="h-6 bg-slate-800 rounded w-1/5"></div>
        <div className="h-40 bg-slate-900 rounded-3xl"></div>
        <div className="h-96 bg-slate-900 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !source) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white">Source Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">{error || 'Could not retrieve document information.'}</p>
        <Link
          to="/teacher/sources"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs text-white hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sources
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Back Link */}
      <Link
        to="/teacher/sources"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Sources</span>
      </Link>

      {/* Header Info Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 bg-gradient-to-r from-slate-900 to-slate-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30">
                {source.fileType || 'PDF'} • v{source.version}
              </span>
              <Badge status={source.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {source.title}
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {source.description || 'Verified educational document for grounded generative AI asset generation.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div>Filename: <strong className="text-slate-200">{source.filename}</strong></div>
              <div>•</div>
              <div>Pages: <strong className="text-slate-200">{source.pageCount}</strong></div>
              <div>•</div>
              <div>Semantic Chunks: <strong className="text-slate-200">{source.chunkCount}</strong></div>
              <div>•</div>
              <div>Uploaded By: <strong className="text-slate-200">{source.uploadedBy}</strong></div>
              <div>•</div>
              <div>Date: <strong className="text-slate-200">{new Date(source.createdAt).toLocaleDateString()}</strong></div>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to={`/teacher/generate?sourceId=${source.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Learning Pack from this Source</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Extracted Text Preview Viewer */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Extracted & Sanitized Text Preview
            </h3>
          </div>
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 max-h-[550px] overflow-y-auto bg-slate-950/70 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-cyan-900 selection:text-white">
          {source.textContent || 'No extracted text found in this document.'}
        </div>
      </div>
    </div>
  );
};
