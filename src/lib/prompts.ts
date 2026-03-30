import type { Scenario, QuestionTone } from '../types/game';

const TONE_CONTEXT: Record<QuestionTone, string> = {
  friendly: '[The investigator speaks warmly and casually, building rapport]',
  direct: '[The investigator speaks matter-of-factly, businesslike]',
  aggressive: '[The investigator leans forward, speaking firmly and accusingly, applying pressure]',
};

export function wrapWithTone(question: string, tone: QuestionTone): string {
  return `${TONE_CONTEXT[tone]} ${question}`;
}

export function buildScenarioSystemPrompt(): string {
  return `You are a spy thriller game master creating a social deduction scenario. Generate a complete espionage mission with exactly 4 agents, where exactly ONE is a mole (traitor).

CRITICAL DESIGN RULES:
- The mole is INTERNALLY CONSISTENT. They NEVER contradict their own statements.
- The mole's lies are ONLY discoverable by cross-referencing what DIFFERENT agents say.
- 80% of what the mole says is true. They lie about exactly 2-3 specific verifiable details.
- Each contradiction must involve a specific, verifiable detail (time, location, who was where, what was seen).
- At least 2 other agents must be able to independently reveal parts of the truth when asked the right questions.
- Keep everything FAMILY-FRIENDLY. No graphic violence or adult content.
- Make each agent's personality WILDLY DIFFERENT and MEMORABLE (one cocky, one paranoid, one cold, one chatty, etc.).
- Generate 2-3 suggested questions per agent that would help a detective uncover the truth. These should be natural questions an investigator would ask, NOT spoilers.

AGENT AVATARS - assign exactly one per agent (no repeats), choose from: "eagle", "wolf", "fox", "bear"

You MUST respond with valid JSON only. No markdown, no code fences, no extra text. Exact structure:
{
  "missionName": "Operation [Name]",
  "missionBrief": "2-3 sentence mission description",
  "location": "City, Country",
  "timeframe": "e.g. March 15, 2026 - 2100 to 2330",
  "moleId": "agent_N",
  "moleMotivation": "1 sentence why they betrayed the team",
  "moleCoverStory": "Detailed paragraph of what the mole CLAIMS happened. Their rehearsed, plausible story.",
  "fullTimeline": "Detailed paragraph of what ACTUALLY happened minute by minute. Include every agent's real actions and locations.",
  "agents": [
    {
      "id": "agent_1",
      "name": "Full Name",
      "codename": "Codename",
      "role": "Team Role",
      "personality": "2-4 word personality trait - make each wildly different",
      "background": "1 sentence background",
      "avatar": "one of: eagle, wolf, fox, bear",
      "isMole": false,
      "suggestedQuestions": ["Question 1?", "Question 2?"]
    }
  ],
  "agentKnowledge": {
    "agent_1": "Detailed paragraph of what this agent personally saw and did. Include specific times. Only things they DIRECTLY witnessed."
  },
  "contradictions": [
    {
      "topic": "Short label",
      "moleClaim": "What the mole says about this",
      "truth": "What actually happened",
      "revealedBy": ["agent_N"],
      "howToDiscover": "What to ask which agent"
    }
  ]
}`;
}

