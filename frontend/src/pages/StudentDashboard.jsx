import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  FileText,
  User
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [publishedPacks, setPublishedPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPublished = async () => {
      try {
        setLoading(true);
        const res = await packApi.getPublishedForStudents();
        setPublishedPacks(res.data || []);
      } catch (err) {
        console.error("Failed to load student packs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublished();
  }, []);

  const filteredPacks = publishedPacks.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.gradeLevel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Student Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 bg-gradient-to-r from-slate-50 via-cyan-50/30 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Student Learning Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome to your Study Center, {user?.fullName || 'Student'}!
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Access verified, teacher-approved learning packs with explanations, guided examples, interactive quizzes, and practice sets.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 transition-all shadow-sm"
            title="Edit Name & Password"
          >
            <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>My Profile & Settings</span>
          </Link>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learning packs by topic or grade..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-sm"
          />
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400">
          Available Packs: <strong className="text-cyan-600 dark:text-cyan-400">{filteredPacks.length}</strong>
        </span>
      </div>

      {/* Published Packs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-900 rounded-2xl"></div>)}
        </div>
      ) : filteredPacks.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Published Learning Packs Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your teachers are preparing and verifying learning materials. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacks.map(pack => (
            <div
              key={pack.id}
              className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:shadow-xl group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/30 font-semibold">
                    {pack.gradeLevel} • {pack.difficulty}
                  </span>
                  <Badge status="PUBLISHED" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {pack.topic}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Source: {pack.sourceTitle || 'Verified Textbook'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Teacher Verified
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {new Date(pack.publishedAt || pack.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-3">
                <Link
                  to={`/student/packs/${pack.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/10 transition-all group-hover:scale-[1.02]"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
