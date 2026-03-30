export interface Agent {
  id: string;
  name: string;
  codename: string;
  role: string;
  personality: string;
  background: string;
  avatar: string;
  isMole: boolean;
  suggestedQuestions: string[];
}

export interface Contradiction {
  topic: string;
  moleClaim: string;
  truth: string;
  revealedBy: string[];
  howToDiscover: string;
}

export interface Scenario {
  missionName: string;
  missionBrief: string;
  location: string;
  timeframe: string;
  agents: Agent[];
  moleId: string;
  moleMotivation: string;
  moleCoverStory: string;
  contradictions: Contradiction[];
  agentKnowledge: Record<string, string>;
  fullTimeline: string;
}

export type QuestionTone = 'friendly' | 'direct' | 'aggressive';

export interface Message {
  role: 'player' | 'agent';
  content: string;
  agentId: string;
  timestamp: number;
  tone?: QuestionTone;
}

export interface ConsensusResult {
  question: string;
  responses: Record<string, string>;
}

export interface PinnedEvidence {
  id: string;
  agentId: string;
  agentName: string;
  quote: string;
  linkedTo: string | null;
  position: { x: number; y: number };
}

export interface GameStats {
  questionsAsked: number;
  questionsPerAgent: Record<string, number>;
  timeSpentPerAgent: Record<string, number>;
  pinsCreated: number;
  contradictionsFound: number;
  timeRemainingOnAccusation: number;
  correct: boolean;
}

export type GamePhase = 'menu' | 'loading' | 'briefing' | 'investigation' | 'accusation' | 'reveal';

export interface GameState {
  phase: GamePhase;
  scenario: Scenario | null;
  conversations: Record<string, Message[]>;
  activeAgentId: string | null;
  pinnedEvidence: PinnedEvidence[];
  accusedAgentId: string | null;
  playerReasoning: string;
  showEvidenceBoard: boolean;
  moleConfession: string | null;
  stats: GameStats;
  agentSelectTime: number;
  tooltipsSeen: Set<string>;
  composure: Record<string, number>;
  consensusUsesLeft: number;
  consensusResults: ConsensusResult[];
  showConsensus: boolean;
}