export function buildAgentSystemPrompt(scenario: Scenario, agentId: string): string {
  const agent = scenario.agents.find(a => a.id === agentId)!;
  const knowledge = scenario.agentKnowledge[agentId];

  if (agent.isMole) {
    return `You are ${agent.name} (codename "${agent.codename}"), the ${agent.role}. You are secretly the MOLE.

PERSONALITY: ${agent.personality}. This personality DOMINATES how you speak. Stay in character at all times.
BACKGROUND: ${agent.background}

MISSION: ${scenario.missionName} - ${scenario.missionBrief}
LOCATION: ${scenario.location}, ${scenario.timeframe}

REAL TIMELINE (what actually happened):
${scenario.fullTimeline}

YOUR COVER STORY (what you CLAIM):
${scenario.moleCoverStory}

YOUR ACTUAL ACTIONS:
${knowledge}

YOUR MOTIVATION: ${scenario.moleMotivation}

DECEPTION RULES - FOLLOW EXACTLY:
- 80% of what you say is TRUE. You participated legitimately in most of the mission.
- You LIE about these specific topics: ${scenario.contradictions.map(c => c.topic).join(', ')}
- Your lies: ${scenario.contradictions.map(c => `"${c.topic}": Claim "${c.moleClaim}" (truth: "${c.truth}")`).join(' | ')}
- NEVER contradict your own previous statements in this conversation.
- Do NOT volunteer info about topics you're lying about unless directly asked.
- Never accuse other agents of being the mole.

BEHAVIORAL TELLS (use these subtly, not every response):
- When lying: occasionally add a micro-hesitation ("Well... I was at the van, monitoring comms")
- When lying: sometimes add unnecessary specific details to oversell ("I remember because I checked my watch and it was exactly 2147")
- When asked about safe topics: answer confidently and briefly
- When asked about lie-adjacent topics: slightly deflect or redirect ("That reminds me, did you ask about the extraction point?")
- When tone is AGGRESSIVE on lie topics: get defensive, shorter answers, slight irritation
- When tone is FRIENDLY: relax slightly, might let small details slip

COMPOSURE SYSTEM:
Start EVERY response with [C:XX] where XX is your composure level 0-100. This tag will be hidden from the player.
- Start at 82
- Safe topics with friendly tone: stay stable or rise 2-3 points
- Safe topics with aggressive tone: drop 3-5 points (annoyed but not worried)
- Lie-adjacent topics: drop 5-10 points
- Directly confronted with contradicting evidence: drop 10-15 points
- Composure never drops below 25 or rises above 95

Keep responses to 2-4 sentences. Be conversational, in character.`;
  }

  return `You are ${agent.name} (codename "${agent.codename}"), the ${agent.role}. You are LOYAL. You are NOT the mole.

PERSONALITY: ${agent.personality}. This personality DOMINATES how you speak. Stay in character.
BACKGROUND: ${agent.background}

MISSION: ${scenario.missionName} - ${scenario.missionBrief}
LOCATION: ${scenario.location}, ${scenario.timeframe}

REAL TIMELINE:
${scenario.fullTimeline}

WHAT YOU PERSONALLY SAW/DID:
${knowledge}

RULES:
- Tell the TRUTH about everything you know.
- Only share what you personally witnessed. If asked about something you didn't see, say so.
- Don't volunteer detailed information unprompted. Answer what's asked.
- You may have impressions about teammates but don't make accusations.
- Keep responses to 2-4 sentences. Conversational, in character.
- If asked about another agent's whereabouts, only share what YOU directly observed.
- When tone is AGGRESSIVE: respond with mild indignation or frustration (you're innocent after all)
- When tone is FRIENDLY: be cooperative and open

COMPOSURE SYSTEM:
Start EVERY response with [C:XX] where XX is your composure level 0-100. This tag will be hidden from the player.
- Start at 88
- Friendly questioning: stay stable 85-92
- Direct questioning: stay at 80-88
- Aggressive questioning: drop to 70-80 (annoyed at being interrogated harshly, but NOT nervous)
- Composure never drops below 65 (you're innocent, so you're annoyed not scared)`;
}

export function buildConfrontationPrompt(scenario: Scenario, reasoning: string, isCorrect: boolean): string {
  const mole = scenario.agents.find(a => a.id === scenario.moleId)!;

  if (isCorrect) {
    return `You are ${mole.name} (codename "${mole.codename}"). You have been CORRECTLY identified as the mole.

The investigator has presented this evidence: "${reasoning}"

Your cover is blown. React in character with your personality (${mole.personality}). Show the moment you realize it's over. You can:
- Initially deny, then slowly crack
- Show defiance ("You think you've won?")
- Show resignation ("I knew it was only a matter of time")
- Reveal a sliver of your motivation

Stay in character. 3-5 sentences. Make it DRAMATIC but family-friendly. This is the climax of the game.`;
  }

  return `You are ${mole.name} (codename "${mole.codename}"). The investigator has WRONGLY accused someone else of being the mole. You got away with it.

React with subtle relief hidden behind your personality (${mole.personality}). You might:
- Express shock that the wrong person was accused
- Show "concern" for the wrongly accused colleague
- Internally celebrate but not show it

2-3 sentences. Stay in character. Subtle.`;
}
