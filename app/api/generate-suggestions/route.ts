import { NextResponse } from 'next/server'
import { getAvailableLLM, generateWithOpenAI, generateWithAnthropic, generateWithGoogle } from '../lib/llm'

export async function POST(request: Request) {
  const { entity, existingHypotheses = [], count = 3 } = await request.json()
  const llm = getAvailableLLM()

  if (!llm) {
    return NextResponse.json(
      { error: 'No LLM API key configured', fallback: true },
      { status: 503 }
    )
  }

  try {
    const suggestions = await Promise.all(
      Array(count).fill(null).map(async (_, i) => {
        const avoidList = [...existingHypotheses]

        switch (llm) {
          case 'openai':
            return await generateWithOpenAI(entity, avoidList)
          case 'anthropic':
            return await generateWithAnthropic(entity, avoidList)
          case 'google':
            return await generateWithGoogle(entity, avoidList)
          default:
            throw new Error('Unknown LLM provider')
        }
      })
    )

    return NextResponse.json({ suggestions, provider: llm })
  } catch (error: any) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 500 }
    )
  }
}
