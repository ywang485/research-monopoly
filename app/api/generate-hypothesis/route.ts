import { NextResponse } from 'next/server'
import { getAvailableLLM, generateWithOpenAI, generateWithAnthropic, generateWithGoogle } from '../lib/llm'

export async function POST(request: Request) {
  const { entity, existingHypotheses = [], provenHypotheses = [], teamArgument } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  try {
    let hypothesis: string

    // This route is only ever called for AI players' own hypotheses (see ai.js
    // generateLLMHypothesis) - never for human-facing suggestions - so it always
    // uses the deliberately sloppy AI-slop style.
    switch (llm) {
      case 'openai':
        hypothesis = await generateWithOpenAI(entity, existingHypotheses, provenHypotheses, teamArgument, true)
        break
      case 'anthropic':
        hypothesis = await generateWithAnthropic(entity, existingHypotheses, provenHypotheses, teamArgument, true)
        break
      case 'google':
        hypothesis = await generateWithGoogle(entity, existingHypotheses, provenHypotheses, teamArgument, true)
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
