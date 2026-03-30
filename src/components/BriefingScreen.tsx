import type { Scenario } from '../types/game';
import { AgentAvatar, AVATAR_STYLES } from './AgentAvatar';

interface Props {
  scenario: Scenario;
  onBegin: () => void;
}

export function BriefingScreen({ scenario, onBegin }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fadeIn">
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
            Top Secret
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-slate-100 tracking-wide mb-1">{scenario.missionName}</h1>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>

        {/* Mission brief - classified document style */}
        <div className="bg-surface-800/80 border border-slate-700/50 rounded-2xl p-6 mb-4 relative overflow-hidden">
          <div className="absolute top-3 right-3 text-red-500/10 font-display text-4xl font-bold -rotate-12 select-none pointer-events-none">
            CLASSIFIED
          </div>
          <div className="text-amber-500/70 text-xs font-mono uppercase tracking-widest mb-2">Mission Brief</div>
          <p className="text-slate-300 leading-relaxed mb-3">{scenario.missionBrief}</p>
          <div className="flex gap-4 text-xs text-slate-500 font-mono">
            <span>&#x1F4CD; {scenario.location}</span>
            <span>&#x1F553; {scenario.timeframe}</span>
          </div>
        </div>

        {/* Agent dossier cards */}
        <div className="bg-surface-800/80 border border-slate-700/50 rounded-2xl p-6 mb-4">
          <div className="text-amber-500/70 text-xs font-mono uppercase tracking-widest mb-4">Personnel Dossiers</div>
          <div className="grid grid-cols-2 gap-3">
            {scenario.agents.map(agent => {
              const style = AVATAR_STYLES[agent.avatar] || AVATAR_STYLES.wolf;
              return (
                <div key={agent.id} className={`relative rounded-xl p-4 border ${style.border} ${style.bg} overflow-hidden`}>
                  {/* Corner stamp */}
                  <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-600 uppercase tracking-widest border border-slate-700/30 rounded px-1.5 py-0.5">
                    Lvl 4
                  </div>

                  <div className="flex items-start gap-3">
                    <AgentAvatar avatar={agent.avatar} codename={agent.codename} size="lg" />
                    <div className="min-w-0 pt-0.5">
                      <div className="text-slate-200 font-semibold text-sm">{agent.name}</div>
                      <div className={`text-xs font-mono ${style.text} opacity-70`}>"{agent.codename}"</div>
                      <div className="text-slate-500 text-xs mt-1">{agent.role}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700/20 space-y-1.5">
                    <div className="flex gap-1.5">
                      <span className="text-slate-600 text-[10px] font-mono uppercase w-16 shrink-0">Profile</span>
                      <span className="text-slate-400 text-xs italic">{agent.personality}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-slate-600 text-[10px] font-mono uppercase w-16 shrink-0">History</span>
                      <span className="text-slate-400 text-xs">{agent.background}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mb-6 text-center">
          <p className="text-red-400/80 text-sm">
            Intel confirms <span className="text-red-400 font-bold">one agent is compromised</span>. You have <span className="font-bold text-red-400">6 minutes</span> to identify the mole.
          </p>
        </div>

        <button onClick={onBegin}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-display font-bold text-lg py-4 rounded-xl transition shadow-lg shadow-amber-600/20 uppercase tracking-wider">
          Begin Interrogation
        </button>
      </div>
    </div>
  );
}
