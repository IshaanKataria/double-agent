import type { Agent, Message } from '../types/game';
import { AgentAvatar } from './AgentAvatar';

export const AVATARS: Record<string, string> = {
  eagle: '\u{1F985}', wolf: '\u{1F43A}', fox: '\u{1F98A}', hawk: '\u{1F985}', bear: '\u{1F43B}',
};

interface Props {
  agents: Agent[];
  activeAgentId: string | null;
  conversations: Record<string, Message[]>;
  composure: Record<string, number>;
  onSelect: (id: string) => void;
  onAccuse: () => void;
  onToggleEvidence: () => void;
  onToggleConsensus: () => void;
  evidenceCount: number;
  consensusUsesLeft: number;
  showEvidence: boolean;
  showConsensus: boolean;
}

function ComposureDot({ value }: { value: number }) {
  const color = value > 70 ? 'bg-green-400' : value > 45 ? 'bg-amber-400' : 'bg-red-400';
  return <div className={`w-1.5 h-1.5 rounded-full ${color} shrink-0`} title={`Composure: ${value}`} />;
}

export function AgentList({ agents, activeAgentId, conversations, composure, onSelect, onAccuse, onToggleEvidence, onToggleConsensus, evidenceCount, consensusUsesLeft, showEvidence, showConsensus }: Props) {
  return (
    <div className="w-52 shrink-0 bg-surface-800/60 border-r border-slate-700/30 flex flex-col">
      <div className="p-3 border-b border-slate-700/30">
        <div className="text-amber-500/50 text-xs font-mono uppercase tracking-widest">Suspects</div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {agents.map(agent => {
          const msgs = conversations[agent.id]?.filter(m => m.role === 'player').length || 0;
          const active = agent.id === activeAgentId && !showEvidence && !showConsensus;
          const comp = composure[agent.id] ?? 88;
          return (
            <button key={agent.id} onClick={() => onSelect(agent.id)}
              className={`w-full text-left rounded-xl p-2.5 transition-all duration-200 ${
                active ? 'bg-amber-500/10 border border-amber-500/30 scale-[1.02]' : 'border border-transparent hover:bg-surface-700/50'
              }`}>
              <div className="flex items-center gap-2.5">
                <AgentAvatar avatar={agent.avatar} codename={agent.codename} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold truncate ${active ? 'text-amber-400' : 'text-slate-300'}`}>{agent.codename}</span>
                    <ComposureDot value={comp} />
                  </div>
                  <div className="text-xs text-slate-500 truncate">{agent.personality}</div>
                </div>
              </div>
              {msgs > 0 && <div className="mt-1 text-xs text-slate-600 font-mono pl-[38px]">{msgs} Qs asked</div>}
            </button>
          );
        })}
      </div>

      <div className="p-2 space-y-1.5 border-t border-slate-700/30">
        <button onClick={onToggleConsensus}
          className={`w-full text-sm py-2 rounded-xl transition font-semibold ${
            showConsensus ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
            'bg-surface-700/50 border border-slate-700/30 text-slate-400 hover:text-slate-300'
          }`}>
          &#x1F4E2; Consensus{consensusUsesLeft < 2 ? ` (${consensusUsesLeft})` : ''}
        </button>
        <button onClick={onToggleEvidence}
          className={`w-full text-sm py-2 rounded-xl transition font-semibold ${
            showEvidence ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
            'bg-surface-700/50 border border-slate-700/30 text-slate-400 hover:text-slate-300'
          }`}>
          &#x1F4CC; Evidence{evidenceCount > 0 ? ` (${evidenceCount})` : ''}
        </button>
        <button onClick={onAccuse}
          className="w-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-bold py-2 rounded-xl transition uppercase tracking-wider">
          Accuse
        </button>
      </div>
    </div>
  );
}
