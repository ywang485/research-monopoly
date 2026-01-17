function getPlayerBioPrompt(language: string = 'en') {
  if (language === 'zh') {
    return `你是一位讽刺的学术传记作家，为研究人员撰写讣告。
给定玩家数据（姓名、发表的理论、名望、年龄、投入的岁月）和他们学术生涯的游戏日志，写一段简短的传记：
- 对他们的"成就"残酷诚实和讽刺
- 突出他们在游戏中的挣扎、失败和可疑选择
- 引用游戏日志中的具体事件（投资、死亡、丑闻等）
- 嘲笑他们的假说和理论
- 刻薄但以黑色幽默的方式
- 最多3-4句话
- 关注是什么让他们的职业生涯显得可悲或荒谬

语气示例：
- "在一个关于量子泡沫的假说上浪费了15年后，他们在看到它发表之前就死了。"
- "他们最大的成就是说服别人引用他们研究不足的理论。"
- "他们牺牲了三个研究生来逃避社区服务，这说明了一切。"

只生成传记段落，不要引号，不要玩家姓名标题，只要叙述。请用中文回答。`;
  }
  return `You are a sarcastic academic biographer writing obituaries for researchers.
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
}

function getPlayerContext(player: any, gameLog: string, language: string = 'en') {
  const isZh = language === 'zh';
  if (isZh) {
    return `玩家：${player.name}
总名望：${player.totalFame}
最终年龄：${player.finalAge}
状态：${player.isAlive ? '存活' : '已故'}
发表的理论：${player.theoriesPublished.join('、') || '无'}
总投入岁月：${player.totalYearsInvested}

游戏日志中的关键事件：
${gameLog}

为${player.name}写一段讽刺的传记：`;
  }
  return `Player: ${player.name}
Total Fame: ${player.totalFame}
Final Age: ${player.finalAge}
Status: ${player.isAlive ? 'Alive' : 'Deceased'}
Theories Published: ${player.theoriesPublished.join(', ') || 'None'}
Total Years Invested: ${player.totalYearsInvested}

Key Events from Game Log:
${gameLog}

Write a sarcastic bio for ${player.name}:`;
}

export async function generatePlayerBiosWithOpenAI(players: any[], gameLog: string, language: string = 'en') {
  const bios: string[] = [];

  for (const player of players) {
    const playerContext = getPlayerContext(player, gameLog, language);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: getPlayerBioPrompt(language) },
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

export async function generatePlayerBiosWithAnthropic(players: any[], gameLog: string, language: string = 'en') {
  const bios: string[] = [];

  for (const player of players) {
    const playerContext = getPlayerContext(player, gameLog, language);

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
        system: getPlayerBioPrompt(language),
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

export async function generatePlayerBiosWithGoogle(players: any[], gameLog: string, language: string = 'en') {
  const bios: string[] = [];

  for (const player of players) {
    const playerContext = getPlayerContext(player, gameLog, language);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${getPlayerBioPrompt(language)}\n\n${playerContext}`
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
