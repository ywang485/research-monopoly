import { NextResponse } from 'next/server'
import { getAvailableLLM, generateAdditionWithOpenAI, generateAdditionWithAnthropic, generateAdditionWithGoogle } from '../lib/llm'

export async function POST(request: Request) {
  const { existingHypothesis } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  if (!existingHypothesis) {
    return NextResponse.json(
      { error: 'existingHypothesis is required', fallback: true },
      { status: 400 }
    )
  }

  try {
    let addition: string

    switch (llm) {
      case 'openai':
        addition = await generateAdditionWithOpenAI(existingHypothesis)
        break
      case 'anthropic':
        addition = await generateAdditionWithAnthropic(existingHypothesis)
        break
      case 'google':
        addition = await generateAdditionWithGoogle(existingHypothesis)
        break
      default:
        throw new Error('Unknown LLM provider')
    }

    return NextResponse.json({ addition, provider: llm })
  } catch (error: any) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 500 }
    )
  }
}
