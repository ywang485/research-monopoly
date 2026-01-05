import { NextResponse } from 'next/server'
import { getAvailableLLM } from '../lib/llm'

export async function GET() {
  const llm = getAvailableLLM()
  return NextResponse.json({
    available: !!llm,
    provider: llm
  })
}
