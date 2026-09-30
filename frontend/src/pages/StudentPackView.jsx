import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { packApi } from '../services/api';
import { Badge } from '../components/common/Badge';
import { TextbookChapterView } from '../components/textbook/TextbookChapterView';
import { 
  ArrowLeft, 
  BookOpen, 
  HelpCircle, 
  ListChecks, 
  Target, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const StudentPackView = () => {
  const { id } = useParams();
  const [packData, setPackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('explanation');

  // Interactive Quiz State
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        setLoading(true);
        const res = await packApi.getById(id);
        setPackData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load student learning pack.');
      } finally {
        setLoading(false);
      }
    };
    fetchPack();
  }, [id]);

  const parseJson = (jsonStr) => {
    if (!jsonStr) return null;
    try {
      return JSON.parse(jsonStr);
    } catch {
      return jsonStr;
    }
  };

  const handleSelectOption = (questionId, optionKey) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleQuizSubmit = (questions) => {
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-6 bg-slate-800 rounded w-1/4"></div>
        <div className="h-40 bg-slate-900 rounded-3xl"></div>
        <div className="h-96 bg-slate-900 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !packData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white">Learning Pack Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">{error || 'Could not load pack.'}</p>
        <Link to="/student/dashboard" className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const { pack, assets = [] } = packData;
  const assetMap = {};
  assets.forEach(a => {
    assetMap[a.assetType] = a;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Back Link */}
      <Link
        to="/student/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Study Catalog</span>
      </Link>

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40">
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30">
            {pack.gradeLevel} • {pack.difficulty}
          </span>
          <Badge status="APPROVED" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {pack.topic}
        </h1>
        <p className="text-xs text-slate-300 mt-1.5">
          Source Material: <strong className="text-slate-100">{pack.sourceTitle}</strong>
        </p>
      </div>

      {/* Student Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-semibold">
        {[
          { key: 'explanation', label: '1. Concept Guide', icon: BookOpen },
          { key: 'example', label: '2. Step-by-Step Example', icon: HelpCircle },
          { key: 'quiz', label: '3. Interactive Quiz', icon: ListChecks },
          { key: 'practice', label: '4. Practice Exercises', icon: Target },
          { key: 'revision', label: '5. Exam Cheat-Sheet', icon: FileText },
        ].map(tab => {
          const isAct = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                isAct 
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 min-h-[400px]">
        
        {/* 1. EXPLANATION */}
        {activeTab === 'explanation' && (
          <TextbookChapterView
            expData={parseJson(assetMap['EXPLANATION']?.contentJson)}
            topic={pack.topic}
            gradeLevel={pack.gradeLevel}
            difficulty={pack.difficulty}
            sourceTitle={pack.sourceTitle}
          />
        )}

        {/* 2. WORKED EXAMPLE */}
        {activeTab === 'example' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white tracking-tight pb-3 border-b border-slate-800">
              Step-by-Step Guided Example
            </h2>

            {(() => {
              const ex = parseJson(assetMap['WORKED_EXAMPLE']?.contentJson);
              if (!ex) return <p className="text-xs text-slate-500">Example not available.</p>;
              return (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">Problem</span>
                    <h3 className="text-sm font-bold text-white">{ex.problemStatement || ex.problem}</h3>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Solution Steps</h4>
                    {ex.steps?.map((step, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {step.stepNumber || step.step || idx + 1}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="text-xs font-semibold text-white">{step.action || step.description}</div>
                          {step.math && (
                            <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-xs text-cyan-300 border border-slate-800">
                              {step.math}
                            </div>
                          )}
                          {step.explanation && <div className="text-[11px] text-slate-400">{step.explanation}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {ex.teacherTip && (
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Pro Tip: </strong>{ex.teacherTip}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* 3. INTERACTIVE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Interactive Formative Assessment</h2>
                <p className="text-xs text-slate-400 mt-0.5">Test your understanding. Instant feedback provided upon submission.</p>
              </div>

              {quizSubmitted && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Your Score</span>
                    <span className="text-lg font-extrabold text-cyan-400">{score} / {parseJson(assetMap['QUIZ']?.contentJson)?.questions?.length}</span>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                    title="Retry Quiz"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {(() => {
              const quiz = parseJson(assetMap['QUIZ']?.contentJson);
              const rawQuestions = quiz?.questions || [];
              if (rawQuestions.length === 0) return <p className="text-xs text-slate-500">No quiz questions available.</p>;

              // Normalize questions to standard format
              const questions = rawQuestions.map((q, qIdx) => {
                const qId = q.id || `q-${qIdx}`;
                const rawOpts = q.options || [];
                const formattedOpts = rawOpts.map((opt, oIdx) => {
                  if (typeof opt === 'string') {
                    const key = String.fromCharCode(65 + oIdx); // A, B, C, D
                    return { key, text: opt, originalIndex: oIdx };
                  }
                  return { key: opt.key || String.fromCharCode(65 + oIdx), text: opt.text || opt.label || JSON.stringify(opt), originalIndex: oIdx };
                });

                let correctKey = q.correctAnswer;
                if (correctKey === undefined && q.correctIndex !== undefined) {
                  correctKey = String.fromCharCode(65 + q.correctIndex);
                }

                return {
                  ...q,
                  id: qId,
                  options: formattedOpts,
                  correctKey: correctKey || 'A'
                };
              });

              return (
                <div className="space-y-6">
                  {questions.map((q, idx) => {
                    const selected = userAnswers[q.id];
                    const isCorrect = selected === q.correctKey;

                    return (
                      <div key={q.id || idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/30">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-white text-sm">{q.question}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {q.options.map(opt => {
                            const isOptSelected = selected === opt.key;
                            const isOptCorrect = opt.key === q.correctKey;

                            let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                            if (quizSubmitted) {
                              if (isOptCorrect) {
                                optStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-semibold';
                              } else if (isOptSelected && !isOptCorrect) {
                                optStyle = 'bg-rose-950/60 border-rose-500/60 text-rose-200';
                              }
                            } else if (isOptSelected) {
                              optStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-semibold';
                            }

                            return (
                              <button
                                key={opt.key}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => handleSelectOption(q.id, opt.key)}
                                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 text-left transition-colors ${optStyle}`}
                              >
                                <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                  isOptSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {opt.key}
                                </span>
                                <span className="leading-snug">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`p-3 rounded-xl text-xs ${isCorrect ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20' : 'bg-rose-950/30 text-rose-300 border border-rose-500/20'}`}>
                            <div className="font-semibold flex items-center gap-1.5">
                              {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                              <span>{isCorrect ? 'Correct!' : `Incorrect. Correct answer is option ${q.correctKey}.`}</span>
                            </div>
                            {q.explanation && <p className="mt-1 text-[11px] text-slate-300">{q.explanation}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!quizSubmitted && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => {
                          let correctCount = 0;
                          questions.forEach(q => {
                            if (userAnswers[q.id] === q.correctKey) {
                              correctCount++;
                            }
                          });
                          setScore(correctCount);
                          setQuizSubmitted(true);
                        }}
                        disabled={Object.keys(userAnswers).length === 0}
                        className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/20 transition-all disabled:opacity-50"
                      >
                        Submit Quiz Answers
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* 4. PRACTICE EXERCISES */}
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white tracking-tight pb-3 border-b border-slate-800">
              Differentiated Practice Sets
            </h2>

            {/* Level 1: Guided Practice */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Level 1: Guided Practice</h3>
              {(() => {
                const easy = parseJson(assetMap['EASY_PRACTICE']?.contentJson);
                const items = easy?.problems || easy?.exercises || [];
                if (items.length === 0) return <p className="text-xs text-slate-500">No Level 1 practice items found.</p>;
                return items.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-white">Problem #{p.problemNumber || p.id || idx + 1}: {p.problem || p.prompt}</div>
                    {(p.scaffoldingHint || p.hint) && (
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                        <strong>Hint: </strong>{p.scaffoldingHint || p.hint}
                      </div>
                    )}
                    <details className="mt-2 text-slate-400">
                      <summary className="cursor-pointer text-cyan-400 font-semibold hover:underline">
                        Show Solution
                      </summary>
                      <div className="mt-2 p-2.5 rounded bg-slate-900/80 text-emerald-300 border border-slate-800">
                        {p.solution || p.answer}
                      </div>
                    </details>
                  </div>
                ));
              })()}
            </div>

            {/* Level 2: Advanced Practice */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Level 2: Applied & Challenge Practice</h3>
              {(() => {
                const adv = parseJson(assetMap['ADVANCED_PRACTICE']?.contentJson);
                const items = adv?.problems || adv?.exercises || [];
                if (items.length === 0) return <p className="text-xs text-slate-500">No Level 2 practice items found.</p>;
                return items.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-white">Challenge #{p.problemNumber || p.id || idx + 1}: {p.problem || p.prompt}</div>
                    <details className="mt-2 text-slate-400">
                      <summary className="cursor-pointer text-indigo-400 font-semibold hover:underline">
                        Show Complete Derivation
                      </summary>
                      <div className="mt-2 p-2.5 rounded bg-slate-900/80 text-emerald-300 border border-slate-800">
                        {p.solution || p.answer}
                      </div>
                    </details>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* 5. REVISION CHEAT-SHEET */}
        {activeTab === 'revision' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <h2 className="text-xl font-bold text-white tracking-tight pb-3 border-b border-slate-800">
              Exam Quick Revision & Cheat-Sheet
            </h2>

            {(() => {
              const rev = parseJson(assetMap['REVISION_SHEET']?.contentJson);
              if (!rev) return <p className="text-slate-500">Revision sheet not available.</p>;
              return (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                    {rev.quickRecap || rev.summary}
                  </div>

                  {(rev.goldenRules || rev.bulletPoints) && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">Must-Remember Rules</h4>
                      <ul className="space-y-1.5">
                        {(rev.goldenRules || rev.bulletPoints).map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-300">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rev.formulaSummary && (
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Formula Sheet</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rev.formulaSummary.map((f, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="font-semibold text-slate-300">{f.name}</div>
                            <div className="font-mono text-cyan-300 mt-0.5">{f.expr}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
};
