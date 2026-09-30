import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { QuickStartGuideModal } from '../components/common/QuickStartGuideModal';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Clock, 
  Sparkles, 
  ChevronRight,
  ChevronLeft,
  Search,
  HelpCircle,
  FolderPlus,
  User
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const packRes = await packApi.getAll();
        setPacks(packRes.data || []);
      } catch (err) {
        console.error("Error loading teacher dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalInReviewPacks = packs.filter(p => p.status === 'IN_REVIEW' || p.status === 'DRAFT').length;
  const totalPublishedPacks = packs.filter(p => p.status === 'PUBLISHED').length;

  // Filtered packs (mapping any legacy DRAFT to IN_REVIEW)
  const filteredPacks = packs.map(p => (p.status === 'DRAFT' ? { ...p, status: 'IN_REVIEW' } : p)).filter(pack => {
    const matchesSearch = 
      (pack.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pack.topic || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || pack.status === statusFilter;
    const matchesGrade = gradeFilter === 'ALL' || pack.gradeLevel === gradeFilter;
    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, gradeFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPacks.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPacks = filteredPacks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
        <div className="h-8 bg-slate-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-900 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Welcome & Fast-Track Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 bg-gradient-to-r from-slate-50 via-cyan-50/30 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-cyan-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Teacher Asset Generation Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.fullName || 'Educator'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Upload curriculum sources to generate 7 coordinated, constraint-verified learning assets with zero hallucinations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 transition-all shadow-sm"
              title="Edit Name & Password"
            >
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>My Profile</span>
            </Link>
            <button
              onClick={() => setGuideOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-cyan-800 dark:text-cyan-300 bg-cyan-100/70 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/40 border border-cyan-300 dark:border-cyan-500/30 transition-all shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
              <span>How It Works</span>
            </button>
            <Link
              to="/teacher/generate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Pack</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row (Total Packs, Published, In Review) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Packs</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{packs.length}</div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1">Generated curriculum units</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Published</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalPublishedPacks}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Live in Student Study Catalog</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">In Review</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalInReviewPacks}</div>
            <div className="text-[11px] text-sky-600 dark:text-sky-400 mt-1">Awaiting teacher sign-off</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content: Learning Asset Packs with 10-Item Pagination */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Learning Asset Packs</span>
            <span className="text-xs text-slate-500 font-normal">({filteredPacks.length} total)</span>
          </h2>
          <Link to="/teacher/generate" className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>+ Create New Pack</span>
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by pack title or topic..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="PUBLISHED">Published</option>
          </select>

          {/* Academic Level Filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Levels</option>
            {Array.from(new Set(packs.map(p => p.gradeLevel).filter(Boolean))).map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>

        {filteredPacks.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {packs.length === 0 ? 'No Learning Packs Generated Yet' : 'No matching packs found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {packs.length === 0 
                ? 'Select an educational source to generate your first complete learning pack in seconds.' 
                : 'Try clearing your search query or adjusting your filters.'}
            </p>
            {packs.length === 0 ? (
              <Link
                to="/teacher/generate"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create First Pack</span>
              </Link>
            ) : (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setGradeFilter('ALL'); }}
                className="mt-3 text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedPacks.map(pack => (
              <Link
                key={pack.id}
                to={`/teacher/packs/${pack.id}`}
                className="block p-4 sm:p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all hover:translate-x-1 group shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {pack.title}
                      </span>
                      <Badge status={pack.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                      <span>Topic: <strong className="text-slate-800 dark:text-slate-300">{pack.topic}</strong></span>
                      <span>•</span>
                      <span>Level: <strong className="text-slate-800 dark:text-slate-300">{pack.gradeLevel}</strong></span>
                      <span>•</span>
                      <span>Difficulty: <strong className="text-slate-800 dark:text-slate-300">{pack.difficulty}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center sm:flex-col sm:items-end justify-between shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800/60">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                      {new Date(pack.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:underline mt-1 inline-flex items-center gap-0.5">
                      Open Studio <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Left Pagination Controls */}
        {filteredPacks.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-800 dark:text-slate-200">{startIndex + 1}</strong> - <strong className="text-slate-800 dark:text-slate-200">{Math.min(startIndex + ITEMS_PER_PAGE, filteredPacks.length)}</strong> of <strong className="text-cyan-600 dark:text-cyan-400">{filteredPacks.length}</strong> packs (Page {currentPage} of {totalPages})
            </div>
          </div>
        )}
      </div>

      {/* Interactive Guide Modal */}
      <QuickStartGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
