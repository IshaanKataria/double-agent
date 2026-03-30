const AVATAR_STYLES: Record<string, { bg: string; border: string; text: string; emoji: string }> = {
  eagle: { bg: 'bg-sky-500/15', border: 'border-sky-500/30', text: 'text-sky-400', emoji: '\u{1F985}' },
  wolf: { bg: 'bg-slate-400/15', border: 'border-slate-400/30', text: 'text-slate-300', emoji: '\u{1F43A}' },
  fox: { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400', emoji: '\u{1F98A}' },
  bear: { bg: 'bg-amber-600/15', border: 'border-amber-600/30', text: 'text-amber-500', emoji: '\u{1F43B}' },
  hawk: { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-400', emoji: '\u{1F985}' },
};

interface Props {
  avatar: string;
  codename: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AgentAvatar({ avatar, codename, size = 'md' }: Props) {
  const style = AVATAR_STYLES[avatar] || AVATAR_STYLES.wolf;
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  }[size];

  return (
    <div className={`${sizeClasses} ${style.bg} ${style.border} border rounded-full flex items-center justify-center relative shrink-0`}>
      <span className={`font-display font-bold ${style.text}`}>
        {codename.charAt(0)}
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 text-[10px] leading-none">
        {style.emoji}
      </span>
    </div>
  );
}

export { AVATAR_STYLES };
