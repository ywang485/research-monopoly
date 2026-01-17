import { NextResponse } from 'next/server'
import { getAvailableLLM, generateTheoryWithOpenAI, generateTheoryWithAnthropic, generateTheoryWithGoogle } from '../lib/llm'

export async function POST(request: Request) {
  const { entity, hypotheses, language = 'en' } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  if (!entity || !hypotheses || hypotheses.length === 0) {
    return NextResponse.json(
      { error: 'entity and hypotheses are required', fallback: true },
      { status: 400 }
    )
  }

  try {
    let theory: string

    switch (llm) {
      case 'openai':
        theory = await generateTheoryWithOpenAI(entity, hypotheses, language)
        break
      case 'anthropic':
        theory = await generateTheoryWithAnthropic(entity, hypotheses, language)
        break
      case 'google':
        theory = await generateTheoryWithGoogle(entity, hypotheses, language)
        break
      default:
        throw new Error('Unknown LLM provider')
    }

    return NextResponse.json({ theory, provider: llm })
  } catch (error: any) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 500 }
    )
  }
}
