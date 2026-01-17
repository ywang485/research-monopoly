// LLM utility functions

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

// Language-aware prompt helpers
function getSystemPrompt(language: string = 'en') {
  if (language === 'zh') {
    return `你是一位喜欢讽刺和幽默的学者，专门生成荒谬的伪科学假说。
你的假说应该：
- 完全荒谬但表面上听起来貌似合理
- 讽刺且有趣
- 用简单易懂的中文
- 简洁，大约一句话
- 与给定的实体/主题相关

只生成假说文本，不要引号或额外的格式。请用中文回答。`;
  }
  return `You are a sarcastic and humorous academic who generates absurd pseudo-scientific hypotheses.
Your hypotheses should be:
- Completely ridiculous but sound superficially plausible
- Sarcastic and funny
- With plain and easy-to-understand English
- Concise, about one sentence long
- Related to the given entity/topic

Generate ONLY the hypothesis text, no quotes or extra formatting.`;
}

function getAdditionPrompt(language: string = 'en') {
  if (language === 'zh') {
    return `你是一位喜欢用荒谬的补充来压过其他研究者的讽刺学者。
给定一个现有假说，生成一个简短的补充（1句话，50个字以内）：
- 以荒谬的方式讽刺地"补充"原文
- 使用浮夸的学术语言
- 简洁有力
- 添加一个荒谬的转折或"澄清"

补充示例：
- "……尤其是在水星逆行期间。"
- "……正如我的猫最先提出的理论。"
- "……这解释了一切，除了实际数据。"
- "……经松鼠焦点小组同行评审。"

只生成补充文本，以"……"开头，不要引号或额外格式。请用中文回答。`;
  }
  return `You are a sarcastic academic colleague who loves to one-up other researchers with absurd elaborations.
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
}

function getEntityPrompt(language: string = 'en') {
  if (language === 'zh') {
    return `你是一位创意游戏设计师，为一款讽刺学术界的桌游建议神秘的研究主题。
建议一个有趣的研究主题：
- 荒谬但听起来像是学者真的会研究的东西
- 有伪科学假说的喜剧潜力
- 足够具体，不要太泛泛
- 能激发幽默的理论

研究主题可以是物质、生物、现象、地点、机制或问题。
按类型举例：
- 物质："量子奶酪"、"暗物质闪粉"、"以太袜子"
- 生物："拖延症松鼠"、"官僚主义海豚"、"被动攻击型真菌"
- 现象："集体咖啡成瘾"、"会议诱发性嗜睡"、"追溯性尴尬"
- 地点："百慕大停车场"、"亚特兰蒂斯社区大学"、"恐怖谷购物中心"
- 机制："因果报应会计学"、"量子拖延症"、"递归甩锅"
- 问题："为什么我总是在停车场找不到车"、"为什么别人看起来比我成功"、"为什么另一条队总是更快"

只生成研究主题（2-10个字），不要引号或额外格式。请用中文回答。`;
  }
  return `You are a creative game designer suggesting mysterious research subjects for a satirical academic board game.
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
}

function getTheoryPrompt(language: string = 'en') {
  if (language === 'zh') {
    return `你是一位讽刺的学者，正在为一篇开创性研究论文撰写摘要。
给定一个研究主题和一系列关于它的"已证明"假说，写一个简洁、幽默的摘要：
- 遵循学术摘要结构：目标、发现和意义
- 将所有假说综合成一个荒谬但连贯的统一理论
- 尽管语气浮夸，但使用简单易懂的语言
- 直接进入研究内容，没有任何标签、标题或介绍（不要"摘要："、"总结："等）
- 对这一"重大"科学贡献持讽刺态度
- 应为3-5句话，保持一本正经的学术语气
- 以对人类或科学更广泛影响的讽刺性陈述结尾

以一种过于认真对待自己、尽管呈现荒谬发现的学术摘要风格写作。
只生成摘要文本本身，不要标签或格式。请用中文回答。`;
  }
  return `You are a sarcastic academic writing an abstract for a groundbreaking research paper.
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
}

function getPeerReviewPrompt(language: string = 'en') {
  if (language === 'zh') {
    return `你是审稿人2号，历史上最出名的苛刻和小心眼的学术审稿人。
给定一个假说，写一段尖刻、讽刺的同行评审意见：
- 对"研究"极度不屑
- 指出荒谬的方法论缺陷（实际上并不存在）
- 建议作者重新考虑他们的职业选择
- 使用被动攻击性的学术语言
- 刻薄但以一种搞笑、夸张的方式
- 应为2-3句话，简短而尖锐

语气示例：
- "虽然作者的热情……值得注意，但不禁让人怀疑他们是否真的读过教科书。"
- "这个假说将受益于一个被称为'证据'的革命性概念。"
- "我建议拒稿，随后进行一段时间的静默反思。"

只生成评审意见，不要引号或格式。请用中文回答。`;
  }
  return `You are Reviewer #2, the most notoriously harsh and petty academic reviewer in history.
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
}

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

