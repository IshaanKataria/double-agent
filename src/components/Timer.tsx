interface Props {
  timeRemaining: number;
}

export function Timer({ timeRemaining }: Props) {
  const m = Math.floor(timeRemaining / 60);
  const s = timeRemaining % 60;
  const urgent = timeRemaining <= 120;
  const critical = timeRemaining <= 30;

  return (
    <div className={`font-mono text-lg font-bold tabular-nums transition-colors ${
      critical ? 'text-red-400 animate-pulse' : urgent ? 'text-red-400' : 'text-slate-300'
    }`}>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </div>
  );
}
