import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowLeft, 
  Lock, 
  Mail, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: 'signin' | 'signup'
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState(initialMode);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEACHER'); // 'TEACHER' | 'STUDENT'

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);

  const routeUserByRole = (user) => {
    if (user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (user.role === 'TEACHER') {
      navigate('/teacher/dashboard');
    } else if (user.role === 'STUDENT') {
      navigate('/student/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const user = await register({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          role
        });
        routeUserByRole(user);
      } else {
        const user = await login(email.trim(), password);
        routeUserByRole(user);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.message || 
        (mode === 'signup' ? 'Registration failed. Email may already be in use.' : 'Invalid email or password.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-indigo-50/30 to-transparent dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-cyan-900/20 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">LessonFoundry</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Constraint-Aware GenAI Educational Platform</p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === 'signup' ? 'Create Your Account' : 'Sign in to your Studio'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {mode === 'signup' 
                ? 'Join LessonFoundry to generate and review grounded learning packs.' 
                : 'Enter your credentials to access your educational workspace.'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            
            {/* Full Name field (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password {mode === 'signup' && <span className="text-slate-500 lowercase">(min 6 chars)</span>}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Role Selection (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('TEACHER')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      role === 'TEACHER'
                        ? 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-400 dark:border-cyan-500/50 text-cyan-900 dark:text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Educator</div>
                      <div className="text-[10px] opacity-75">Create & review</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      role === 'STUDENT'
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-500/50 text-indigo-900 dark:text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Student</div>
                      <div className="text-[10px] opacity-75">Study & quizzes</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{mode === 'signup' ? 'Creating Account...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer mode toggle link */}
          <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800/60">
            {mode === 'signup' ? (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); }}
                  className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                New to LessonFoundry?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
