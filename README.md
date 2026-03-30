Double Agent

One of your agents has been turned. You have 6 minutes to find the mole.

A social deduction game where you interrogate 4 AI-powered spies to identify a traitor. Every agent is played by Claude with a distinct personality and knowledge scope. The mole lies convincingly but their story contradicts what other agents witnessed. Cross-reference statements, pin evidence, and accuse the mole before time runs out.

Built for Hackiethon 2026 (HackMelbourne).

How to Run

Prerequisites: Node.js 18+, an Anthropic API key

    git clone https://github.com/IshaanKataria/double-agent.git
    cd double-agent
    npm install
    npm run dev

Open http://localhost:5173 and enter your Anthropic API key to start.

Alternatively, create a .env file with your key to auto-fill it:

    VITE_ANTHROPIC_API_KEY=sk-ant-...

Tech Stack

- React + TypeScript
- Vite (build tool)
- Tailwind CSS v4 (styling)
- Claude API via @anthropic-ai/sdk (claude-sonnet-4-6)
- Web Audio API (ambient audio and SFX)

How AI is Used

The AI is not an add-on. Without it, the game cannot function. Claude powers 9 integration points:

1. Scenario Generation - AI creates the entire mission, timeline, agents, mole identity, and planted contradictions. Every playthrough is unique.

2. Character Roleplay - AI plays all 4 agents simultaneously with distinct personalities and speech patterns. Each agent only shares what they personally witnessed.

3. Mole Deception - The mole AI follows an 80/20 truth-to-lies ratio, uses behavioral tells (hesitation, deflection, suspiciously specific details), and stays internally consistent while contradicting other agents.

4. Tone-Reactive Responses - Agents react differently to Friendly, Direct, and Aggressive questioning tones.

5. Composure System - Each response includes a hidden composure score. The mole's composure drops when questions approach their lies, creating an ambiguous signal for the player.

6. Consensus Check - Sends the same question to all 4 agents in parallel. Responses displayed side-by-side for direct comparison. Limited to 2 uses per game.

7. Evidence Cross-Referencing - Full conversation history is maintained per agent, enabling natural contradictions to surface when asking different agents about the same events.

8. Accusation Evaluation - AI generates the mole's final reaction based on whether they were correctly identified and what evidence was presented.

9. Complete Replayability - New mission, new agents, new mole, new contradictions every game. No two playthroughs are the same.

Game Features

- 4 AI agents with wildly different personalities
- Free-form natural language interrogation
- Questioning tones: Friendly / Direct / Aggressive
- Draggable evidence board with connection lines
- Consensus check for side-by-side comparison
- Composure meters per agent
- 6-minute countdown with audio urgency escalation
- Staged cinematic reveal with mole confrontation
- Investigation stats and post-game debrief
- Noir visual aesthetic with scanlines, film grain, and vignette
