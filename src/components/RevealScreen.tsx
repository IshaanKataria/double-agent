import { useState, useEffect } from 'react';
import type { GameState } from '../types/game';
import { AVATARS } from './AgentList';
import { TypewriterText } from './TypewriterText';

interface Props {
  state: GameState;
  onPlayAgain: () => void;
}

export function RevealScreen({ state, onPlayAgain }: Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 1000),
      setTimeout(() => setStage(2), 2500),
      setTimeout(() => setStage(3), 4000),
      setTimeout(() => setStage(4), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!state.scenario) return null;
  const { scenario, accusedAgentId, stats, moleConfession } = state;
  const isCorrect = stats.correct;
  const mole = scenario.agents.find(a => a.id === scenario.moleId)!;
  const accused = scenario.agents.find(a => a.id === accusedAgentId)!;
  const timeUsed = 360 - stats.timeRemainingOnAccusation;

  return (
    <div className="min-h-screen overflow-y-auto p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Stage 0: Suspense */}
        {stage === 0 && (
          <div className="text-center py-32 animate-pulse">
            <div className="text-5xl mb-4">&#x1F50D;</div>
            <p className="font-display text-2xl text-slate-400">Analyzing accusation...</p>
          </div>
        )}

        {/* Stage 1: Your choice */}
        {stage >= 1 && (
          <div className="text-center pt-12 animate-fadeIn">
            <div className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-4">You accused</div>
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-3xl">{AVATARS[accused.avatar]}</span>
              <span className="font-display text-3xl text-slate-200">{accused.name}</span>
            </div>
            <div className="text-slate-500 text-sm">"{accused.codename}" &middot; {accused.role}</div>
          </div>
        )}

        {/* Stage 2: Verdict */}
        {stage >= 2 && (
          <div className="text-center animate-fadeIn">
            <div className="text-6xl mb-3">{isCorrect ? '\u{1F3AF}' : '\u{274C}'}</div>
            <h1 className={`font-display text-4xl mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'MOLE IDENTIFIED' : 'WRONG AGENT'}
            </h1>
            {!isCorrect && (
              <p className="text-slate-400">The real mole was <span className="text-red-400 font-bold">{mole.name}</span></p>
            )}
          </div>
        )}

        {/* Stage 3: Mole confrontation */}
        {stage >= 3 && moleConfession && (
          <div className="bg-surface-800/80 border border-red-500/20 rounded-2xl p-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{AVATARS[mole.avatar]}</span>
              <div>
                <div className="text-slate-200 font-semibold">{mole.name}</div>
                <div className="text-red-400/60 text-xs font-mono uppercase">The Mole</div>
              </div>
            </div>
            <div className="bg-surface-900/50 rounded-xl p-4 border-l-2 border-red-500/40">
              <TypewriterText text={moleConfession} speed={25} className="text-slate-300 text-sm leading-relaxed italic" />
            </div>
            <div className="mt-3 text-slate-600 text-xs italic">{scenario.moleMotivation}</div>
          </div>
        )}

        {/* Stage 4: Full debrief + stats */}
        {stage >= 4 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Investigation stats */}
            <div className="bg-surface-800/80 border border-slate-700/50 rounded-2xl p-6">
              <div className="text-amber-500/60 text-xs font-mono uppercase tracking-widest mb-4">Investigation Report</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ['\u{2753}', String(stats.questionsAsked), 'Questions Asked'],
                  ['\u{1F4CC}', String(stats.pinsCreated), 'Evidence Pinned'],
                  ['\u{1F517}', String(stats.contradictionsFound), 'Links Made'],
                  ['\u{23F1}\uFE0F', `${Math.floor(timeUsed / 60)}:${String(timeUsed % 60).padStart(2, '0')}`, 'Time Used'],
                ].map(([icon, val, label]) => (
                  <div key={label} className="bg-surface-900/50 rounded-xl p-3 text-center">
                    <div className="text-lg mb-1">{icon}</div>
                    <div className="text-slate-200 font-bold text-lg">{val}</div>
                    <div className="text-slate-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contradictions */}
            <div className="bg-surface-800/80 border border-red-500/20 rounded-2xl p-6">
              <div className="text-red-400/60 text-xs font-mono uppercase tracking-widest mb-4">
                Contradictions ({scenario.contradictions.length})
              </div>
              <div className="space-y-4">
                {scenario.contradictions.map((c, i) => (
                  <div key={i}>
                    <div className="text-amber-400 text-sm font-semibold mb-2">{c.topic}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                        <div className="text-red-400/50 text-[10px] font-mono uppercase mb-1">Mole Claimed</div>
                        <p className="text-slate-400 text-xs">{c.moleClaim}</p>
                      </div>
                      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <div className="text-green-400/50 text-[10px] font-mono uppercase mb-1">Truth</div>
                        <p className="text-slate-400 text-xs">{c.truth}</p>
                      </div>
                    </div>
                    <div className="text-slate-600 text-xs mt-1">Discoverable by: {c.howToDiscover}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onPlayAgain}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-display font-bold text-lg py-4 rounded-xl transition shadow-lg shadow-amber-600/20 uppercase tracking-wider">
              New Mission
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
