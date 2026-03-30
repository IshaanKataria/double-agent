DOUBLE AGENT

One of your agents has been turned. You have 6 minutes to find the mole.

Double Agent is a social deduction game where you interrogate 4 AI-powered spies to identify a traitor hiding among them. Every agent is played by Claude with a distinct personality, backstory, and knowledge of the mission. The mole lies convincingly, but their story contradicts what other agents witnessed. Your job: ask the right questions, cross-reference their answers, and accuse the mole before time runs out.

HOW TO PLAY

- You receive a classified mission briefing and dossiers on 4 agents
- One agent is secretly a mole. You don't know which one
- Interrogate any agent freely using natural language. Ask anything
- Choose your questioning tone: Friendly (build rapport), Direct (get facts), or Aggressive (apply pressure)
- Pin suspicious statements to your evidence board and link contradictions between agents
- Use the Consensus Check to ask all 4 agents the same question simultaneously and compare their answers side-by-side (2 uses per game)
- Watch each agent's composure meter. It shifts based on how close your questions get to the truth
- At 60 seconds remaining, interrogation locks. Make your accusation and present your evidence
- The mole is confronted with your accusation and reacts in character

WHAT MAKES IT UNIQUE

Most AI games bolt a chatbot onto existing mechanics. In Double Agent, the AI IS the game. There are no scripted dialogue trees, no predetermined paths. Every conversation is dynamically generated. The mole doesn't follow a script. It actively lies, deflects, and tries to survive your questioning while staying internally consistent.

The skill isn't pattern matching or clicking the right option. It's investigative thinking: asking the right questions to the right people, noticing when two stories don't add up, and building a case from contradictions that only emerge through cross-referencing.

Every playthrough generates a completely new mission, new agents, a new mole, and new contradictions. You can't memorize your way through it. You have to actually think.


HOW AI IS INTEGRATED

Double Agent uses Claude (claude-sonnet-4-6) across 9 distinct integration points. The AI isn't an add-on. Without it, the game cannot function.

1. Scenario Generation
   AI generates the entire mission: briefing, timeline, 4 agent profiles, the mole's identity, their cover story, and the specific contradictions planted in the timeline. Every playthrough is unique.

2. Character Roleplay (x4 simultaneous)
   AI plays all 4 agents simultaneously, each with a wildly different personality, speech pattern, and emotional temperament. Each agent only knows what they personally witnessed.

3. Mole Deception Engine
   The mole AI follows an 80/20 truth-to-lies ratio. It lies about specific verifiable details while staying internally consistent. It uses behavioral tells: hesitation markers, suspiciously specific details, and deflection when questions get close to the truth.

4. Tone-Reactive Responses
   Agents respond differently based on questioning tone (Friendly, Direct, Aggressive). Friendly questioning may get agents to open up. Aggressive questioning may crack the mole or just annoy an innocent agent.

5. Dynamic Composure System
   Each AI response includes a hidden composure value (0-100) that reflects how stressed the character feels. The mole's composure drops when questions touch their lies. Innocent agents drop composure when aggressively questioned but stay stable otherwise. This creates a visible but ambiguous signal for the player.

6. Consensus Check
   The same question is sent to all 4 agents in parallel. Each answers independently and in-character. Responses are displayed side-by-side so the player can spot contradictions directly. Limited to 2 uses per game to make them strategic.

7. Evidence Cross-Referencing
   AI maintains full conversation history per agent. When the player asks Agent B about something Agent A said, Agent B responds based on their own knowledge, naturally surfacing contradictions without being prompted to.

8. Accusation Evaluation
   When the player makes their accusation, the AI generates the mole's final reaction in character. If correctly identified, the mole cracks under pressure. If wrong, the mole shows subtle relief. The response adapts to the specific evidence the player presented.

9. Complete Replayability
   Every element is AI-generated: the mission, the agents, the mole, the timeline, and the contradictions. No two playthroughs are the same. The game is infinitely replayable because the AI creates a fresh scenario each time.


BUILT WITH

React, TypeScript, Vite, Tailwind CSS v4, Claude API (Anthropic), Web Audio API
