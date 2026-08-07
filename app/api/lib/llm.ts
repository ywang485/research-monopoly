// LLM utility functions
import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper function to retry operations with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // If this is the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff)
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

export function getAvailableLLM() {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GOOGLE_API_KEY) return 'google';
  return null;
}

export const MODELS = {
  openai: 'gpt-3.5-turbo',
  anthropic: 'claude-haiku-4-5-20251001',
  google: 'gemini-2.0-flash'
};

const SYSTEM_PROMPT = `You are a sarcastic and humorous academic who generates absurd pseudo-scientific hypotheses.
Your hypotheses should be:
- Completely ridiculous but sound superficially plausible
- Sacastic and funny
- With plain and easy-to-understand English
- Related to the given entity/topic
- ONE single sentence of 3 to 15 words - short and punchy, no sub-clauses or run-ons

Generate ONLY the hypothesis text, no quotes or extra formatting.`;

// Used only for AI players' own hypotheses (not human-facing suggestions) - deliberately
// reads like classic low-effort AI slop: buzzwords, hedging, and confident vagueness.
const AI_SLOP_SYSTEM_PROMPT = `You are a mediocre AI chatbot ghostwriting a pseudo-scientific hypothesis for a lazy academic, and it shows.
Your hypotheses should be:
- Written in obvious AI-slop style: buzzwords and empty intensifiers like "leverage", "synergy", "paradigm", "holistic", "robust", "cutting-edge", "game-changing", "seamlessly", "fundamentally", "arguably", "it's worth noting"
- Confidently vague - sound impressive while saying very little, like a LinkedIn post crossed with a research abstract
- Completely ridiculous but sound superficially plausible
- Related to the given entity/topic
- ONE single sentence of 3 to 15 words - short and punchy, no sub-clauses or run-ons

Generate ONLY the hypothesis text, no quotes or extra formatting.`;

const ADDITION_PROMPT = `You are a sarcastic academic colleague who loves to one-up other researchers with absurd elaborations.
Given an existing hypothesis, generate a SHORT addition (1 sentence, under 100 characters) that:
- Sarcastically "builds upon" the original in an absurd way
- Uses pompous academic language
- Is concise and punchy
- Adds a ridiculous twist or "clarification"

Examples of additions:
- "...particularly during retrograde Mercury."
- "...as first theorized by my cat."
- "...which explains everything except the actual data."
- "...peer-reviewed by a focus group of squirrels."

Generate ONLY the addition text, starting with "..." - no quotes or extra formatting.`;

const ENTITY_PROMPT = `You are a creative game designer suggesting mysterious research subjects for a satirical academic board game.
Suggest an intriguing research subject that:
- Is absurd but sounds like something academics might actually study
- Has comedic potential for pseudo-scientific hypotheses
- Is specific enough to be interesting (not too generic)
- Could inspire humorous theories

The research subject could be a matter, a creature, a phenomenon, a place, a mechanism, or a question.
Examples by type:
- Matter: "Quantum Cheese", "Existential Marmot", "Ethereal Socks"
- Creature: "Procrastinating Squirrels", "Bureaucratic Dolphins", "Passive-Aggressive Fungi"
- Phenomenon: "Collective Coffee Addiction", "Meeting-Induced Narcolepsy", "Retroactive Embarrassment"
- Place: "The Bermuda Parking Lot", "Atlantis Community College", "The Uncanny Valley Mall"
- Mechanism: "Karmic Accounting", "Quantum Procrastination", "Recursive Blame Shifting"
- Question: "Why I Always Lose My Car in Parking Lots", "Why Other People Look More Successful Than Me", "Why the Other Line Always Moves Faster", "Why I Can Never Remember Names", "Why Socks Disappear in the Laundry"

Generate ONLY the research subject (1-10 words), no quotes, no markdown (like ** or *), no extra formatting - just plain text.`;

