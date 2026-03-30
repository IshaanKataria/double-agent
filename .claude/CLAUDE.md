Double Agent - AI Social Deduction Game
Hackiethon 2026 | HackMelbourne | Deadline: March 30 2026 11:59pm AEST

Tech Stack: React + TypeScript + Vite + Tailwind CSS v4 + Claude API (@anthropic-ai/sdk)
PRD: /Users/katana/spell-weaver/PRD.md

Game Architecture:
- All game logic is client-side React
- LLM calls go to Claude API directly from browser (API key from .env or user input)
- No backend server
- Game state managed via React hooks (useGame, useTimer)

Key Files:
- src/types/game.ts: TypeScript types (GameState, Scenario, Agent, etc.)
- src/lib/ai.ts: Claude API integration (scenario generation, agent conversations)
- src/lib/prompts.ts: System prompts for scenario gen and agent roleplay
- src/hooks/useGame.ts: Main game state hook
- src/hooks/useTimer.ts: 8-minute countdown timer
- src/components/: All UI components

Rules:
- FAMILY-FRIENDLY content only (hackathon rule)
- Game runtime max 10 minutes per play
- Never commit API keys (.env is in .gitignore)
- Keep code understandable (winner may need to explain to judges)
- Use Tailwind v4 syntax (@theme in CSS, no config file)
- Noir/spy aesthetic: dark backgrounds, amber accents, slate text
- Font: Space Grotesk for headings, Inter for body, JetBrains Mono for monospace

Mole Prompt Strategy:
- Mole is INTERNALLY CONSISTENT (never contradicts self)
- Mole contradicts OTHER agents on specific verifiable details
- 80% truth, 20% lies
- Deflects when confronted, never admits
- Each agent has scoped personal knowledge (only shares what they witnessed)
