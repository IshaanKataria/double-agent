import { useState, useCallback } from 'react';
import type { GameState, Message, PinnedEvidence, GameStats, QuestionTone, ConsensusResult } from '../types/game';
import { initClient, generateScenario, sendMessage, sendConsensusCheck, getMoleConfession } from '../lib/ai';
import { playPin, playReceive } from '../lib/audio';

const EMPTY_STATS: GameStats = {
  questionsAsked: 0, questionsPerAgent: {}, timeSpentPerAgent: {},
  pinsCreated: 0, contradictionsFound: 0, timeRemainingOnAccusation: 0, correct: false,
};

const INITIAL: GameState = {
  phase: 'menu', scenario: null, conversations: {},
  activeAgentId: null, pinnedEvidence: [], accusedAgentId: null,
  playerReasoning: '', showEvidenceBoard: false, moleConfession: null,
  stats: { ...EMPTY_STATS }, agentSelectTime: 0, tooltipsSeen: new Set(),
  composure: {}, consensusUsesLeft: 2, consensusResults: [], showConsensus: false,
};

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = useCallback(async (apiKey: string) => {
    setLoading(true); setError(null);
    setState(s => ({ ...s, phase: 'loading' }));
    try {
      initClient(apiKey);
      const scenario = await generateScenario();
      const conversations: Record<string, Message[]> = {};
      const composure: Record<string, number> = {};
      scenario.agents.forEach(a => { conversations[a.id] = []; composure[a.id] = a.isMole ? 82 : 88; });
      setState({
        ...INITIAL, phase: 'briefing', scenario, conversations, composure,
        activeAgentId: scenario.agents[0].id, tooltipsSeen: new Set(),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate scenario');
      setState(s => ({ ...s, phase: 'menu' }));
    } finally { setLoading(false); }
  }, []);

  const beginInvestigation = useCallback(() => {
    setState(s => ({ ...s, phase: 'investigation', agentSelectTime: Date.now() }));
  }, []);

  const selectAgent = useCallback((agentId: string) => {
    setState(s => {
      const now = Date.now();
      const prev = s.activeAgentId;
      const elapsed = prev ? (now - s.agentSelectTime) / 1000 : 0;
      const timeSpent = { ...s.stats.timeSpentPerAgent };
      if (prev) timeSpent[prev] = (timeSpent[prev] || 0) + elapsed;
      return { ...s, activeAgentId: agentId, showEvidenceBoard: false, showConsensus: false,
        agentSelectTime: now, stats: { ...s.stats, timeSpentPerAgent: timeSpent } };
    });
  }, []);

  const askQuestion = useCallback(async (question: string, tone: QuestionTone = 'direct') => {
    if (!state.scenario || !state.activeAgentId) return;
    setChatLoading(true); setError(null);
    const agentId = state.activeAgentId;
    const playerMsg: Message = { role: 'player', content: question, agentId, timestamp: Date.now(), tone };

    setState(s => ({
      ...s,
      conversations: { ...s.conversations, [agentId]: [...(s.conversations[agentId] || []), playerMsg] },
      stats: { ...s.stats, questionsAsked: s.stats.questionsAsked + 1,
        questionsPerAgent: { ...s.stats.questionsPerAgent, [agentId]: (s.stats.questionsPerAgent[agentId] || 0) + 1 } },
    }));

    try {
      const history = [...(state.conversations[agentId] || []), playerMsg];
      const { content, composure } = await sendMessage(state.scenario, agentId, history, question, tone);
      playReceive();
      const agentMsg: Message = { role: 'agent', content, agentId, timestamp: Date.now() };
      setState(s => ({
        ...s,
        conversations: { ...s.conversations, [agentId]: [...(s.conversations[agentId] || []), agentMsg] },
        composure: composure >= 0 ? { ...s.composure, [agentId]: composure } : s.composure,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get response');
    } finally { setChatLoading(false); }
  }, [state.scenario, state.activeAgentId, state.conversations]);

  const consensusCheck = useCallback(async (question: string, tone: QuestionTone = 'direct') => {
    if (!state.scenario || state.consensusUsesLeft <= 0) return;
    setChatLoading(true); setError(null);

    setState(s => ({ ...s, consensusUsesLeft: s.consensusUsesLeft - 1 }));

    try {
      const results = await sendConsensusCheck(state.scenario, state.conversations, question, tone);

      const newConversations = { ...state.conversations };
      const newComposure = { ...state.composure };
      const responses: Record<string, string> = {};

      for (const [agentId, { content, composure }] of Object.entries(results)) {
        const playerMsg: Message = { role: 'player', content: question, agentId, timestamp: Date.now(), tone };
        const agentMsg: Message = { role: 'agent', content, agentId, timestamp: Date.now() };
        newConversations[agentId] = [...(newConversations[agentId] || []), playerMsg, agentMsg];
        if (composure >= 0) newComposure[agentId] = composure;
        responses[agentId] = content;
      }

      const result: ConsensusResult = { question, responses };

      setState(s => ({
        ...s,
        conversations: newConversations,
        composure: newComposure,
        consensusResults: [...s.consensusResults, result],
        showConsensus: true,
        stats: { ...s.stats, questionsAsked: s.stats.questionsAsked + 4,
          questionsPerAgent: Object.keys(results).reduce((acc, id) => ({
            ...acc, [id]: (s.stats.questionsPerAgent[id] || 0) + 1
          }), { ...s.stats.questionsPerAgent }),
        },
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Consensus check failed');
    } finally { setChatLoading(false); }
  }, [state.scenario, state.conversations, state.composure, state.consensusUsesLeft]);

  const pinEvidence = useCallback((agentId: string, agentName: string, quote: string) => {
    playPin();
    setState(s => {
      if (s.pinnedEvidence.some(e => e.quote === quote && e.agentId === agentId)) return s;
      const col = s.pinnedEvidence.length % 3;
      const row = Math.floor(s.pinnedEvidence.length / 3);
      const pin: PinnedEvidence = {
        id: `pin_${Date.now()}`, agentId, agentName, quote, linkedTo: null,
        position: { x: 20 + col * 220, y: 20 + row * 140 },
      };
      return { ...s, pinnedEvidence: [...s.pinnedEvidence, pin],
        stats: { ...s.stats, pinsCreated: s.stats.pinsCreated + 1 } };
    });
  }, []);

  const unpinEvidence = useCallback((pinId: string) => {
    setState(s => ({
      ...s, pinnedEvidence: s.pinnedEvidence
        .filter(e => e.id !== pinId)
        .map(e => e.linkedTo === pinId ? { ...e, linkedTo: null } : e),
    }));
  }, []);

  const linkEvidence = useCallback((id1: string, id2: string) => {
    setState(s => ({
      ...s, pinnedEvidence: s.pinnedEvidence.map(e => {
        if (e.id === id1) return { ...e, linkedTo: id2 };
        if (e.id === id2) return { ...e, linkedTo: id1 };
        return e;
      }),
      stats: { ...s.stats, contradictionsFound: s.stats.contradictionsFound + 1 },
    }));
  }, []);

  const moveEvidence = useCallback((pinId: string, pos: { x: number; y: number }) => {
    setState(s => ({
      ...s, pinnedEvidence: s.pinnedEvidence.map(e => e.id === pinId ? { ...e, position: pos } : e),
    }));
  }, []);

  const toggleEvidenceBoard = useCallback(() => {
    setState(s => ({ ...s, showEvidenceBoard: !s.showEvidenceBoard, showConsensus: false }));
  }, []);

  const toggleConsensus = useCallback(() => {
    setState(s => ({ ...s, showConsensus: !s.showConsensus, showEvidenceBoard: false }));
  }, []);

  const beginAccusation = useCallback(() => {
    setState(s => ({ ...s, phase: 'accusation' }));
  }, []);

  const makeAccusation = useCallback(async (agentId: string, reasoning: string, timeRemaining: number) => {
    if (!state.scenario) return;
    setLoading(true);
    const isCorrect = agentId === state.scenario.moleId;
    try {
      const confession = await getMoleConfession(state.scenario, reasoning, isCorrect);
      setState(s => ({
        ...s, accusedAgentId: agentId, playerReasoning: reasoning, phase: 'reveal',
        moleConfession: confession,
        stats: { ...s.stats, timeRemainingOnAccusation: timeRemaining, correct: isCorrect },
      }));
    } catch {
      setState(s => ({
        ...s, accusedAgentId: agentId, playerReasoning: reasoning, phase: 'reveal',
        moleConfession: null,
        stats: { ...s.stats, timeRemainingOnAccusation: timeRemaining, correct: isCorrect },
      }));
    } finally { setLoading(false); }
  }, [state.scenario]);

  const dismissTooltip = useCallback((id: string) => {
    setState(s => { const seen = new Set(s.tooltipsSeen); seen.add(id); return { ...s, tooltipsSeen: seen }; });
  }, []);

  const resetGame = useCallback(() => { setState(INITIAL); setError(null); }, []);

  return {
    state, loading, chatLoading, error,
    startGame, beginInvestigation, selectAgent, askQuestion, consensusCheck,
    pinEvidence, unpinEvidence, linkEvidence, moveEvidence,
    toggleEvidenceBoard, toggleConsensus, beginAccusation, makeAccusation,
    dismissTooltip, resetGame,
  };
}