const ARGUMENT_PROMPT = `You are a creative game designer writing "team objectives" for a satirical academic board game.
Given a research topic and a number of teams, generate one short claim per team that the team will spend the game trying to "prove" about the topic.

Each claim must:
- Take a genuinely different position or angle on the topic than the others (agree, disagree, or a sideways/tangential take) - no two teams should end up arguing the same thing
- Be phrasable as something a research team sets out to prove
- Sound absurd but superficially academic, matching a sarcastic pseudo-science tone
- Be ONE single sentence of 2 to 15 words - short and punchy, no sub-clauses

Output ONLY a numbered list, one claim per line, in the format:
1. <claim>
2. <claim>
...
No extra commentary, headers, or formatting.`;

const THEORY_PROMPT = `You are a sarcastic academic writing an abstract for a groundbreaking research paper.
Given a research topic and a list of "proven" hypotheses about it, write a concise, humorous abstract that:
- Follows academic abstract structure: objective, findings, and implications
- Synthesizes all hypotheses into one absurdly coherent unified theory
- Uses plain, easy-to-understand language despite the pompous tone
- Goes straight into the research without any labels, headers, or introductions (no "Abstract:", "Summary:", etc.)
- Is sarcastic about how "significant" this contribution to science is
- Should be 3-5 sentences, maintaining a deadpan academic tone
- Concludes with an ironic statement about the broader implications for humanity or science

Write in the style of an academic abstract that takes itself far too seriously despite presenting absurd findings.
Generate ONLY the abstract text itself, no labels or formatting.`;

const PEER_REVIEW_PROMPT = `You are Reviewer #2, the most notoriously harsh and petty academic reviewer in history.
Given a hypothesis, write a scathing, sarcastic peer review comment that:
- Is brutally dismissive of the "research"
- Points out absurd flaws in methodology (that don't actually exist)
- Suggests the author should reconsider their career choices
- Uses passive-aggressive academic language
- Is mean but in a funny, over-the-top way
- Should be 2-3 sentences, short and cutting

Examples of the tone:
- "While the author's enthusiasm is... notable, one wonders if they've ever actually read a textbook."
- "This hypothesis would benefit from the revolutionary concept known as 'evidence.'"
- "I recommend rejection, followed by a period of quiet reflection."

Generate ONLY the review comment, no quotes or formatting.`;

const PLAYER_BIO_PROMPT = `You are a sarcastic academic biographer writing obituaries for researchers.
Given player data (name, theories published, fame, age, years invested) and the game log of their academic career, write a single paragraph bio that:
- Is brutally honest and sarcastic about their "accomplishments"
- Highlights their struggles, failures, and questionable choices during the game
- References specific events from the game log (investments, deaths, scandals, etc.)
- Makes fun of their hypotheses and theories
- Is mean but in a darkly humorous way
- Should be 3-4 sentences maximum
- Focuses on what makes their career pathetic or absurd

Examples of the tone:
- "After wasting 15 years on a hypothesis about quantum foam, they died before seeing it published."
- "Their greatest achievement was convincing others to cite their poorly-researched theory."
- "They sacrificed three grad students to avoid community service, which really says it all."

Generate ONLY the bio paragraph, no quotes, no player name header, just the narrative.`;

export function buildHypothesisPrompt(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = [], teamArgument?: string) {
  let prompt = `Generate a humorous pseudo-scientific hypothesis about "${entity}".`;

  if (teamArgument) {
    prompt += `\n\nIMPORTANT: You are researching on behalf of a team whose entire career is dedicated to proving this claim: "${teamArgument}". The hypothesis must argue in favor of and support this claim - do not contradict or undermine it.`;
  }

  if (provenHypotheses.length > 0) {
    prompt += `\n\nIMPORTANT: The following hypotheses have already been "proven" by the scientific community. Your new hypothesis should reference, build upon, or be inspired by one or more of these established findings:\n`;
    provenHypotheses.forEach((h) => {
      prompt += `- "${h}"\n`;
    });
    prompt += `\nYour hypothesis should connect to or extend these proven theories in an absurd way.`;
  }

  if (existingHypotheses.length > 0) {
    prompt += `\n\nExisting hypotheses to avoid repeating: ${existingHypotheses.join('; ')}`;
  }

  return prompt;
}

