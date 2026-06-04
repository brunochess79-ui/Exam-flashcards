import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are an expert GCSE teacher generating flashcards for students at GCSE level (UK, ages 14-16).

Each flashcard must have:
- A clear, concise question on the front
- An accurate, well-explained answer on the back (2-4 sentences max)

Return ONLY a valid JSON array with no other text, in this exact format:
[
  {"question": "...", "answer": "..."},
  ...
]

Make the questions test key GCSE knowledge, definitions, processes, and application. Vary the style: definitions, "explain why", "what is the effect of", etc.`

export async function POST(req: NextRequest) {
  const { subject, topic, count } = await req.json()

  if (!subject?.trim() || !topic?.trim()) {
    return NextResponse.json(
      { error: 'Subject and topic are required' },
      { status: 400 }
    )
  }

  const cardCount = Math.min(Math.max(parseInt(count) || 10, 1), 30)

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Subject: ${subject.trim()}\nTopic: ${topic.trim()}\n\nGenerate exactly ${cardCount} GCSE-level flashcards.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
  }

  try {
    const text = content.text.trim()
    const jsonStart = text.indexOf('[')
    const jsonEnd = text.lastIndexOf(']')
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON array found in response')
    }
    const flashcards = JSON.parse(text.slice(jsonStart, jsonEnd + 1))
    if (!Array.isArray(flashcards)) {
      throw new Error('Response is not an array')
    }
    return NextResponse.json({ flashcards })
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse flashcards from AI response' },
      { status: 500 }
    )
  }
}
