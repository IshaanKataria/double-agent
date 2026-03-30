import { useState, useRef, useEffect } from 'react';
import type { Agent, Message, QuestionTone } from '../types/game';
import { AgentAvatar } from './AgentAvatar';
import { TypewriterText } from './TypewriterText';

interface Props {
  agent: Agent;
  messages: Message[];
  composure: number;
  onAsk: (q: string, tone: QuestionTone) => void;
  onPin: (quote: string) => void;
  loading: boolean;
  disabled: boolean;
  showTooltip: boolean;
  onDismissTooltip: () => void;
}

const TONE_CONFIG: Record<QuestionTone, { label: string; icon: string; color: string; activeColor: string }> = {
  friendly: { label: 'Friendly', icon: '\u{1F91D}', color: 'text-green-400/50 border-green-500/20', activeColor: 'text-green-400 bg-green-500/10 border-green-500/40' },
  direct: { label: 'Direct', icon: '\u{27A1}\uFE0F', color: 'text-amber-400/50 border-amber-500/20', activeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/40' },
  aggressive: { label: 'Aggressive', icon: '\u{1F4A2}', color: 'text-red-400/50 border-red-500/20', activeColor: 'text-red-400 bg-red-500/10 border-red-500/40' },
};

function ComposureMeter({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const color = pct > 70 ? 'bg-green-500/60' : pct > 45 ? 'bg-amber-500/60' : 'bg-red-500/60';
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Composure</span>
      <div className="w-20 h-1.5 bg-surface-900/80 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ChatPanel({ agent, messages, composure, onAsk, onPin, loading, disabled, showTooltip, onDismissTooltip }: Props) {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState<QuestionTone>('direct');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (!loading && !disabled) inputRef.current?.focus(); }, [loading, disabled, agent.id]);

  const submit = () => {
    if (input.trim() && !loading && !disabled) { onAsk(input.trim(), tone); setInput(''); }
  };

  const lastMsgIndex = messages.length - 1;

  return (
    <div key={agent.id} className="flex-1 flex flex-col min-w-0 agent-transition">
      {/* Agent header with composure */}
      <div className="px-4 py-3 border-b border-slate-700/30 bg-surface-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AgentAvatar avatar={agent.avatar} codename={agent.codename} />
          <div>
            <div className="text-slate-200 font-semibold text-sm">{agent.name} <span className="text-slate-500 font-normal">"{agent.codename}"</span></div>
            <div className="text-slate-500 text-xs">{agent.role} &middot; <span className="italic text-amber-500/50">{agent.personality}</span></div>
          </div>
        </div>
        <ComposureMeter value={composure} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <AgentAvatar avatar={agent.avatar} codename={agent.codename} size="lg" />
            <p className="text-slate-500 text-sm mb-4">{agent.codename} is waiting for your questions.</p>
            {agent.suggestedQuestions?.length > 0 && (
              <div className="space-y-2 max-w-sm mx-auto">
                <div className="text-amber-500/40 text-xs font-mono uppercase tracking-widest">Suggested Questions</div>
                {agent.suggestedQuestions.map((q, i) => (
                  <button key={i} onClick={() => onAsk(q, 'direct')}
                    className="w-full text-left bg-surface-700/30 hover:bg-surface-700/50 border border-slate-700/20 hover:border-amber-500/20 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-slate-300 transition">
                    "{q}"
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'player' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
              msg.role === 'player'
                ? 'bg-amber-500/10 border border-amber-500/20 text-slate-200'
                : 'bg-surface-700/60 border border-slate-700/30 text-slate-300'
            }`}>
              {msg.role === 'player' && msg.tone && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                  {TONE_CONFIG[msg.tone].icon} {msg.tone}
                </span>
              )}
              {msg.role === 'agent' && i === lastMsgIndex ? (
                <TypewriterText text={msg.content} speed={15} className="text-sm leading-relaxed" />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}
              {msg.role === 'agent' && (
                <button onClick={() => onPin(msg.content)}
                  className="mt-2 text-xs text-slate-600 hover:text-amber-400 transition flex items-center gap-1">
                  &#x1F4CC; Pin
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-700/60 border border-slate-700/30 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {showTooltip && (
        <div className="mx-4 mb-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between">
          <span className="text-amber-400/80 text-xs">Cross-reference answers between agents. Pin suspicious responses. Use tone to apply pressure.</span>
          <button onClick={onDismissTooltip} className="text-amber-500/50 hover:text-amber-400 text-xs ml-2 shrink-0">Got it</button>
        </div>
      )}

      {/* Tone selector + Input */}
      <div className="p-3 border-t border-slate-700/30 bg-surface-800/40 space-y-2">
        <div className="flex gap-1.5">
          {(Object.entries(TONE_CONFIG) as [QuestionTone, typeof TONE_CONFIG.friendly][]).map(([key, cfg]) => (
            <button key={key} onClick={() => setTone(key)}
              className={`flex-1 text-xs py-1.5 rounded-lg border transition font-semibold ${
                tone === key ? cfg.activeColor : cfg.color + ' hover:opacity-80'
              }`}>
              {cfg.icon} {cfg.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder={disabled ? 'Time expired...' : `Ask ${agent.codename} a question...`}
            disabled={loading || disabled} rows={1}
            className="flex-1 bg-surface-900/80 border border-slate-700/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none disabled:opacity-40" />
          <button onClick={submit} disabled={!input.trim() || loading || disabled}
            className="bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed px-4 rounded-xl transition text-sm font-semibold shrink-0">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