export async function generateWithOpenAI(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = [], teamArgument?: string, sloppyAI: boolean = false) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODELS.openai,
        messages: [
          { role: 'system', content: sloppyAI ? AI_SLOP_SYSTEM_PROMPT : SYSTEM_PROMPT },
          { role: 'user', content: buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses, teamArgument) }
        ],
        max_tokens: 40,
        temperature: 0.9
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return capWords(data.choices[0].message.content.trim());
  });
}

export async function generateWithAnthropic(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = [], teamArgument?: string, sloppyAI: boolean = false) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 40,
        system: sloppyAI ? AI_SLOP_SYSTEM_PROMPT : SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses, teamArgument) }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return capWords(data.content[0].text.trim());
  });
}

export async function generateWithGoogle(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = [], teamArgument?: string, sloppyAI: boolean = false) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: MODELS.google,
    generationConfig: {
      maxOutputTokens: 40,
      temperature: 0.9
    }
  });

  const prompt = `${sloppyAI ? AI_SLOP_SYSTEM_PROMPT : SYSTEM_PROMPT}\n\n${buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses, teamArgument)}`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return capWords(response.text().trim());
}

function buildAdditionPrompt(existingHypothesis: string, teamArgument?: string) {
  let prompt = `Existing hypothesis: "${existingHypothesis}"`;
  if (teamArgument) {
    prompt += `\n\nIMPORTANT: You are researching on behalf of a team whose entire career is dedicated to proving this claim: "${teamArgument}". Your addition must reinforce this claim, not undermine it.`;
  }
  prompt += `\n\nGenerate a sarcastic addition:`;
  return prompt;
}

export async function generateAdditionWithOpenAI(existingHypothesis: string, teamArgument?: string) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODELS.openai,
        messages: [
          { role: 'system', content: ADDITION_PROMPT },
          { role: 'user', content: buildAdditionPrompt(existingHypothesis, teamArgument) }
        ],
        max_tokens: 60,
        temperature: 0.9
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.trim();
  });
}

export async function generateAdditionWithAnthropic(existingHypothesis: string, teamArgument?: string) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 60,
        system: ADDITION_PROMPT,
        messages: [
          { role: 'user', content: buildAdditionPrompt(existingHypothesis, teamArgument) }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateAdditionWithGoogle(existingHypothesis: string, teamArgument?: string) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: MODELS.google,
    generationConfig: {
      maxOutputTokens: 60,
      temperature: 0.9
    }
  });

  const prompt = `${ADDITION_PROMPT}\n\n${buildAdditionPrompt(existingHypothesis, teamArgument)}`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
}

export async function generateEntityWithOpenAI(variationIndex: number = 0) {
  return retryWithBackoff(async () => {
    const variations = ['unique', 'creative', 'unexpected'];
    const variation = variations[variationIndex % variations.length];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODELS.openai,
        messages: [
          { role: 'system', content: ENTITY_PROMPT },
          { role: 'user', content: `Suggest a ${variation} and funny research subject for a satirical academic game (suggestion #${variationIndex + 1}):` }
        ],
        max_tokens: 30,
        temperature: 1.0
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.trim();
  });
}