export function buildHypothesisPrompt(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = [], language: string = 'en') {
  const isZh = language === 'zh';
  let prompt = isZh
    ? `为"${entity}"生成一个幽默的伪科学假说。`
    : `Generate a humorous pseudo-scientific hypothesis about "${entity}".`;

  if (provenHypotheses.length > 0) {
    prompt += isZh
      ? `\n\n重要：以下假说已被科学界"证明"。你的新假说应该引用、建立在或受到这些已确立发现的启发：\n`
      : `\n\nIMPORTANT: The following hypotheses have already been "proven" by the scientific community. Your new hypothesis should reference, build upon, or be inspired by one or more of these established findings:\n`;
    provenHypotheses.forEach((h) => {
      prompt += `- "${h}"\n`;
    });
    prompt += isZh
      ? `\n你的假说应该以荒谬的方式与这些已证明的理论联系或扩展。`
      : `\nYour hypothesis should connect to or extend these proven theories in an absurd way.`;
  }

  if (existingHypotheses.length > 0) {
    prompt += isZh
      ? `\n\n避免重复的现有假说：${existingHypotheses.join('；')}`
      : `\n\nExisting hypotheses to avoid repeating: ${existingHypotheses.join('; ')}`;
  }

  return prompt;
}

export async function generateWithOpenAI(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = [], language: string = 'en') {
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: getSystemPrompt(language) },
          { role: 'user', content: buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses, language) }
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

