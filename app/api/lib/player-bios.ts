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

export async function generatePlayerBiosWithOpenAI(players: any[], gameLog: string) {
  const bios: string[] = [];

  for (const player of players) {
    const playerContext = `Player: ${player.name}
Total Fame: ${player.totalFame}
Final Age: ${player.finalAge}
Status: ${player.isAlive ? 'Alive' : 'Deceased'}
Theories Published: ${player.theoriesPublished.join(', ') || 'None'}
Total Years Invested: ${player.totalYearsInvested}

Key Events from Game Log:
${gameLog}

Write a sarcastic bio for ${player.name}:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: PLAYER_BIO_PROMPT },
          { role: 'user', content: playerContext }
        ],
        max_tokens: 200,
        temperature: 0.9
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    bios.push(data.choices[0].message.content.trim());
  }

  return bios;
}

export async function generatePlayerBiosWithAnthropic(players: any[], gameLog: string) {
  const bios: string[] = [];

  for (const player of players) {
    const playerContext = `Player: ${player.name}
Total Fame: ${player.totalFame}
Final Age: ${player.finalAge}
Status: ${player.isAlive ? 'Alive' : 'Deceased'}
Theories Published: ${player.theoriesPublished.join(', ') || 'None'}
Total Years Invested: ${player.totalYearsInvested}

Key Events from Game Log:
${gameLog}

Write a sarcastic bio for ${player.name}:`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        system: PLAYER_BIO_PROMPT,
        messages: [
          { role: 'user', content: playerContext }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    bios.push(data.content[0].text.trim());
  }

  return bios;
}

export async function generatePlayerBiosWithGoogle(players: any[], gameLog: string) {
  const bios: string[] = [];

  for (const player of players) {
    const playerContext = `Player: ${player.name}
Total Fame: ${player.totalFame}
Final Age: ${player.finalAge}
Status: ${player.isAlive ? 'Alive' : 'Deceased'}
Theories Published: ${player.theoriesPublished.join(', ') || 'None'}
Total Years Invested: ${player.totalYearsInvested}

Key Events from Game Log:
${gameLog}

Write a sarcastic bio for ${player.name}:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${PLAYER_BIO_PROMPT}\n\n${playerContext}`
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
    bios.push(data.candidates[0].content.parts[0].text.trim());
  }

  return bios;
}
