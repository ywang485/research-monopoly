import { NextResponse } from 'next/server'
import { getAvailableLLM, generateEntityWithOpenAI, generateEntityWithAnthropic, generateEntityWithGoogle } from '../lib/llm'

export async function POST(request: Request) {
  const { entityType, count = 3, language = 'en' } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  try {
    const entities = await Promise.all(
      Array(count).fill(null).map(async (_, index) => {
        switch (llm) {
          case 'openai':
            return await generateEntityWithOpenAI(index, language)
          case 'anthropic':
            return await generateEntityWithAnthropic(entityType, index, language)
          case 'google':
            return await generateEntityWithGoogle(entityType, index, language)
          default:
            throw new Error('Unknown LLM provider')
        }
      })
    )

    return NextResponse.json({ entities, provider: llm })
  } catch (error: any) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 500 }
    )
  }
}
