import { useState } from 'react';

interface Props {
  onStart: (apiKey: string) => void;
  loading: boolean;
  error: string | null;
}

export function MenuScreen({ onStart, loading, error }: Props) {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_ANTHROPIC_API_KEY || '');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-5xl mb-4">&#x1F575;&#xFE0F;</div>
          <h1 className="font-display text-5xl md:text-6xl text-slate-100 tracking-wider mb-3">
            DOUBLE AGENT
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-4" />
          <p className="text-slate-400 text-lg">One of your agents has been turned. Find the mole.</p>
        </div>

        <div className="bg-surface-800/80 backdrop-blur border border-slate-700/50 rounded-2xl p-8 mb-6">
          <div className="mb-6 text-left space-y-3">
            {[
              ['01', 'Read the mission briefing. Study the 4 agents.', 'text-slate-300'],
              ['02', 'Interrogate them. Cross-reference their stories.', 'text-amber-400'],
              ['03', 'Pin evidence. Find contradictions. Accuse the mole.', 'text-red-400'],
            ].map(([num, text, color]) => (
              <div key={num} className="flex items-start gap-3">
                <span className="text-amber-500 text-lg mt-0.5 font-mono shrink-0">{num}</span>
                <p className={`${color} text-sm`}>{text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Anthropic API key..."
              className="w-full bg-surface-900/80 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition font-mono text-sm"
            />
            <button
              onClick={() => onStart(apiKey)}
              disabled={!apiKey.trim() || loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-display font-bold text-lg py-3 rounded-xl transition shadow-lg shadow-amber-600/20 uppercase tracking-wider"
            >
              {loading ? 'Generating...' : 'Begin Debrief'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}
        </div>
        <p className="text-slate-700 text-xs">API key stays in your browser. Never stored or logged.</p>
      </div>
    </div>
  );
}
