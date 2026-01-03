import { NextResponse } from 'next/server'
import { getAvailableLLM, generateWithOpenAI, generateWithAnthropic, generateWithGoogle } from '../lib/llm'

export async function POST(request: Request) {
  const { entity, existingHypotheses = [], provenHypotheses = [] } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  try {
    let hypothesis: string

    switch (llm) {
      case 'openai':
        hypothesis = await generateWithOpenAI(entity, existingHypotheses, provenHypotheses)
        break
      case 'anthropic':
        hypothesis = await generateWithAnthropic(entity, existingHypotheses, provenHypotheses)
        break
      case 'google':
        hypothesis = await generateWithGoogle(entity, existingHypotheses, provenHypotheses)
        break
      default:
        throw new Error('Unknown LLM provider')
    }

    return NextResponse.json({ hypothesis, provider: llm })
  } catch (error: any) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 500 }
    )
  }
}
