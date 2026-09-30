import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertTriangle, RefreshCw, Cpu, Server } from 'lucide-react';
import axios from 'axios';

export const ServiceHealthBadge = () => {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'healthy' | 'error' | 'checking'
  const [aiStatus, setAiStatus] = useState('checking');
  const [isOpen, setIsOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = async () => {
    // Check Spring Boot backend
    try {
      const res = await axios.get('http://localhost:8085/api/sources', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        timeout: 3000
      });
      setBackendStatus('healthy');
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403 || err.response.status === 200)) {
        setBackendStatus('healthy'); // Endpoint responded, service is up
      } else {
        setBackendStatus('error');
      }
    }

    // Check FastAPI AI microservice
    try {
      const res = await axios.get('http://localhost:8000/health', { timeout: 3000 });
      if (res.data?.status === 'healthy') {
        setAiStatus('healthy');
      } else {
        setAiStatus('warning');
      }
    } catch {
      setAiStatus('error');
    }

    setLastChecked(new Date());
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Re-check every 30s
    return () => clearInterval(interval);
  }, []);

  const isAllHealthy = backendStatus === 'healthy' && aiStatus === 'healthy';

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
          isAllHealthy
            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/60'
            : 'bg-amber-950/60 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
        }`}
        title="Microservice Status & AI Engine Health"
      >
        <span className={`w-2 h-2 rounded-full ${isAllHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
        <span className="hidden sm:inline">System:</span>
        <span>{isAllHealthy ? 'Ready' : 'Checking'}</span>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-2xl glass-panel shadow-2xl border border-slate-700/80 p-4 z-50 animate-fade-in text-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">System Architecture</span>
            </div>
            <button
              onClick={checkHealth}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title="Refresh Health"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 text-xs">
            {/* Backend status */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="font-semibold text-slate-200">Spring Boot API</div>
                  <div className="text-[10px] text-slate-500 font-mono">Port 8085 • Java 21</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                backendStatus === 'healthy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {backendStatus === 'healthy' ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>

            {/* AI Microservice status */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold text-slate-200">AI Microservice</div>
                  <div className="text-[10px] text-slate-500 font-mono">Port 8000 • RAG + Guardrails</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                aiStatus === 'healthy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {aiStatus === 'healthy' ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            {/* Grounding Engine Info */}
            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-relaxed">
              <strong>Grounding Engine:</strong> Cosine Vector RAG + Deterministic Pedagogical Synthesizer with cross-asset constraint verification.
            </div>
          </div>

          {lastChecked && (
            <div className="mt-3 text-[10px] text-slate-500 text-right">
              Checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