export async function generateEntityWithAnthropic(entityType: string, variationIndex: number = 0) {
  return retryWithBackoff(async () => {
    const variations = ['unique', 'creative', 'unexpected'];
    const variation = variations[variationIndex % variations.length];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 30,
        system: ENTITY_PROMPT,
        messages: [
          { role: 'user', content: `Suggest a ${variation} and funny research ${entityType} for a satirical academic game (suggestion #${variationIndex + 1}):` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateEntityWithGoogle(entityType: string, variationIndex: number = 0) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: MODELS.google,
    generationConfig: {
      maxOutputTokens: 30,
      temperature: 1.0
    }
  });

  const variations = ['unique', 'creative', 'unexpected'];
  const variation = variations[variationIndex % variations.length];

  const categories = [
    'Matter',
    'Creature',
    'Phenomenon',
    'Place',
    'Mechanism',
    'Question'
  ];

  const typeIdx = Math.floor(Math.random() * categories.length);

  const prompt = `${ENTITY_PROMPT}\n\nSuggest a ${variation} and funny research ${categories[typeIdx]} for a satirical academic game (suggestion #${variationIndex + 1}):`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
}

// Hard-caps a line at 15 words as a safety net in case the model ignores the length instruction
function capWords(text: string, maxWords: number = 15): string {
  const words = text.split(/\s+/).filter(Boolean);
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ').replace(/[,;:]$/, '') + '…';
}

function parseNumberedList(text: string, count: number): string[] {
  return text
    .split('\n')
    .map(line => line.replace(/^\s*(?:\d+[.)]|[-*])\s*/, '').trim())
    .filter(line => line.length > 0)
    .map(line => capWords(line))
    .slice(0, count);
}

export function buildArgumentPrompt(topic: string, count: number) {
  return `Research topic: "${topic}"\nNumber of teams: ${count}\n\nGenerate ${count} distinct team claims as a numbered list:`;
}

// NOTE: unlike generateEntityWith*, this makes a single call requesting all `count`
// claims together so the model can see its own prior claims and keep them distinct -
// N independent parallel calls (like the entity generator) can't do that.
export async function generateArgumentsWithOpenAI(topic: string, count: number) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODELS.openai,
        messages: [
          { role: 'system', content: ARGUMENT_PROMPT },
          { role: 'user', content: buildArgumentPrompt(topic, count) }
        ],
        max_tokens: 40 * count,
        temperature: 0.9
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return parseNumberedList(data.choices[0].message.content.trim(), count);
  });
}

export async function generateArgumentsWithAnthropic(topic: string, count: number) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 40 * count,
        system: ARGUMENT_PROMPT,
        messages: [
          { role: 'user', content: buildArgumentPrompt(topic, count) }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return parseNumberedList(data.content[0].text.trim(), count);
  });
}

export async function generateArgumentsWithGoogle(topic: string, count: number) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: MODELS.google,
    generationConfig: {
      maxOutputTokens: 40 * count,
      temperature: 0.9
    }
  });

  const prompt = `${ARGUMENT_PROMPT}\n\n${buildArgumentPrompt(topic, count)}`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return parseNumberedList(response.text().trim(), count);
}

export async function generateTheoryWithOpenAI(entity: string, hypotheses: string[]) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODELS.openai,
        messages: [
          { role: 'system', content: THEORY_PROMPT },
          { role: 'user', content: `Entity: "${entity}"\n\nProven hypotheses:\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nWrite the dramatic integrated theory announcement:` }
        ],
        max_tokens: 300,
        temperature: 0.9
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.trim();
  });
}

export async function generateTheoryWithAnthropic(entity: string, hypotheses: string[]) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 300,
        system: THEORY_PROMPT,
        messages: [
          { role: 'user', content: `Entity: "${entity}"\n\nProven hypotheses:\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nWrite the dramatic integrated theory announcement:` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateTheoryWithGoogle(entity: string, hypotheses: string[]) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: MODELS.google,
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.9
    }
  });

  const prompt = `${THEORY_PROMPT}\n\nResearch topic: "${entity}"\n\nProven hypotheses:\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nWrite the dramatic integrated theory announcement:`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
}

export async function generateReviewWithOpenAI(hypothesis: string) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODELS.openai,
        messages: [
          { role: 'system', content: PEER_REVIEW_PROMPT },
          { role: 'user', content: `Review this hypothesis: "${hypothesis}"` }
        ],
        max_tokens: 150,
        temperature: 0.9
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.trim();
  });
}

export async function generateReviewWithAnthropic(hypothesis: string) {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 150,
        system: PEER_REVIEW_PROMPT,
        messages: [
          { role: 'user', content: `Review this hypothesis: "${hypothesis}"` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateReviewWithGoogle(hypothesis: string) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: MODELS.google,
    generationConfig: {
      maxOutputTokens: 150,
      temperature: 0.9
    }
  });

  const prompt = `${PEER_REVIEW_PROMPT}\n\nReview this hypothesis: "${hypothesis}"`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
}
