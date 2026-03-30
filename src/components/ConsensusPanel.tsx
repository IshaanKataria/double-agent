import { useState } from 'react';
import type { Agent, ConsensusResult, QuestionTone } from '../types/game';
import { AgentAvatar } from './AgentAvatar';

interface Props {
  agents: Agent[];
  results: ConsensusResult[];
  usesLeft: number;
  onAsk: (q: string, tone: QuestionTone) => void;
  onPin: (agentId: string, agentName: string, quote: string) => void;
  loading: boolean;
  disabled: boolean;
}

export function ConsensusPanel({ agents, results, usesLeft, onAsk, onPin, loading, disabled }: Props) {
  const [input, setInput] = useState('');

  const submit = () => {
    if (input.trim() && !loading && !disabled && usesLeft > 0) {
      onAsk(input.trim(), 'direct');
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-4 py-3 border-b border-slate-700/30 bg-surface-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">&#x1F4E2;</span>
          <span className="text-amber-400 font-semibold text-sm">Consensus Check</span>
        </div>
        <span className={`text-xs font-mono ${usesLeft > 0 ? 'text-amber-400' : 'text-red-400'}`}>
          {usesLeft} uses remaining
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {results.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">&#x1F4E2;</div>
            <p className="text-slate-500 text-sm mb-2">Ask all 4 agents the same question simultaneously.</p>
            <p className="text-slate-600 text-xs">Compare their answers side-by-side to spot contradictions. You get 2 uses per game.</p>
          </div>
        )}

        {results.map((result, ri) => (
          <div key={ri} className="space-y-2">
            <div className="text-amber-400/60 text-xs font-mono uppercase tracking-widest">
              Consensus #{ri + 1}: "{result.question}"
            </div>
            <div className="grid grid-cols-2 gap-2">
              {agents.map(agent => {
                const response = result.responses[agent.id];
                if (!response) return null;
                return (
                  <div key={agent.id} className="bg-surface-700/40 border border-slate-700/30 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AgentAvatar avatar={agent.avatar} codename={agent.codename} size="sm" />
                      <span className="text-amber-400/80 text-xs font-semibold">{agent.codename}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{response}</p>
                    <button onClick={() => onPin(agent.id, agent.name, response)}
                      className="mt-2 text-[10px] text-slate-600 hover:text-amber-400 transition">
                      &#x1F4CC; Pin
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin text-2xl mb-2">&#x1F50D;</div>
            <p className="text-slate-500 text-sm">Asking all agents...</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-700/30 bg-surface-800/40">
        <div className="flex gap-2">
          <input value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
            placeholder={usesLeft <= 0 ? 'No consensus checks remaining' : disabled ? 'Time expired...' : 'Ask all 4 agents the same question...'}
            disabled={loading || disabled || usesLeft <= 0}
            className="flex-1 bg-surface-900/80 border border-slate-700/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 disabled:opacity-40" />
          <button onClick={submit} disabled={!input.trim() || loading || disabled || usesLeft <= 0}
            className="bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed px-4 rounded-xl transition text-sm font-semibold shrink-0">
            Ask All
          </button>
        </div>
      </div>
    </div>
  );
}
