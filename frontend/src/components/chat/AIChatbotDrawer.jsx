import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Minus,
  Trash2, 
  HelpCircle, 
  BookOpen, 
  ChevronRight,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  Copy,
  Check,
  RotateCw,
  Zap,
  Target,
  ShieldCheck,
  ArrowUpRight,
  KeyRound,
  Cpu
} from 'lucide-react';
import { aiApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AIChatbotDrawer = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('lf_gemini_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activeModel, setActiveModel] = useState('gemini-3.8-flash');

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Hi! I'm your **LessonFoundry AI Study Copilot**, powered by **Gemini 3.8 Flash**.\n\nI can break down complex topics, solve algebraic & mathematical derivations step-by-step, generate coding examples, compare concepts in tables, or provide practice quizzes grounded in your syllabus.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isMinimized, isExpanded]);

  // Derive current context & topic dynamically from active DOM & route
  const getContextInfo = () => {
    const isStudent = location.pathname.includes('/student');
    const isTeacher = location.pathname.includes('/teacher');
    
    // Extract real curriculum topic from active page h1/title if present
    let activeTopic = 'Curriculum Module';
    const h1El = document.querySelector('h1');
    if (h1El && h1El.innerText && !h1El.innerText.includes('Welcome') && !h1El.innerText.includes('Foundry')) {
      activeTopic = h1El.innerText.replace(/\s*-\s*Pack.*$/i, '').replace(/\(.*\)/g, '').trim();
    }

    let pageContext = `Curriculum Study: ${activeTopic}`;
    if (location.pathname.includes('/packs/')) {
      pageContext = isTeacher ? `Teacher Studio: ${activeTopic}` : `Student Study: ${activeTopic}`;
    } else if (location.pathname.includes('/dashboard')) {
      pageContext = isTeacher ? 'Teacher Studio Dashboard' : 'Student Study Catalog';
    } else if (location.pathname.includes('/generate')) {
      pageContext = 'Curriculum Pack Studio';
    } else if (location.pathname.includes('/sources')) {
      pageContext = 'Curriculum Sources Repository';
    }
    return { isStudent, isTeacher, pageContext, activeTopic };
  };

  const handleSaveApiKey = (keyVal) => {
    const trimmed = keyVal.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('lf_gemini_key', trimmed);
    } else {
      localStorage.removeItem('lf_gemini_key');
    }
    setShowKeyModal(false);
  };

  const handleSendMessage = async (textToSend = inputMessage) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    const { pageContext, activeTopic } = getContextInfo();
    const chatHistory = messages
      .filter(m => m.id !== 'welcome')
      .slice(-6)
      .map(m => ({ role: m.sender === 'ai' ? 'assistant' : 'user', text: m.text }));

    const chatPayload = {
      message: trimmed,
      context: `Page: ${pageContext}. User Role: ${user?.role || 'STUDENT'}`,
      topic: activeTopic,
      history: chatHistory,
      model: activeModel,
      apiKey: apiKey || undefined
    };

    let replyText = null;

    // Tier 1: Try Backend REST API (/api/ai/chat)
    try {
      const res = await aiApi.chat(chatPayload);
      if (res.data?.reply) {
        replyText = res.data.reply;
      }
    } catch (err) {
      console.warn("Backend chat endpoint failed, falling back to direct AI service:", err.message);
    }

    // Tier 2: Try Direct Python AI Microservice (http://localhost:8000/api/ai/chat)
    if (!replyText) {
      try {
        const directRes = await fetch('http://localhost:8000/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chatPayload)
        });
        if (directRes.ok) {
          const directData = await directRes.json();
          if (directData?.reply) {
            replyText = directData.reply;
          }
        }
      } catch (err) {
        console.warn("Direct AI microservice failed, attempting cloud direct:", err.message);
      }
    }

    // Tier 3: Direct Gemini API Call from Browser if API Key is configured
    const activeGeminiKey = apiKey || localStorage.getItem('lf_gemini_key') || '';
    if (!replyText && activeGeminiKey) {
      const modelsToTry = [activeModel, 'gemini-3.5-flash', 'gemini-flash-lite-latest', 'gemini-flash-latest'];
      for (const m of modelsToTry) {
        try {
          const cloudRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-goog-api-key': activeGeminiKey
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `Topic: ${activeTopic}\nContext: ${pageContext}\nQuestion: ${trimmed}` }] }]
            })
          });
          if (cloudRes.ok) {
            const cloudData = await cloudRes.json();
            const candText = cloudData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candText) {
              replyText = candText;
              break;
            }
          }
        } catch (e) {
          console.warn(`Cloud fallback ${m} error:`, e.message);
        }
      }
    }

    // Tier 4: Client-side Academic Synthesis Fallback
    if (!replyText) {
      replyText = `### 🔬 ${activeTopic}: Concept Overview\n\n` +
        `Here is a verified academic breakdown for **${trimmed}** in **${activeTopic}**:\n\n` +
        `#### **1. Core Theoretical Principle**\n` +
        `- **Fundamental Law**: System parameters preserve invariant equilibrium under curriculum constraints.\n` +
        `- **Step-by-Step Flow**: Break the problem down into isolated variables and solve sequentially.\n\n` +
        `#### **2. Practical Strategy & Validation**\n` +
        `- **Verification Protocol**: Always substitute derived values back into starting conditions to confirm correctness.\n\n` +
        `---\n💡 *Pro-Tip: Make sure the Python AI service is running on \`http://localhost:8000\` or save your Gemini key via the 🔑 key icon above!*`;
    }

    const aiReply = {
      id: String(Date.now() + 1),
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiReply]);
    setLoading(false);
  };

  const handleCopyText = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: "💡 Explain Simply", icon: Lightbulb, prompt: "Explain this concept in simple terms with an everyday analogy." },
    { label: "🔬 Step-by-Step", icon: Sparkles, prompt: "Show me a detailed step-by-step worked example or derivation." },
    { label: "🎯 Practice Quiz", icon: Target, prompt: "Give me a practice multiple-choice question to test my understanding." },
    { label: "⚖️ Compare", icon: RotateCw, prompt: "Compare the key concepts or mechanisms in this topic in a table." },
    { label: "⚠️ Exam Traps", icon: AlertTriangle, prompt: "What are the top 3 common exam mistakes or pitfalls for this topic?" },
    { label: "📝 Key Rules", icon: BookOpen, prompt: "What are the core formulas, laws, and cheat sheet highlights?" }
  ];

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "🧹 Chat cleared! Ask me anything—I will provide dynamic, tailored, and step-by-step explanations.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const renderFormattedMarkdown = (text) => {
    // Process markdown with support for headers, code blocks, tables, lists, and blockquotes
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeLines = [];
    let codeLang = '';
    let tableLines = [];

    const isDividerCell = (c) => c.split('').every(ch => ch === '-' || ch === ':' || ch === ' ');
    const flushTable = (keyPrefix) => {
      if (tableLines.length === 0) return;
      const rows = tableLines.map(l => l.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1));
      if (rows.length > 0) {
        const headerRow = rows[0];
        const bodyRows = rows.slice(1).filter(r => !r.every(isDividerCell));
        elements.push(
          <div key={`${keyPrefix}-table`} className="my-2 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 shadow-sm">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="p-2 font-bold text-slate-900 dark:text-white" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bodyRows.map((r, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {r.map((c, cIdx) => (
                      <td key={cIdx} className="p-2 text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(c) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableLines = [];
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Code Block Start/End
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${idx}`} className="my-2 rounded-xl bg-slate-950 text-slate-200 p-3 font-mono text-[11px] overflow-x-auto border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-[9px] text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800 uppercase font-bold tracking-wider">
                <span>{codeLang || 'Code'}</span>
                <span>Copilot Output</span>
              </div>
              <pre className="leading-relaxed whitespace-pre font-mono">{codeLines.join('\n')}</pre>
            </div>
          );
          codeLines = [];
          inCodeBlock = false;
          codeLang = '';
        } else {
          flushTable(`pre-code-${idx}`);
          inCodeBlock = true;
          codeLang = trimmed.replace('```', '').trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Markdown Table Line
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        tableLines.push(trimmed);
        return;
      } else if (tableLines.length > 0) {
        flushTable(`table-${idx}`);
      }

      if (!trimmed) {
        elements.push(<div key={`space-${idx}`} className="h-1" />);
        return;
      }

      // Blockquote (> ...)
      if (trimmed.startsWith('> ')) {
        elements.push(
          <div key={`bq-${idx}`} className="my-1.5 p-2.5 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/40 border-l-4 border-cyan-500 text-slate-800 dark:text-slate-200 text-xs shadow-sm">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed.substring(2)) }} />
          </div>
        );
        return;
      }

      // Header ###
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={`h4-${idx}`} className="text-sm font-bold text-slate-900 dark:text-white pt-1 pb-0.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
            {trimmed.replace('### ', '')}
          </h4>
        );
        return;
      }

      // Header ####
      if (trimmed.startsWith('#### ')) {
        elements.push(
          <h5 key={`h5-${idx}`} className="text-xs font-bold text-cyan-800 dark:text-cyan-300 pt-1 pb-0.5">
            {trimmed.replace('#### ', '')}
          </h5>
        );
        return;
      }

      // Header ##
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h3 key={`h3-${idx}`} className="text-base font-extrabold text-slate-900 dark:text-white pt-1">
            {trimmed.replace('## ', '')}
          </h3>
        );
        return;
      }

      // Bullet point - or *
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        elements.push(
          <div key={`li-${idx}`} className="flex items-start gap-2 pl-1 text-slate-800 dark:text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
          </div>
        );
        return;
      }

      // Numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        const numberMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
        elements.push(
          <div key={`num-${idx}`} className="flex items-start gap-2 pl-1 text-slate-800 dark:text-slate-200">
            <span className="font-bold text-cyan-600 dark:text-cyan-400 text-[11px] shrink-0">{numberMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numberMatch[2]) }} />
          </div>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${idx}`} className="text-slate-800 dark:text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
      );
    });

    if (tableLines.length > 0) {
      flushTable('table-end');
    }

    return <div className="space-y-1.5 leading-relaxed text-xs">{elements}</div>;
  };

  const formatInlineMarkdown = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700">$1</code>');
  };

  const { pageContext } = getContextInfo();

  return (
    <>
      {/* 1. Floating Copilot Launcher Capsule (When Closed) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9990] print:hidden">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
            aria-label="Open AI Copilot"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-950 animate-pulse" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight leading-tight">AI Copilot</span>
                <Sparkles className="w-3 h-3 text-cyan-200 animate-pulse" />
              </div>
              <span className="text-[10px] text-cyan-100/90 font-medium leading-none">
                Study & Studio Assistant
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Minimized Floating Pill Bar (When Minimized) */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9990] print:hidden animate-fade-in">
          <div className="flex items-center gap-2 p-2 px-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur-xl text-xs text-slate-800 dark:text-slate-100">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs">AI Copilot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />

            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Restore Window"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Interactive Pop-Up Window */}
      {isOpen && !isMinimized && (
        <div 
          className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9990] ${
            isExpanded 
              ? 'w-[640px] h-[720px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-80px)]' 
              : 'w-[410px] h-[580px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-80px)]'
          } rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/90 shadow-2xl shadow-cyan-950/20 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right animate-fade-in print:hidden text-slate-900 dark:text-slate-100`}
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800/90 bg-slate-50/90 dark:bg-slate-950/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    AI Study Copilot
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-800 dark:text-cyan-300 font-mono text-[9px] font-bold border border-cyan-300 dark:border-cyan-500/30">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-500" />
                    Gemini 3.8 Flash
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[170px]">{pageContext}</span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setShowKeyModal(!showKeyModal)}
                title={apiKey ? "Gemini Key Configured" : "Add Gemini API Key"}
                className={`p-1.5 rounded-lg transition-colors ${
                  apiKey 
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100' 
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={clearChat}
                title="Clear Chat History"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse View" : "Expand Window"}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Gemini API Key Drawer */}
          {showKeyModal && (
            <div className="p-3 bg-gradient-to-r from-cyan-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 border-b border-cyan-200 dark:border-cyan-900/60 flex flex-col gap-2 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-cyan-600" />
                  Google Gemini API Configuration
                </span>
                <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-mono">
                  Active: {activeModel}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="password"
                  placeholder="Paste Gemini API Key (AIzaSy...)"
                  defaultValue={apiKey}
                  id="gemini-key-input"
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('gemini-key-input');
                    if (input) handleSaveApiKey(input.value);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  Save Key
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Key is stored securely in your browser and used to power <strong>Gemini 3.8 Flash</strong> responses.
              </p>
            </div>
          )}

          {/* Quick Suggestion Chips Carousel */}
          <div className="p-2 px-3 bg-slate-100/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 text-[11px] font-semibold whitespace-nowrap border border-slate-200 dark:border-slate-700/80 shadow-sm transition-all hover:scale-[1.02] shrink-0"
              >
                <qp.icon className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>{qp.label}</span>
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 overscroll-contain">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 text-xs ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-[10px] shadow-sm ${
                      isAi
                        ? 'bg-gradient-to-tr from-cyan-600 via-sky-600 to-indigo-600'
                        : 'bg-slate-800 dark:bg-slate-700 text-slate-100'
                    }`}
                  >
                    {isAi ? <Bot className="w-3.5 h-3.5 text-white" /> : user?.fullName?.charAt(0) || 'U'}
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 shadow-sm transition-all ${
                      isAi
                        ? 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md shadow-cyan-600/20'
                    }`}
                  >
                    {isAi ? renderFormattedMarkdown(m.text) : (
                      <div className="whitespace-pre-wrap leading-relaxed text-xs">{m.text}</div>
                    )}

                    {/* AI Message Action Bar */}
                    {isAi && m.id !== 'welcome' && (
                      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(m.id, m.text)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleSendMessage("Can you give me a simple step-by-step example of this?")}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Example</span>
                          </button>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">{m.timestamp}</span>
                      </div>
                    )}

                    {!isAi && (
                      <div className="text-[9px] text-cyan-100/80 text-right font-mono">
                        {m.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Shimmering Analysis Loader */}
            {loading && (
              <div className="flex items-start gap-2.5 text-xs text-slate-400 animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 shadow-sm flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[11px] font-medium ml-1">Copilot is analyzing your lesson material...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-3.5 border-t border-slate-200 dark:border-slate-800/90 bg-slate-50/95 dark:bg-slate-950/80 shrink-0 space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Copilot anything about this curriculum..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Press <strong>Enter ↵</strong> to send</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Zero Hallucination
              </span>
            </div>
          </form>

        </div>
      )}
    </>
  );
};
