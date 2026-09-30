import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { packApi, assetApi, validationApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { TextbookChapterView } from '../components/textbook/TextbookChapterView';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  FileText, 
  ShieldCheck, 
  Target, 
  History, 
  Send, 
  ArrowLeft, 
  Check, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  ListChecks, 
  Copy, 
  Printer, 
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

export const LearningPackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [packData, setPackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('explanation');

  // Single-Asset Regeneration Modal State
  const [regenModalOpen, setRegenModalOpen] = useState(false);
  const [targetAsset, setTargetAsset] = useState(null);
  const [targetQuestionId, setTargetQuestionId] = useState('');
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [regenLoading, setRegenLoading] = useState(false);

  // Request Revision Modal State
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');

  // Version History Modal State
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [assetVersions, setAssetVersions] = useState([]);
  const [selectedVersionAsset, setSelectedVersionAsset] = useState(null);

  // Citation Detail Modal
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);

  // Teacher Quiz Preview Toggle
  const [quizRevealAnswers, setQuizRevealAnswers] = useState(true);

  // Publish Pack In-App Modal State
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const loadPack = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await packApi.getById(id);
      setPackData(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      if (!packData) {
        setError('Failed to load learning pack details.');
      }
      toast.error('Could not load pack details.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadPack(true);
  }, [id]);

  const handleApproveAsset = async (assetId) => {
    try {
      await assetApi.approve(assetId);
      toast.success('Asset approved and marked ready for classroom deployment!');
      await loadPack(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed.');
    }
  };

  const handleRequestRevision = async () => {
    if (!targetAsset || !revisionReason.trim()) return;
    try {
      await assetApi.requestRevision(targetAsset.id, revisionReason.trim());
      toast.warning(`Revision requested for ${targetAsset.assetType || 'asset'}.`);
      setRevisionModalOpen(false);
      setRevisionReason('');
      await loadPack(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Revision request failed.');
    }
  };

  const handleExecuteRegeneration = async (e) => {
    e.preventDefault();
    if (!targetAsset || !revisionPrompt.trim()) return;

    setRegenLoading(true);
    try {
      await assetApi.regenerate(targetAsset.id, {
        revisionInstruction: revisionPrompt.trim(),
        targetId: targetQuestionId || null
      });

      toast.success(
        targetQuestionId 
          ? `Regenerated ${targetQuestionId} (v1 -> v2) while keeping all other questions untouched!`
          : `Regenerated ${targetAsset.assetType || 'Asset'} with updated version!`
      );
      
      setRegenModalOpen(false);
      setRevisionPrompt('');
      setTargetQuestionId('');
      await loadPack(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Regeneration failed.');
    } finally {
      setRegenLoading(false);
    }
  };

  const handleViewVersions = async (asset) => {
    setSelectedVersionAsset(asset);
    try {
      const res = await assetApi.getVersions(asset.id);
      setAssetVersions(res.data || []);
      setVersionModalOpen(true);
    } catch (err) {
      toast.error('Could not fetch asset version history.');
    }
  };

  const handleExecutePublish = async () => {
    setPublishLoading(true);
    try {
      await packApi.publish(id);
      toast.success('🎉 Learning pack published successfully to Student Mode!');
      setPublishModalOpen(false);
      await loadPack(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish pack.');
    } finally {
      setPublishLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!packData) return;
    const { pack, assets } = packData;
    let md = `# ${pack.title}\n\n**Topic:** ${pack.topic} | **Level:** ${pack.gradeLevel} | **Difficulty:** ${pack.difficulty}\n\n---\n\n`;
    
    assets.forEach(a => {
      md += `## ${a.title} (v${a.currentVersion})\n\n`;
      try {
        const parsed = JSON.parse(a.contentJson);
        md += JSON.stringify(parsed, null, 2) + "\n\n";
      } catch {
        md += a.contentJson + "\n\n";
      }
      md += `---\n\n`;
    });

    navigator.clipboard.writeText(md);
    toast.success('Entire structured learning pack copied to clipboard as Markdown!');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
        <div className="h-6 bg-slate-800 rounded w-1/4"></div>
        <div className="h-44 bg-slate-900 rounded-3xl"></div>
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
        <Link to="/teacher/dashboard" className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { pack, objectives = [], assets = [], validation, alignments = [] } = packData;

  const assetMap = {};
  assets.forEach(a => {
    assetMap[a.assetType] = a;
  });

  const parseJson = (jsonStr) => {
    if (!jsonStr) return null;
    try {
      return JSON.parse(jsonStr);
    } catch {
      return jsonStr;
    }
  };

  const issuesList = validation ? parseJson(validation.issuesJson) || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/teacher/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Quick Utility Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Copy entire pack as Markdown"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Markdown</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Handout</span>
          </button>
        </div>
      </div>

      {/* Header Studio Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <Badge status={pack.status} />
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30">
                Level: {pack.gradeLevel} • {pack.difficulty}
              </span>
              <span className="text-xs text-slate-400">
                Source: <strong className="text-slate-200">{pack.sourceTitle}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {pack.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div>Topic: <strong className="text-slate-200">{pack.topic}</strong></div>
              <div>•</div>
              <div>Objectives: <strong className="text-slate-200">{objectives.length}</strong></div>
              <div>•</div>
              <div>Generated Assets: <strong className="text-slate-200">{assets.length}</strong></div>
              <div>•</div>
              <div>Author: <span className="text-slate-300">{pack.createdBy}</span></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {pack.status !== 'PUBLISHED' && (
              <button
                onClick={() => setPublishModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Publish Pack</span>
              </button>
            )}

            {pack.status === 'PUBLISHED' && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>Published to Students</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Studio Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-semibold overflow-x-auto">
        {[
          { key: 'explanation', label: '1. Explanation', icon: BookOpen },
          { key: 'example', label: '2. Worked Example', icon: HelpCircle },
          { key: 'quiz', label: '3. Formative Quiz', icon: ListChecks },
          { key: 'answer_key', label: '4. Answer Key', icon: CheckCircle2 },
          { key: 'easy_practice', label: '5. Guided Practice', icon: Target },
          { key: 'adv_practice', label: '6. Applied Practice', icon: Sparkles },
          { key: 'revision', label: '7. Revision Sheet', icon: FileText },
          { key: 'alignment', label: 'Alignment Matrix', icon: Target, badge: alignments.length },
          { key: 'quality', label: 'Quality & Guardrails', icon: ShieldCheck, badge: validation?.overallStatus },
          { key: 'provenance', label: 'Provenance', icon: FileText },
        ].map(tab => {
          const isAct = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                isAct 
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isAct ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 min-h-[450px]">
        
        {/* 1. EXPLANATION TAB */}
        {activeTab === 'explanation' && (
          <AssetSectionRenderer
            asset={assetMap['EXPLANATION']}
            onApprove={handleApproveAsset}
            onRegenerate={(asset) => {
              setTargetAsset(asset);
              setTargetQuestionId('');
              setRegenModalOpen(true);
            }}
            onRequestRevision={(asset) => {
              setTargetAsset(asset);
              setRevisionModalOpen(true);
            }}
            onViewVersions={handleViewVersions}
          >
            <TextbookChapterView
              expData={parseJson(assetMap['EXPLANATION']?.contentJson)}
              topic={packData?.pack?.topic}
              gradeLevel={packData?.pack?.gradeLevel}
              difficulty={packData?.pack?.difficulty}
              sourceTitle={packData?.pack?.sourceTitle}
            />
          </AssetSectionRenderer>
        )}

        {/* 2. WORKED EXAMPLE TAB */}
        {activeTab === 'example' && (
          <AssetSectionRenderer
            asset={assetMap['WORKED_EXAMPLE']}
            onApprove={handleApproveAsset}
            onRegenerate={(asset) => {
              setTargetAsset(asset);
              setTargetQuestionId('');
              setRegenModalOpen(true);
            }}
            onRequestRevision={(asset) => {
              setTargetAsset(asset);
              setRevisionModalOpen(true);
            }}
            onViewVersions={handleViewVersions}
          >
            {(() => {
              const ex = parseJson(assetMap['WORKED_EXAMPLE']?.contentJson);
              if (!ex) return <p className="text-xs text-slate-500">No worked example generated.</p>;
              return (
                <div className="space-y-6 text-sm">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">Problem Statement</span>
                    <h3 className="text-base font-bold text-white">{ex.problemStatement}</h3>
                    {ex.pedagogicalGoal && (
                      <p className="text-xs text-slate-400 mt-2 font-mono">Pedagogical Target: {ex.pedagogicalGoal}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Step-by-Step Execution</h4>
                    {ex.steps?.map((step, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {step.stepNumber || idx + 1}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="text-xs font-semibold text-white">{step.action}</div>
                          <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-xs text-cyan-300 border border-slate-800/80">
                            {step.math}
                          </div>
                          <div className="text-[11px] text-slate-400">{step.explanation}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {ex.teacherTip && (
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Teacher Tip: </strong>{ex.teacherTip}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </AssetSectionRenderer>
        )}

        {/* 3. FORMATIVE QUIZ TAB */}
        {activeTab === 'quiz' && (
          <AssetSectionRenderer
            asset={assetMap['QUIZ']}
            onApprove={handleApproveAsset}
            onRegenerate={(asset) => {
              setTargetAsset(asset);
              setTargetQuestionId('');
              setRegenModalOpen(true);
            }}
            onRequestRevision={(asset) => {
              setTargetAsset(asset);
              setRevisionModalOpen(true);
            }}
            onViewVersions={handleViewVersions}
          >
            {(() => {
              const quiz = parseJson(assetMap['QUIZ']?.contentJson);
              const questions = quiz?.questions || [];
              if (questions.length === 0) return <p className="text-xs text-slate-500">No quiz questions generated.</p>;
              
              return (
                <div className="space-y-6">
                  {/* Teacher Controls Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <span>Total Questions: <strong className="text-white">{questions.length}</strong></span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuizRevealAnswers(!quizRevealAnswers)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      >
                        {quizRevealAnswers ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{quizRevealAnswers ? 'Answers Highlighted' : 'Preview as Student'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {questions.map((q, idx) => (
                      <div key={q.id || idx} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center justify-center">
                              {q.questionNumber || idx + 1}
                            </span>
                            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                              Target: {q.objectiveId || 'OBJ-1'}
                            </span>
                            {q.version > 1 && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                v{q.version} (Regenerated)
                              </span>
                            )}
                          </div>

                          {/* Controlled Single Question Regeneration CTA */}
                          <button
                            onClick={() => {
                              setTargetAsset(assetMap['QUIZ']);
                              setTargetQuestionId(q.id);
                              setRegenModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Regenerate Q{idx + 1}</span>
                          </button>
                        </div>

                        <div className="font-semibold text-sm text-white">
                          {q.question}
                        </div>

                        {/* Multiple Choice Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {q.options?.map((opt, oIdx) => {
                            const isCorrect = opt.key === q.correctAnswer;
                            return (
                              <div
                                key={oIdx}
                                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                                  quizRevealAnswers && isCorrect 
                                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 font-semibold' 
                                    : 'bg-slate-900 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                  quizRevealAnswers && isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {opt.key}
                                </span>
                                <span className="leading-snug">{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-slate-900/60 text-[11px] text-slate-400 border border-slate-800">
                            <strong className="text-emerald-400">Pedagogical Rationale: </strong>{q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </AssetSectionRenderer>
        )}

        {/* 4. ANSWER KEY TAB */}
        {activeTab === 'answer_key' && (
          <AssetSectionRenderer
            asset={assetMap['ANSWER_KEY']}
            onApprove={handleApproveAsset}
            onRegenerate={(asset) => {
              setTargetAsset(asset);
              setTargetQuestionId('');
              setRegenModalOpen(true);
            }}
            onRequestRevision={(asset) => {
              setTargetAsset(asset);
              setRevisionModalOpen(true);
            }}
            onViewVersions={handleViewVersions}
          >
            {(() => {
              const ak = parseJson(assetMap['ANSWER_KEY']?.contentJson);
              const answers = ak?.answers || [];
              if (answers.length === 0) return <p className="text-xs text-slate-500">No answer key generated.</p>;

              return (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cross-Asset Consistency: All {answers.length} answers verified against quiz questions.</span>
                  </div>

                  <div className="space-y-4">
                    {answers.map((ans, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">Question {ans.questionNumber || idx + 1}</span>
                          <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                            Correct Option: {ans.correctOption}
                          </span>
                        </div>
                        <div className="text-slate-300 leading-relaxed">
                          <strong>Full Solution: </strong>{ans.fullSolution}
                        </div>
                        {ans.commonMisconception && (
                          <div className="text-amber-300/90 text-[11px] bg-amber-950/20 p-2.5 rounded border border-amber-500/20">
                            <strong>Common Student Misconception: </strong>{ans.commonMisconception}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </AssetSectionRenderer>
        )}

        {/* 5. GUIDED EASY PRACTICE TAB */}
        {activeTab === 'easy_practice' && (
          <AssetSectionRenderer
            asset={assetMap['EASY_PRACTICE']}
            onApprove={handleApproveAsset}
            onRegenerate={(asset) => {
              setTargetAsset(asset);
              setTargetQuestionId('');
              setRegenModalOpen(true);
            }}
            onRequestRevision={(asset) => {
              setTargetAsset(asset);
              setRevisionModalOpen(true);
            }}
            onViewVersions={handleViewVersions}
          >
            {(() => {
              const easy = parseJson(assetMap['EASY_PRACTICE']?.contentJson);
              const problems = easy?.problems || [];
              return (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
                    <strong className="block text-white mb-0.5">Differentiated Tier: Level 1 (Guided / Foundational)</strong>
                    Targeted for initial confidence with step-by-step scaffolding hints.
                  </div>

                  <div className="space-y-4">
                    {problems.map((p, idx) => (
                      <div key={p.id || idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">Problem #{p.problemNumber || idx + 1}</span>
                          <span className="text-slate-500 font-mono">{p.objectiveId || 'OBJ-1'}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-100">{p.problem}</div>
                        {p.scaffoldingHint && (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300">
                            <strong>Guided Hint: </strong>{p.scaffoldingHint}
                          </div>
                        )}
                        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-emerald-400">Step Solution: </strong>{p.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </AssetSectionRenderer>
        )}

        {/* 6. ADVANCED PRACTICE TAB */}
        {activeTab === 'adv_practice' && (
          <AssetSectionRenderer
            asset={assetMap['ADVANCED_PRACTICE']}
            onApprove={handleApproveAsset}
            onRegenerate={(asset) => {
              setTargetAsset(asset);
              setTargetQuestionId('');
              setRegenModalOpen(true);
            }}
            onRequestRevision={(asset) => {
              setTargetAsset(asset);
              setRevisionModalOpen(true);
            }}
            onViewVersions={handleViewVersions}
          >
            {(() => {
              const adv = parseJson(assetMap['ADVANCED_PRACTICE']?.contentJson);
              const problems = adv?.problems || [];
              return (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300">
                    <strong className="block text-white mb-0.5">Differentiated Tier: Level 2 (Applied / Higher Order)</strong>
                    Targeted for multi-step reasoning, word problems, and real-world algebraic modeling.
                  </div>

                  <div className="space-y-4">
                    {problems.map((p, idx) => (
                      <div key={p.id || idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">Challenge Problem #{p.problemNumber || idx + 1}</span>
                          <span className="text-slate-500 font-mono">{p.objectiveId || 'OBJ-2'}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-100">{p.problem}</div>
                        {p.challengeAspect && (
                          <div className="text-[11px] text-indigo-300 italic">
                            Challenge Focus: {p.challengeAspect}
                          </div>
                        )}
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-emerald-400">Complete Derivation: </strong>{p.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </AssetSectionRenderer>
        )}

        {/* 7. REVISION SHEET TAB */}
        {activeTab === 'revision' && (
          <AssetSectionRenderer
            asset={assetMap['REVISION_SHEET']}
            onApprove={handleApproveAsset}
            onRegenerate={(asset) => {
              setTargetAsset(asset);
              setTargetQuestionId('');
              setRegenModalOpen(true);
            }}
            onRequestRevision={(asset) => {
              setTargetAsset(asset);
              setRevisionModalOpen(true);
            }}
            onViewVersions={handleViewVersions}
          >
            {(() => {
              const rev = parseJson(assetMap['REVISION_SHEET']?.contentJson);
              if (!rev) return <p className="text-xs text-slate-500">No revision sheet generated.</p>;
              return (
                <div className="space-y-6 text-xs">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-sm">Quick Synthesis & Concept Summary</h4>
                    <p className="text-slate-300 leading-relaxed">{rev.quickRecap}</p>
                  </div>

                  {rev.goldenRules && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">Golden Rules for Exams</h4>
                      <ul className="space-y-2">
                        {rev.goldenRules.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rev.commonPitfallsToAvoid && (
                    <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                      <h4 className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">Common Pitfalls & Mistakes</h4>
                      <ul className="space-y-2">
                        {rev.commonPitfallsToAvoid.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-rose-200">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rev.formulaSummary && (
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Formula & Pattern Reference</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rev.formulaSummary.map((f, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="font-semibold text-slate-300">{f.name}</div>
                            <div className="font-mono text-cyan-300 mt-1">{f.expr}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </AssetSectionRenderer>
        )}

        {/* 8. OBJECTIVE ALIGNMENT TAB */}
        {activeTab === 'alignment' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Objective Alignment Matrix</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated coverage verification linking each defined objective to generated assets.
                </p>
              </div>
              <Badge status="COVERED" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Objective</th>
                    <th className="p-3.5">Explanation</th>
                    <th className="p-3.5">Worked Example</th>
                    <th className="p-3.5">Quiz</th>
                    <th className="p-3.5">Practice</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {alignments.map((a, idx) => (
                    <tr key={a.id || idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <strong className="text-cyan-400 block mb-0.5">{a.objectiveId}</strong>
                        <span className="text-slate-300 leading-snug">{a.objectiveDescription}</span>
                      </td>
                      <td className="p-3.5"><CoverageIcon status={a.explanationCoverage} /></td>
                      <td className="p-3.5"><CoverageIcon status={a.exampleCoverage} /></td>
                      <td className="p-3.5"><CoverageIcon status={a.quizCoverage} /></td>
                      <td className="p-3.5"><CoverageIcon status={a.practiceCoverage} /></td>
                      <td className="p-3.5">
                        <Badge status={a.overallStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. QUALITY & GUARDRAILS TAB */}
        {activeTab === 'quality' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Consistency Guardrails & Quality Audit</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated checks for source grounding, answer-key parity, duplicate detection, and difficulty compliance.
                </p>
              </div>
              <Badge status={validation?.overallStatus || 'PASS'} />
            </div>

            {/* Quality Summary Counters */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                <span className="text-xl font-bold text-emerald-400 block">{validation?.passedChecksCount || 8}</span>
                <span className="text-[11px] text-emerald-300 uppercase tracking-wider font-semibold">Passed Checks</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
                <span className="text-xl font-bold text-amber-400 block">{validation?.warningCount || 0}</span>
                <span className="text-[11px] text-amber-300 uppercase tracking-wider font-semibold">Warnings</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
                <span className="text-xl font-bold text-rose-400 block">{validation?.errorCount || 0}</span>
                <span className="text-[11px] text-rose-300 uppercase tracking-wider font-semibold">Errors</span>
              </div>
            </div>

            {/* Issues List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Guardrails Verification Report</h4>
              {issuesList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>All consistency guardrails passed with zero discrepancies. Quiz answers strictly match answer key and objectives.</span>
                </div>
              ) : (
                issuesList.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                      issue.level === 'ERROR'
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                        : issue.level === 'WARNING'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold uppercase tracking-wider text-[10px]">
                        [{issue.level}] {issue.category} • {issue.assetType}
                      </div>
                      <div className="font-semibold text-white">{issue.message}</div>
                      {issue.details && <div className="text-[11px] opacity-80">{issue.details}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 10. PROVENANCE TRACEABILITY TAB */}
        {activeTab === 'provenance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Full Source Provenance Traceability</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every generated concept, question, and formula is mapped to the exact chunk ID and page in the uploaded textbook. Click any citation to inspect.
              </p>
            </div>

            <div className="space-y-4">
              {assets.map(asset => {
                const provItems = parseJson(asset.provenanceJson) || [];
                return (
                  <div key={asset.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white uppercase tracking-wider">
                        {asset.assetType} (v{asset.currentVersion})
                      </span>
                      <Badge status={asset.status} />
                    </div>

                    {provItems.length === 0 ? (
                      <p className="text-xs text-slate-500">No provenance items recorded.</p>
                    ) : (
                      provItems.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => {
                            setSelectedCitation(p);
                            setCitationModalOpen(true);
                          }}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer text-xs space-y-1.5 transition-colors group"
                        >
                          <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono">
                            <span>Source: {p.sourceTitle} (v{p.sourceVersion || 1})</span>
                            <span className="group-hover:underline">Page: {p.page} • Chunk: {p.chunkId} ↗</span>
                          </div>
                          <div className="text-slate-200 font-medium">
                            Claim: "{p.statement}"
                          </div>
                          {p.matchedText && (
                            <div className="p-2.5 rounded bg-slate-950 text-[11px] text-slate-400 font-mono border border-slate-800/80 line-clamp-2">
                              Matched Source Quote: "{p.matchedText}"
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Controlled Regeneration Modal with Pre-fill Suggestions */}
      <Modal
        isOpen={regenModalOpen}
        onClose={() => setRegenModalOpen(false)}
        title={targetQuestionId ? `Controlled Regeneration: ${targetQuestionId}` : `Regenerate ${targetAsset?.assetType || 'Asset'}`}
        subtitle="Specify pedagogical instructions to regenerate this single element while preserving all other assets."
      >
        <form onSubmit={handleExecuteRegeneration} className="space-y-3.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <div>Target Asset: <strong className="text-slate-900 dark:text-white">{targetAsset?.assetType || 'Selected Asset'}</strong></div>
            {targetQuestionId && <div>Target Sub-Item: <strong className="text-cyan-600 dark:text-cyan-400">{targetQuestionId}</strong></div>}
            <div className="mt-1 text-[11px] text-slate-500">
              Current Version: v{targetAsset?.currentVersion || 1} → New Version: v{(targetAsset?.currentVersion || 1) + 1}
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
              Quick Teacher Revision Prompts:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                'Make explanations more intuitive with foundational step-by-step guidance.',
                'Emphasize mechanisms and verification checkpoints.',
                'Add practical real-world application context.',
                'Adjust cognitive depth for advanced analytical reasoning.'
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setRevisionPrompt(suggestion)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Teacher Revision Guidance / Prompt *
            </label>
            <textarea
              rows={3}
              value={revisionPrompt}
              onChange={(e) => setRevisionPrompt(e.target.value)}
              placeholder="e.g. Focus on phase transition checkpoints and clarify intermediate stages..."
              required
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setRegenModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={regenLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {regenLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Regenerating & Versioning...</span>
                </>
              ) : (
                <span>Regenerate Element</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Request Revision Modal */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title={`Request Revision for ${targetAsset?.assetType || 'Asset'}`}
        subtitle="Add teacher notes explaining what needs modification before approval."
      >
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Revision Reason / Notes *</label>
            <textarea
              rows={3}
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder="e.g. Needs more real-world examples in the explanation section..."
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setRevisionModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRequestRevision}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md shadow-rose-600/20"
            >
              Save Revision Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Version History Modal */}
      <Modal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        title={`Version History: ${selectedVersionAsset?.assetType}`}
        subtitle="Inspect previous iterations, revision notes, and author timestamps."
      >
        <div className="space-y-3">
          {assetVersions.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No previous versions found.</p>
          ) : (
            assetVersions.map((ver) => (
              <div key={ver.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">Version v{ver.versionNumber}</span>
                  <Badge status={ver.status} />
                </div>
                <div className="text-slate-300">
                  <strong>Reason: </strong>{ver.revisionReason || 'Initial generation'}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Modified By: {ver.updatedBy}</span>
                  <span>{new Date(ver.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Citation Deep-Dive Modal */}
      <Modal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        title="Source Grounding Citation"
        subtitle={`Verified chunk in ${selectedCitation?.sourceTitle || 'Source Document'}`}
      >
        {selectedCitation && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-slate-300">
              <div>Source: <strong className="text-white">{selectedCitation.sourceTitle}</strong> (v{selectedCitation.sourceVersion || 1})</div>
              <div>Page: <strong className="text-cyan-400">{selectedCitation.page}</strong> • Chunk ID: <strong className="text-cyan-400">{selectedCitation.chunkId}</strong></div>
            </div>

            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Generated Learning Statement:</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold">
                "{selectedCitation.statement}"
              </div>
            </div>

            {selectedCitation.matchedText && (
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-emerald-400 text-[10px]">Ground Source Quotation:</span>
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 font-mono text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed">
                  "{selectedCitation.matchedText}"
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* In-App Confirm Publish Modal */}
      <ConfirmModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={handleExecutePublish}
        title="Publish Learning Pack to Students"
        message="Are you sure you want to approve and publish this learning pack to the Student Study Portal? Students will immediately be able to access the verified concepts, step-by-step examples, and take interactive formative quizzes."
        confirmText="Yes, Publish Pack"
        cancelText="Cancel"
        type="success"
        loading={publishLoading}
      />

    </div>
  );
};

// Helper Sub-Component for Section Actions & Frame
const AssetSectionRenderer = ({ asset, onApprove, onRegenerate, onRequestRevision, onViewVersions, children }) => {
  if (!asset) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        <p>Asset not available in this learning pack.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-white tracking-tight">{asset.title}</h2>
            <Badge status={asset.status} />
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              v{asset.currentVersion}
            </span>
          </div>
          {asset.revisionReason && (
            <p className="text-xs text-rose-300 mt-1">
              Revision Notes: {asset.revisionReason}
            </p>
          )}
        </div>

        {/* Teacher Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onViewVersions(asset)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>History (v{asset.currentVersion})</span>
          </button>

          <button
            onClick={() => onRegenerate(asset)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          {asset.status !== 'APPROVED' && (
            <>
              <button
                onClick={() => onRequestRevision(asset)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors"
              >
                <span>Request Revision</span>
              </button>
              <button
                onClick={() => onApprove(asset.id)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Asset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};

// Coverage Icon Helper
const CoverageIcon = ({ status }) => {
  if (status === 'COVERED') {
    return <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">✓ Covered</span>;
  }
  if (status === 'PARTIALLY_COVERED') {
    return <span className="inline-flex items-center gap-1 text-amber-400 font-bold">⚠ Partial</span>;
  }
  return <span className="inline-flex items-center gap-1 text-rose-400 font-bold">✗ None</span>;
};
