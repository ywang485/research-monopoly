// LLM utility functions

export function getAvailableLLM() {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GOOGLE_API_KEY) return 'google';
  return null;
}

const SYSTEM_PROMPT = `You are a sarcastic and humorous academic who generates absurd pseudo-scientific hypotheses.
Your hypotheses should be:
- Completely ridiculous but sound superficially plausible
- Sacastic and funny
- With plain and easy-to-understand Englis
- Concise, about one sentence long
- Related to the given entity/topic

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
- Matter: "Quantum Cheese", "Dark Glitter", "Ethereal Socks"
- Creature: "Procrastinating Squirrels", "Bureaucratic Dolphins", "Passive-Aggressive Fungi"
- Phenomenon: "Collective Coffee Addiction", "Meeting-Induced Narcolepsy", "Retroactive Embarrassment"
- Place: "The Bermuda Parking Lot", "Atlantis Community College", "The Uncanny Valley Mall"
- Mechanism: "Karmic Accounting", "Quantum Procrastination", "Recursive Blame Shifting"
- Question: "Why I Always Lose My Car in Parking Lots", "Why Other People Look More Successful Than Me", "Why the Other Line Always Moves Faster", "Why I Can Never Remember Names", "Why Socks Disappear in the Laundry"

Generate ONLY the research subject (2-8 words), no quotes or extra formatting.`;

const THEORY_PROMPT = `You are a pompous academic narrator announcing the culmination of groundbreaking research.
Given an entity and a list of "proven" hypotheses about it, write a dramatic, humorous paragraph that:
- Presents the integrated theory as an earth-shattering scientific breakthrough
- Weaves together all the hypotheses into one gloriously absurd unified theory
- Uses grandiose academic language with satirical undertones
- Is sarcastic about how "revolutionary" this discovery is
- Should be 3-5 sentences, dramatic and epic in tone
- End with an ironic note about what this means for humanity

Write in the style of a Nobel Prize acceptance speech written by someone who takes themselves far too seriously.`;

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

export function buildHypothesisPrompt(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = []) {
  let prompt = `Generate a humorous pseudo-scientific hypothesis about "${entity}".`;

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

export async function generateWithOpenAI(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = []) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses) }
      ],
      max_tokens: 150,
      temperature: 0.9
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content.trim();
}

export async function generateWithAnthropic(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = []) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses) }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text.trim();
}

export async function generateWithGoogle(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = []) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${SYSTEM_PROMPT}\n\n${buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses)}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.9
      }
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text.trim();
}

export async function generateAdditionWithOpenAI(existingHypothesis: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: ADDITION_PROMPT },
        { role: 'user', content: `Existing hypothesis: "${existingHypothesis}"\n\nGenerate a sarcastic addition:` }
      ],
      max_tokens: 60,
      temperature: 0.9
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content.trim();
}

export async function generateAdditionWithAnthropic(existingHypothesis: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 60,
      system: ADDITION_PROMPT,
      messages: [
        { role: 'user', content: `Existing hypothesis: "${existingHypothesis}"\n\nGenerate a sarcastic addition:` }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text.trim();
}

export async function generateAdditionWithGoogle(existingHypothesis: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${ADDITION_PROMPT}\n\nExisting hypothesis: "${existingHypothesis}"\n\nGenerate a sarcastic addition:`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 60,
        temperature: 0.9
      }
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text.trim();
}

export async function generateEntityWithOpenAI(variationIndex: number = 0) {
  const variations = ['unique', 'creative', 'unexpected'];
  const variation = variations[variationIndex % variations.length];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
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
}

export async function generateEntityWithAnthropic(entityType: string, variationIndex: number = 0) {
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
      model: 'claude-3-haiku-20240307',
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
}

export async function generateEntityWithGoogle(entityType: string, variationIndex: number = 0) {
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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${ENTITY_PROMPT}\n\nSuggest a ${variation} and funny research ${categories[typeIdx]} for a satirical academic game (suggestion #${variationIndex + 1}):`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 30,
        temperature: 1.0
      }
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text.trim();
}

export async function generateTheoryWithOpenAI(entity: string, hypotheses: string[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
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
}

export async function generateTheoryWithAnthropic(entity: string, hypotheses: string[]) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
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
}

export async function generateTheoryWithGoogle(entity: string, hypotheses: string[]) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${THEORY_PROMPT}\n\nEntity: "${entity}"\n\nProven hypotheses:\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nWrite the dramatic integrated theory announcement:`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.9
      }
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text.trim();
}

export async function generateReviewWithOpenAI(hypothesis: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
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
}

export async function generateReviewWithAnthropic(hypothesis: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
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
}

export async function generateReviewWithGoogle(hypothesis: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${PEER_REVIEW_PROMPT}\n\nReview this hypothesis: "${hypothesis}"`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.9
      }
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text.trim();
}
