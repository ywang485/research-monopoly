import { MODELS } from './llm';

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

// The full game log can get long by the end of a game, and most of it isn't about
// any given player - trim to just their own lines so each request stays small and
// so N players' worth of context isn't duplicated N times.
function buildPlayerContext(player: any, gameLog: string) {
  const relevantLog = gameLog
    .split('\n')
    .filter(line => line.includes(player.name))
    .join('\n') || gameLog; // fall back to the full log if nothing matched

  return `Player: ${player.name}
Total Fame: ${player.totalFame}
Final Age: ${player.finalAge}
Status: ${player.isAlive ? 'Alive' : 'Deceased'}
Theories Published: ${player.theoriesPublished.join(', ') || 'None'}
Total Years Invested: ${player.totalYearsInvested}

Key Events from Game Log:
${relevantLog}

Write a sarcastic bio for ${player.name}:`;
}

export async function generatePlayerBiosWithOpenAI(players: any[], gameLog: string) {
  return Promise.all(players.map(async (player) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODELS.openai,
        messages: [
          { role: 'system', content: PLAYER_BIO_PROMPT },
          { role: 'user', content: buildPlayerContext(player, gameLog) }
        ],
        max_tokens: 200,
        temperature: 0.9
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.trim();
  }));
}

export async function generatePlayerBiosWithAnthropic(players: any[], gameLog: string) {
  return Promise.all(players.map(async (player) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 200,
        system: PLAYER_BIO_PROMPT,
        messages: [
          { role: 'user', content: buildPlayerContext(player, gameLog) }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  }));
}

export async function generatePlayerBiosWithGoogle(players: any[], gameLog: string) {
  return Promise.all(players.map(async (player) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODELS.google}:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${PLAYER_BIO_PROMPT}\n\n${buildPlayerContext(player, gameLog)}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.9
        }
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text.trim();
  }));
}
