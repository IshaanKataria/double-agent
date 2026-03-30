Double Agent - Product Requirements Document
Hackiethon 2026 | HackMelbourne | Solo Team: Ishaan Kataria

OVERVIEW

Double Agent is a web-based social deduction game where players interrogate 5 AI-powered agents to identify a mole. Each agent is played by Claude with a distinct personality, role, and knowledge of the mission. The mole is internally consistent but their story contradicts what other agents witnessed. Players must cross-reference statements, pin evidence, and identify the traitor within 8 minutes.

TARGET PRIZE: Best Overall Game ($200 VISA)
Judging: Creativity, Gameplay, Visuals, AI Leverage (equal weight)

CONSTRAINTS
- Max 10 minutes per play/run (8-minute timer + briefing + reveal)
- Must be family-friendly
- Must include LLM integrated as game mechanic
- Solo team
- Submission: Devpost with video demo, GitHub link, description of AI integration
- Winners may be asked to explain code to judges


SCOPE LOCK - NO FEATURE CREEP

One difficulty, one perfect experience.

Build priority (cut from bottom if short on time):
1. Scenario engine - generates timeline, assigns agents, picks mole, constructs false story
2. Interrogation loop - talk to any of 5 agents, switch freely, full conversation history
3. Evidence board - pin quotes, link contradictions between agents
4. Clock - 8 minute countdown, visual urgency at 2 minutes
5. Accusation and reveal - select suspect, present evidence, cinematic reveal
6. Visual polish - noir aesthetic, agent dossiers, typewriter text, transitions
7. Audio - ambient music, clock ticking, pin SFX, accusation sting
8. Replayability - new scenario, new mole, new personalities each run

Items 1-5 ARE the game. 6-8 make it win.


MOLE DESIGN RULES

- Mole is consistent within their own answers
- Mole contradicts what OTHER agents say
- Player wins by cross-referencing, not catching obvious slip-ups
- 80% truth, 20% lies on specific verifiable details
- When confronted with contradicting evidence: deflect, explain away, get defensive
- Never admit to being the mole


TECH STACK

- React + TypeScript + Vite + Tailwind CSS v4
- Claude API (claude-sonnet-4-6) for all AI calls
- Client-side only, API key from .env or user input
- No backend needed


AI INTEGRATION POINTS

1. Scenario Generation: Creates mission, agents, timeline, mole identity, contradictions
2. Agent Roleplay: Plays all 5 agents with distinct personalities
3. Mole Deception: Mole actively lies while maintaining internal consistency
4. Dynamic Responses: Agents respond uniquely to any question
5. Cross-referencing: Agents maintain their own knowledge scope
6. Verdict: Reveal shows all contradictions the mole made
