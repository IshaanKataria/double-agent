import { useState, useRef, useEffect, useCallback } from 'react';
import type { PinnedEvidence } from '../types/game';

interface Props {
  evidence: PinnedEvidence[];
  onUnpin: (id: string) => void;
  onLink: (id1: string, id2: string) => void;
  onMove: (id: string, pos: { x: number; y: number }) => void;
  showTooltip: boolean;
  onDismissTooltip: () => void;
}

export function EvidenceBoard({ evidence, onUnpin, onLink, onMove, showTooltip, onDismissTooltip }: Props) {
  const [linkingFrom, setLinkingFrom] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, pinId: string, pos: { x: number; y: number }) => {
    if (linkingFrom) {
      if (linkingFrom !== pinId) onLink(linkingFrom, pinId);
      setLinkingFrom(null);
      return;
    }
    setDragging(pinId);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  }, [linkingFrom, onLink]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      const board = boardRef.current;
      if (!board) return;
      const rect = board.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width - 200, e.clientX - dragOffset.x - rect.left));
      const y = Math.max(0, Math.min(rect.height - 100, e.clientY - dragOffset.y - rect.top));
      onMove(dragging, { x, y });
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [dragging, dragOffset, onMove]);

  // Compute connection lines
  const connections: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const seen = new Set<string>();
  evidence.forEach(e => {
    if (e.linkedTo && !seen.has(e.id + e.linkedTo) && !seen.has(e.linkedTo + e.id)) {
      const partner = evidence.find(p => p.id === e.linkedTo);
      if (partner) {
        connections.push({
          x1: e.position.x + 100, y1: e.position.y + 50,
          x2: partner.position.x + 100, y2: partner.position.y + 50,
        });
        seen.add(e.id + e.linkedTo);
      }
    }
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-4 py-3 border-b border-slate-700/30 bg-surface-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-500/60 text-xs font-mono uppercase tracking-widest">Evidence Board</span>
          <span className="text-slate-600 text-xs">({evidence.length} pinned)</span>
        </div>
        {linkingFrom && (
          <button onClick={() => setLinkingFrom(null)} className="text-xs text-slate-500 hover:text-slate-400">Cancel link</button>
        )}
      </div>

      {showTooltip && (
        <div className="mx-4 mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between">
          <span className="text-amber-400/80 text-xs">Drag cards to arrange. Click "Link" then another card to mark contradictions.</span>
          <button onClick={onDismissTooltip} className="text-amber-500/50 hover:text-amber-400 text-xs ml-2 shrink-0">Got it</button>
        </div>
      )}

      <div ref={boardRef}
        className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--color-surface-700)_1px,_transparent_1px)] bg-[length:24px_24px]"
        style={{ minHeight: 400 }}>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((c, i) => (
            <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#ef4444" strokeWidth={2} strokeDasharray="8,4" opacity={0.6} />
          ))}
        </svg>

        {/* Evidence cards */}
        {evidence.map(pin => {
          const isLinked = !!pin.linkedTo;
          const isLinkSource = linkingFrom === pin.id;
          return (
            <div key={pin.id}
              onMouseDown={e => handleMouseDown(e, pin.id, pin.position)}
              className={`absolute w-[200px] select-none transition-shadow ${
                dragging === pin.id ? 'z-30 shadow-xl shadow-black/40 scale-105' : 'z-10'
              } ${isLinkSource ? 'ring-2 ring-amber-500/50' : ''} ${
                linkingFrom && !isLinkSource ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
              }`}
              style={{ left: pin.position.x, top: pin.position.y, zIndex: dragging === pin.id ? 30 : 10 }}>
              <div className={`rounded-lg p-3 text-xs border ${
                isLinked ? 'bg-red-500/5 border-red-500/30' : 'bg-surface-800/90 border-slate-700/40'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono font-semibold ${isLinked ? 'text-red-400' : 'text-amber-400/80'}`}>{pin.agentName}</span>
                  <div className="flex gap-1.5">
                    <button onClick={e => { e.stopPropagation(); setLinkingFrom(pin.id); }}
                      className={`hover:text-amber-400 transition ${isLinkSource ? 'text-amber-400' : 'text-slate-600'}`}
                      title="Link to another card">&#x1F517;</button>
                    <button onClick={e => { e.stopPropagation(); onUnpin(pin.id); }}
                      className="text-slate-600 hover:text-red-400 transition" title="Remove">&times;</button>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed italic line-clamp-4">"{pin.quote}"</p>
                {isLinked && <div className="mt-1.5 text-red-400/50 text-[10px] font-mono uppercase">Linked contradiction</div>}
              </div>
            </div>
          );
        })}

        {evidence.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-3 opacity-30">&#x1F4CC;</div>
              <p className="text-slate-600 text-sm">Pin quotes from interrogations to build your case.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
