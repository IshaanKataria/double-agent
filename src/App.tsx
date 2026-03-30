import { useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { useTimer } from './hooks/useTimer';
import { initAudio, startDrone, startTicking, stopTicking, stopAll } from './lib/audio';
import { MenuScreen } from './components/MenuScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { BriefingScreen } from './components/BriefingScreen';
import { AgentList } from './components/AgentList';
import { ChatPanel } from './components/ChatPanel';
import { ConsensusPanel } from './components/ConsensusPanel';
import { EvidenceBoard } from './components/EvidenceBoard';
import { Timer } from './components/Timer';
import { AccusationModal } from './components/AccusationModal';
import { RevealScreen } from './components/RevealScreen';

export default function App() {
  const game = useGame();
  const timer = useTimer();
  const { state } = game;

  // Start timer when investigation begins
  useEffect(() => {
    if (state.phase === 'investigation' && !timer.isRunning && timer.timeRemaining > 0) {
      timer.start();
      initAudio();
      startDrone();
    }
  }, [state.phase]);

  // Audio: ticking when urgent
  useEffect(() => {
    if (state.phase !== 'investigation') return;
    if (timer.timeRemaining <= 120 && timer.timeRemaining > 30) {
      startTicking(false);
    } else if (timer.timeRemaining <= 30 && timer.timeRemaining > 0) {
      startTicking(true);
    } else {
      stopTicking();
    }
  }, [timer.timeRemaining, state.phase]);

  // Last 60 seconds = force accusation
  useEffect(() => {
    if (timer.timeRemaining <= 60 && timer.timeRemaining > 0 && state.phase === 'investigation') {
      game.beginAccusation();
    }
  }, [timer.timeRemaining, state.phase]);

  // Time fully expired during accusation = still force it
  useEffect(() => {
    if (timer.isExpired && state.phase === 'investigation') game.beginAccusation();
  }, [timer.isExpired, state.phase]);

  // Stop audio on accusation/reveal
  useEffect(() => {
    if (state.phase === 'accusation' || state.phase === 'reveal') {
      timer.pause();
      stopAll();
    }
  }, [state.phase]);

  useEffect(() => () => stopAll(), []);

  // -- SCREENS --

  if (state.phase === 'menu') {
    return <><Scanlines /><MenuScreen onStart={game.startGame} loading={game.loading} error={game.error} /></>;
  }

  if (state.phase === 'loading') {
    return <><Scanlines /><LoadingScreen /></>;
  }

  if (state.phase === 'briefing' && state.scenario) {
    return <><Scanlines /><BriefingScreen scenario={state.scenario} onBegin={game.beginInvestigation} /></>;
  }

  if (state.phase === 'reveal') {
    return <><Scanlines /><RevealScreen state={state} onPlayAgain={() => { game.resetGame(); timer.reset(); }} /></>;
  }

  if (!state.scenario) return null;

  const activeAgent = state.scenario.agents.find(a => a.id === state.activeAgentId);
  const activeMessages = state.activeAgentId ? state.conversations[state.activeAgentId] || [] : [];
  const isUrgent = timer.timeRemaining <= 120 && timer.timeRemaining > 0;

  return (
    <div className={`h-screen flex flex-col transition-all duration-1000 ${isUrgent ? 'urgency-active' : ''}`}>
      <Scanlines />

      {/* Top bar */}
      <div className="bg-surface-800/60 border-b border-slate-700/30 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg">&#x1F575;&#xFE0F;</span>
          <span className="font-display text-sm text-slate-500 uppercase tracking-wider hidden sm:block">
            {state.scenario.missionName}
          </span>
        </div>
        <Timer timeRemaining={timer.timeRemaining} />
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        <AgentList
          agents={state.scenario.agents}
          activeAgentId={state.activeAgentId}
          conversations={state.conversations}
          composure={state.composure}
          onSelect={game.selectAgent}
          onAccuse={game.beginAccusation}
          onToggleEvidence={game.toggleEvidenceBoard}
          onToggleConsensus={game.toggleConsensus}
          evidenceCount={state.pinnedEvidence.length}
          consensusUsesLeft={state.consensusUsesLeft}
          showEvidence={state.showEvidenceBoard}
          showConsensus={state.showConsensus}
        />

        {state.showConsensus ? (
          <ConsensusPanel
            agents={state.scenario.agents}
            results={state.consensusResults}
            usesLeft={state.consensusUsesLeft}
            onAsk={game.consensusCheck}
            onPin={game.pinEvidence}
            loading={game.chatLoading}
            disabled={timer.isExpired}
          />
        ) : state.showEvidenceBoard ? (
          <EvidenceBoard
            evidence={state.pinnedEvidence}
            onUnpin={game.unpinEvidence}
            onLink={game.linkEvidence}
            onMove={game.moveEvidence}
            showTooltip={!state.tooltipsSeen.has('evidence')}
            onDismissTooltip={() => game.dismissTooltip('evidence')}
          />
        ) : activeAgent ? (
          <ChatPanel
            agent={activeAgent}
            messages={activeMessages}
            composure={state.composure[activeAgent.id] ?? 88}
            onAsk={game.askQuestion}
            onPin={(q) => game.pinEvidence(activeAgent.id, activeAgent.name, q)}
            loading={game.chatLoading}
            disabled={timer.isExpired}
            showTooltip={!state.tooltipsSeen.has('chat') && activeMessages.length === 0}
            onDismissTooltip={() => game.dismissTooltip('chat')}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-600 text-sm">Select an agent to interrogate.</p>
          </div>
        )}
      </div>

      {/* Accusation modal */}
      {state.phase === 'accusation' && (
        <AccusationModal
          agents={state.scenario.agents}
          onAccuse={(id, reasoning) => game.makeAccusation(id, reasoning, timer.timeRemaining)}
          onCancel={timer.timeRemaining > 60 ? () => { game.beginInvestigation(); timer.start(); } : undefined}
          timeExpired={timer.timeRemaining <= 60}
          loading={game.loading}
        />
      )}

      {game.error && (
        <div className="fixed bottom-4 right-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm max-w-xs z-50">
          {game.error}
        </div>
      )}
    </div>
  );
}

function Scanlines() {
  return (
    <>
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' }} />
      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-[9998]"
        style={{ boxShadow: 'inset 0 0 120px 60px rgba(0,0,0,0.4)' }} />
      {/* Film grain */}
      <div className="pointer-events-none fixed inset-0 z-[9997] opacity-[0.035] film-grain" />
    </>
  );
}
