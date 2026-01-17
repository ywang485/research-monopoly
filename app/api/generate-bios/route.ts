import { NextResponse } from 'next/server'
import { getAvailableLLM } from '../lib/llm'
import { generatePlayerBiosWithOpenAI, generatePlayerBiosWithAnthropic, generatePlayerBiosWithGoogle } from '../lib/player-bios'

export async function POST(request: Request) {
  const { players, gameLog, language = 'en' } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  if (!players || players.length === 0) {
    return NextResponse.json(
      { error: 'players data is required', fallback: true },
      { status: 400 }
    )
  }

  try {
    let bios: string[]

    switch (llm) {
      case 'openai':
        bios = await generatePlayerBiosWithOpenAI(players, gameLog || '', language)
        break
      case 'anthropic':
        bios = await generatePlayerBiosWithAnthropic(players, gameLog || '', language)
        break
      case 'google':
        bios = await generatePlayerBiosWithGoogle(players, gameLog || '', language)
        break
      default:
        throw new Error('Unknown LLM provider')
    }

    return NextResponse.json({ bios, provider: llm })
  } catch (error: any) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 500 }
    )
  }
}
