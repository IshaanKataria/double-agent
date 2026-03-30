import Anthropic from '@anthropic-ai/sdk';
import type { Scenario, Message, QuestionTone } from '../types/game';
import { buildScenarioSystemPrompt, buildAgentSystemPrompt, buildConfrontationPrompt, wrapWithTone } from './prompts';

let client: Anthropic | null = null;

export function initClient(apiKey: string) {
  client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function extractJSON(text: string): string {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
}

export function parseComposure(text: string): { composure: number; content: string } {
  const match = text.match(/^\[C:(\d+)\]\s*/);
  if (match) {
    return { composure: parseInt(match[1], 10), content: text.replace(match[0], '') };
  }
  return { composure: -1, content: text };
}

export async function generateScenario(): Promise<Scenario> {
  if (!client) throw new Error('API client not initialized');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: buildScenarioSystemPrompt(),
    messages: [{
      role: 'user',
      content: 'Generate a unique espionage scenario. Make each agent personality wildly different. The mole can be any of the 4 agents - vary it. Make contradictions subtle but discoverable through cross-referencing.',
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    return JSON.parse(extractJSON(text)) as Scenario;
  } catch {
    throw new Error('Failed to generate scenario. Try again.');
  }
}

export async function sendMessage(
  scenario: Scenario,
  agentId: string,
  history: Message[],
  question: string,
  tone: QuestionTone = 'direct'
): Promise<{ content: string; composure: number }> {
  if (!client) throw new Error('API client not initialized');

  const tonedQuestion = wrapWithTone(question, tone);

  const messages = history.map(msg => ({
    role: msg.role === 'player' ? 'user' as const : 'assistant' as const,
    content: msg.content,
  }));
  messages.push({ role: 'user', content: tonedQuestion });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: buildAgentSystemPrompt(scenario, agentId),
    messages,
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text : '';
  return parseComposure(raw);
}

export async function sendConsensusCheck(
  scenario: Scenario,
  conversations: Record<string, Message[]>,
  question: string,
  tone: QuestionTone = 'direct'
): Promise<Record<string, { content: string; composure: number }>> {
  const results: Record<string, { content: string; composure: number }> = {};

  const promises = scenario.agents.map(async (agent) => {
    const history = conversations[agent.id] || [];
    const result = await sendMessage(scenario, agent.id, history, question, tone);
    results[agent.id] = result;
  });

  await Promise.all(promises);
  return results;
}

export async function getMoleConfession(
  scenario: Scenario,
  reasoning: string,
  isCorrect: boolean
): Promise<string> {
  if (!client) throw new Error('API client not initialized');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: buildConfrontationPrompt(scenario, reasoning, isCorrect),
    messages: [{ role: 'user', content: isCorrect
      ? 'The evidence has been presented. Your cover is blown. What do you have to say for yourself?'
      : 'The investigation is over. The wrong person was accused. React.' }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}
