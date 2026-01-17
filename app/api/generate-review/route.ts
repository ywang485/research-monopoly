import { NextResponse } from 'next/server'
import { getAvailableLLM, generateReviewWithOpenAI, generateReviewWithAnthropic, generateReviewWithGoogle } from '../lib/llm'

export async function POST(request: Request) {
  const { hypothesis, language = 'en' } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  if (!hypothesis) {
    return NextResponse.json(
      { error: 'hypothesis is required', fallback: true },
      { status: 400 }
    )
  }

  try {
    let review: string

    switch (llm) {
      case 'openai':
        review = await generateReviewWithOpenAI(hypothesis, language)
        break
      case 'anthropic':
        review = await generateReviewWithAnthropic(hypothesis, language)
        break
      case 'google':
        review = await generateReviewWithGoogle(hypothesis, language)
        break
      default:
        throw new Error('Unknown LLM provider')
    }

    return NextResponse.json({ review, provider: llm })
  } catch (error: any) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 500 }
    )
  }
}
