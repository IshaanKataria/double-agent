import { useTypewriter } from '../hooks/useTypewriter';

interface Props {
  text: string;
  speed?: number;
  className?: string;
}

export function TypewriterText({ text, speed = 20, className = '' }: Props) {
  const { displayed, done } = useTypewriter(text, speed);

  return (
    <p className={`whitespace-pre-wrap ${className}`}>
      {displayed}
      {!done && <span className="animate-pulse text-amber-400">|</span>}
    </p>
  );
}
