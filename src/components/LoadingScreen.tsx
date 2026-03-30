import { useTypewriter } from '../hooks/useTypewriter';

const LINES = [
  'ACCESSING PERSONNEL DATABASE...',
  'CROSS-REFERENCING MISSION REPORTS...',
  'ANALYZING FIELD COMMUNICATIONS...',
  'FLAGGING TIMELINE ANOMALIES...',
  'COMPILING DOSSIERS...',
  'BRIEFING READY.',
];

export function LoadingScreen() {
  const text = LINES.join('\n');
  const { displayed } = useTypewriter(text, 25);
  const lines = displayed.split('\n');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-mono uppercase tracking-widest">
            Classified
          </div>
        </div>

        <div className="bg-surface-800/80 border border-slate-700/50 rounded-xl p-6 font-mono text-sm">
          {lines.map((line, i) => (
            <div key={i} className={`mb-1 ${
              line === 'BRIEFING READY.' ? 'text-green-400' :
              line.startsWith('FLAGGING') ? 'text-amber-400' :
              'text-slate-400'
            }`}>
              <span className="text-slate-600 mr-2">&gt;</span>
              {line}
              {i === lines.length - 1 && !line.endsWith('.') && (
                <span className="animate-pulse text-amber-400">_</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
