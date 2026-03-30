import { useState } from 'react';
import type { Agent } from '../types/game';
import { AVATARS } from './AgentList';
import { playAccuse } from '../lib/audio';

interface Props {
  agents: Agent[];
  onAccuse: (agentId: string, reasoning: string) => void;
  onCancel?: () => void;
  timeExpired: boolean;
  loading: boolean;
}

export function AccusationModal({ agents, onAccuse, onCancel, timeExpired, loading }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState('');

  const handleAccuse = () => {
    if (!selected) return;
    playAccuse();
    onAccuse(selected, reasoning);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="max-w-lg w-full bg-surface-800 border border-red-500/30 rounded-2xl p-6 shadow-2xl shadow-red-500/10 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">{timeExpired ? '\u{23F0}' : '\u{26A0}\uFE0F'}</div>
          <h2 className="font-display text-2xl text-slate-100 mb-1">
            {timeExpired ? "Time's Up" : 'Make Your Accusation'}
          </h2>
          <p className="text-slate-500 text-sm">Who is the mole?</p>
        </div>

        <div className="space-y-2 mb-5">
          {agents.map(agent => (
            <button key={agent.id} onClick={() => setSelected(agent.id)}
              className={`w-full flex items-center gap-3 rounded-xl p-3 transition text-left ${
                selected === agent.id ? 'bg-red-500/10 border border-red-500/40' :
                'bg-surface-900/50 border border-slate-700/30 hover:border-slate-600/50'
              }`}>
              <span className="text-xl">{AVATARS[agent.avatar] || '\u{1F464}'}</span>
              <div>
                <div className={`text-sm font-semibold ${selected === agent.id ? 'text-red-400' : 'text-slate-300'}`}>{agent.name}</div>
                <div className="text-xs text-slate-500">{agent.codename} &middot; {agent.role}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mb-5">
          <div className="text-amber-500/50 text-xs font-mono uppercase tracking-widest mb-2">Present your evidence</div>
          <textarea value={reasoning} onChange={e => setReasoning(e.target.value)}
            placeholder="What contradictions did you find? Why this agent?"
            rows={3}
            className="w-full bg-surface-900/80 border border-slate-700/40 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none" />
        </div>

        <div className="flex gap-3">
          {!timeExpired && onCancel && (
            <button onClick={onCancel}
              className="flex-1 bg-surface-700/50 border border-slate-700/30 text-slate-400 hover:text-slate-300 py-3 rounded-xl transition text-sm font-semibold">
              Go Back
            </button>
          )}
          <button onClick={handleAccuse} disabled={!selected || loading}
            className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed py-3 rounded-xl transition text-sm font-bold uppercase tracking-wider">
            {loading ? 'Processing...' : 'Confirm Accusation'}
          </button>
        </div>
      </div>
    </div>
  );
}