export async function generateWithAnthropic(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = [], language: string = 'en') {
  return retryWithBackoff(async () => {
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
        system: getSystemPrompt(language),
        messages: [
          { role: 'user', content: buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses, language) }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateWithGoogle(entity: string, existingHypotheses: string[] = [], provenHypotheses: string[] = [], language: string = 'en') {
  return retryWithBackoff(async () => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${getSystemPrompt(language)}\n\n${buildHypothesisPrompt(entity, existingHypotheses, provenHypotheses, language)}`
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
  });
}

export async function generateAdditionWithOpenAI(existingHypothesis: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: getAdditionPrompt(language) },
          { role: 'user', content: isZh
            ? `现有假说："${existingHypothesis}"\n\n生成一个讽刺的补充：`
            : `Existing hypothesis: "${existingHypothesis}"\n\nGenerate a sarcastic addition:` }
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

export async function generateAdditionWithAnthropic(existingHypothesis: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
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
        system: getAdditionPrompt(language),
        messages: [
          { role: 'user', content: isZh
            ? `现有假说："${existingHypothesis}"\n\n生成一个讽刺的补充：`
            : `Existing hypothesis: "${existingHypothesis}"\n\nGenerate a sarcastic addition:` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateAdditionWithGoogle(existingHypothesis: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${getAdditionPrompt(language)}\n\n${isZh
              ? `现有假说："${existingHypothesis}"\n\n生成一个讽刺的补充：`
              : `Existing hypothesis: "${existingHypothesis}"\n\nGenerate a sarcastic addition:`}`
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
  });
}

export async function generateEntityWithOpenAI(variationIndex: number = 0, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const variations = isZh ? ['独特', '有创意', '出人意料'] : ['unique', 'creative', 'unexpected'];
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
          { role: 'system', content: getEntityPrompt(language) },
          { role: 'user', content: isZh
            ? `为讽刺学术游戏建议一个${variation}且有趣的研究主题（建议 #${variationIndex + 1}）：`
            : `Suggest a ${variation} and funny research subject for a satirical academic game (suggestion #${variationIndex + 1}):` }
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

export async function generateEntityWithAnthropic(entityType: string, variationIndex: number = 0, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const variations = isZh ? ['独特', '有创意', '出人意料'] : ['unique', 'creative', 'unexpected'];
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
        system: getEntityPrompt(language),
        messages: [
          { role: 'user', content: isZh
            ? `为讽刺学术游戏建议一个${variation}且有趣的研究${entityType}（建议 #${variationIndex + 1}）：`
            : `Suggest a ${variation} and funny research ${entityType} for a satirical academic game (suggestion #${variationIndex + 1}):` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateEntityWithGoogle(entityType: string, variationIndex: number = 0, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const variations = isZh ? ['独特', '有创意', '出人意料'] : ['unique', 'creative', 'unexpected'];
    const variation = variations[variationIndex % variations.length];

    const categories = isZh
      ? ['物质', '生物', '现象', '地点', '机制', '问题']
      : ['Matter', 'Creature', 'Phenomenon', 'Place', 'Mechanism', 'Question'];

    const typeIdx = Math.floor(Math.random() * categories.length);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${getEntityPrompt(language)}\n\n${isZh
              ? `为讽刺学术游戏建议一个${variation}且有趣的研究${categories[typeIdx]}（建议 #${variationIndex + 1}）：`
              : `Suggest a ${variation} and funny research ${categories[typeIdx]} for a satirical academic game (suggestion #${variationIndex + 1}):`}`
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
  });
}

export async function generateTheoryWithOpenAI(entity: string, hypotheses: string[], language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: getTheoryPrompt(language) },
          { role: 'user', content: isZh
            ? `研究主题："${entity}"\n\n已证明的假说：\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n撰写戏剧性的统一理论公告：`
            : `Entity: "${entity}"\n\nProven hypotheses:\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nWrite the dramatic integrated theory announcement:` }
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

export async function generateTheoryWithAnthropic(entity: string, hypotheses: string[], language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
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
        system: getTheoryPrompt(language),
        messages: [
          { role: 'user', content: isZh
            ? `研究主题："${entity}"\n\n已证明的假说：\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n撰写戏剧性的统一理论公告：`
            : `Entity: "${entity}"\n\nProven hypotheses:\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nWrite the dramatic integrated theory announcement:` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateTheoryWithGoogle(entity: string, hypotheses: string[], language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${getTheoryPrompt(language)}\n\n${isZh
              ? `研究主题："${entity}"\n\n已证明的假说：\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n撰写戏剧性的统一理论公告：`
              : `Research topic: "${entity}"\n\nProven hypotheses:\n${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nWrite the dramatic integrated theory announcement:`}`
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
  });
}

export async function generateReviewWithOpenAI(hypothesis: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: getPeerReviewPrompt(language) },
          { role: 'user', content: isZh
            ? `评审这个假说："${hypothesis}"`
            : `Review this hypothesis: "${hypothesis}"` }
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

export async function generateReviewWithAnthropic(hypothesis: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
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
        system: getPeerReviewPrompt(language),
        messages: [
          { role: 'user', content: isZh
            ? `评审这个假说："${hypothesis}"`
            : `Review this hypothesis: "${hypothesis}"` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateReviewWithGoogle(hypothesis: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${getPeerReviewPrompt(language)}\n\n${isZh
              ? `评审这个假说："${hypothesis}"`
              : `Review this hypothesis: "${hypothesis}"`}`
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
  });
}

// Player bio generation functions
export async function generateBioWithOpenAI(playerData: any, gameLog: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
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
          { role: 'user', content: isZh
            ? `玩家：${playerData.name}\n发表理论：${playerData.theoriesPublished}\n名望：${playerData.totalFame}\n最终年龄：${playerData.finalAge}\n存活：${playerData.isAlive ? '是' : '否'}\n投入年数：${playerData.totalYearsInvested}\n\n游戏日志：\n${gameLog}\n\n为这位研究人员写一段传记：`
            : `Player: ${playerData.name}\nTheories Published: ${playerData.theoriesPublished}\nFame: ${playerData.totalFame}\nFinal Age: ${playerData.finalAge}\nAlive: ${playerData.isAlive}\nYears Invested: ${playerData.totalYearsInvested}\n\nGame Log:\n${gameLog}\n\nWrite a bio for this researcher:` }
        ],
        max_tokens: 200,
        temperature: 0.9
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.trim();
  });
}

export async function generateBioWithAnthropic(playerData: any, gameLog: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
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
          { role: 'user', content: isZh
            ? `玩家：${playerData.name}\n发表理论：${playerData.theoriesPublished}\n名望：${playerData.totalFame}\n最终年龄：${playerData.finalAge}\n存活：${playerData.isAlive ? '是' : '否'}\n投入年数：${playerData.totalYearsInvested}\n\n游戏日志：\n${gameLog}\n\n为这位研究人员写一段传记：`
            : `Player: ${playerData.name}\nTheories Published: ${playerData.theoriesPublished}\nFame: ${playerData.totalFame}\nFinal Age: ${playerData.finalAge}\nAlive: ${playerData.isAlive}\nYears Invested: ${playerData.totalYearsInvested}\n\nGame Log:\n${gameLog}\n\nWrite a bio for this researcher:` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text.trim();
  });
}

export async function generateBioWithGoogle(playerData: any, gameLog: string, language: string = 'en') {
  const isZh = language === 'zh';
  return retryWithBackoff(async () => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${getPlayerBioPrompt(language)}\n\n${isZh
              ? `玩家：${playerData.name}\n发表理论：${playerData.theoriesPublished}\n名望：${playerData.totalFame}\n最终年龄：${playerData.finalAge}\n存活：${playerData.isAlive ? '是' : '否'}\n投入年数：${playerData.totalYearsInvested}\n\n游戏日志：\n${gameLog}\n\n为这位研究人员写一段传记：`
              : `Player: ${playerData.name}\nTheories Published: ${playerData.theoriesPublished}\nFame: ${playerData.totalFame}\nFinal Age: ${playerData.finalAge}\nAlive: ${playerData.isAlive}\nYears Invested: ${playerData.totalYearsInvested}\n\nGame Log:\n${gameLog}\n\nWrite a bio for this researcher:`}`
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
  });
}
