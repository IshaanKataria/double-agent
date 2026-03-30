Double Agent - Full Rebuild TODO
Deadline: March 30 2026, 11:59pm AEST

PHASE 1 - CORE LOOP (get it playable)
- [ ] Fix model ID blocker (use correct Claude model ID for API account)
- [ ] Scenario engine: generate mission timeline, assign 4 agents to events, pick mole, construct false story
- [ ] 4 unique agent profiles with wildly different personalities and speech patterns
- [ ] Mole system prompt: 80% truth / 20% lies, internally consistent, contradicts OTHER agents
- [ ] Text behavioral tells in mole prompt: hesitation ("Well... I mean..."), deflection, suspiciously specific details
- [ ] Free-form natural language interrogation (type anything, no dialogue trees)
- [ ] Store full conversation history per agent for cross-referencing
- [ ] Switch between agents freely (like switching interview rooms)
- [ ] 6 minute countdown timer
- [ ] Accusation phase: select suspect + present 2-3 pinned evidence pieces
- [ ] Basic reveal: show mole's real timeline vs their lies

PHASE 2 - KEY MECHANICS (what makes it a game, not a chatbot)
- [ ] Composure/stress meters per agent - mole's stress rises when probing near weak spots
- [ ] Questioning tones: Friendly / Direct / Aggressive button before each question
- [ ] Consensus check: ask all 4 agents the same question simultaneously, side-by-side answers (2 uses per game)
- [ ] Evidence board: pin quotes from interrogations, drag to arrange, draw connection lines
- [ ] Suggested questions per agent (2-3 clickable options + free type)
- [ ] Last 60 seconds: accusation phase only, no more questions
- [ ] Failure narrative: wrong accusation = mole taunts you, shows what you missed
- [ ] Post-game stats: questions asked, time per agent, accuracy score

PHASE 3 - VISUAL POLISH (what separates good from winning)
- [ ] Noir spy aesthetic: dark slate background, classified document styling
- [ ] Mixed accent colors: amber neutral, red danger/suspicion, green confirmed
- [ ] Scanlines, film grain, vignette overlay
- [ ] Typewriter text effect on agent responses
- [ ] Room transition animations when switching agents
- [ ] Agent dossier cards with profiles and portraits
- [ ] Loading screen: classified document typewriter while scenario generates
- [ ] Visual urgency at final minute (screen tint, color shift)
- [ ] In-game tooltips on first play ("Click an agent to interrogate them" etc.)
- [ ] Make agent avatars visually distinct

PHASE 4 - AUDIO
- [ ] Ambient tension drone / heartbeat
- [ ] Clock ticking, gets louder in final minute
- [ ] Sound on pinning evidence
- [ ] Dramatic accusation sting
- [ ] Subtle notification on receiving agent response

PHASE 5 - SHIP IT
- [ ] Playtest 3-4 full games, tune mole prompt until contradictions feel right
- [ ] Basic responsive for mobile (stack sidebar below chat)
- [ ] Error recovery if API call fails mid-conversation (retry button)
- [ ] Test timer edge case: API call in-flight when timer hits 0
- [ ] Rename project from "spell-weaver" to "double-agent"
- [ ] Push to GitHub public repo (IshaanKataria/double-agent)
- [ ] Deploy to Vercel for live demo link
- [ ] Record video demo: cinematic intro explaining concept, then gameplay highlights
- [ ] Submit on Devpost with: description, AI explanation, video, GitHub link, student ID

SUBMISSION CHECKLIST
- [ ] Game runs on localhost AND deployed URL
- [ ] API key input works (judges will use their own key)
- [ ] .env with your key is NOT committed to GitHub
- [ ] README has: what it is, how to run, how AI is integrated, tech stack
- [ ] Video demo uploaded and linked in Devpost
- [ ] Description explains all AI integration points
- [ ] Student ID and contact email in Devpost submission
- [ ] Test full game loop: start -> briefing -> interrogate -> pin -> accuse -> reveal
- [ ] New scenario generates each playthrough (different mole, different stories)
