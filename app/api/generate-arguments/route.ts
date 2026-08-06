import { NextResponse } from 'next/server'
import { getAvailableLLM, generateArgumentsWithOpenAI, generateArgumentsWithAnthropic, generateArgumentsWithGoogle } from '../lib/llm'

export async function POST(request: Request) {
  const { topic, count = 2 } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  if (!topic || count < 1) {
    return NextResponse.json(
      { error: 'topic is required and count must be at least 1', fallback: true },
      { status: 400 }
    )
  }

  try {
    let args: string[]

    switch (llm) {
      case 'openai':
        args = await generateArgumentsWithOpenAI(topic, count)
        break
      case 'anthropic':
        args = await generateArgumentsWithAnthropic(topic, count)
        break
      case 'google':
        args = await generateArgumentsWithGoogle(topic, count)
        break
      default:
        throw new Error('Unknown LLM provider')
    }

    return NextResponse.json({ arguments: args, provider: llm })
  } catch (error: any) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 500 }
    )
  }
}
