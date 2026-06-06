import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const client = new OpenAI({
  baseURL: 'https://ollama.com/v1',
  apiKey: process.env.OLLAMA_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert GCSE teacher generating flashcards for students at GCSE level (UK, ages 14-16).

ACCURACY IS PARAMOUNT. Every fact, definition, equation, translation, conjugation and example must be completely correct. If you are not 100% certain something is accurate, do not include it. NEVER invent terminology, coined terms, landforms, processes, or definitions — only use vocabulary and concepts that appear in the study material provided below, or that are universally established in mainstream UK GCSE courses. If in doubt, leave it out.

For LANGUAGE subjects (Spanish, French, etc.):
- ONLY use vocabulary, conjugations and translations that are provided in the study material below, or that you are absolutely certain are correct.
- Do NOT invent, guess or paraphrase vocabulary or grammar rules.
- Every Spanish/French word and its translation must be verified correct.
- Conjugation tables must be complete and accurate — do not mix up verb endings.
- If the study material lists specific vocabulary or phrases, use those exact words.

Each flashcard must have:
- A clear, concise question on the front
- An accurate, well-explained answer on the back (2-4 sentences max)
- A short hint with an extra memory aid, exam tip, or common misconception to avoid (1-2 sentences)

Return ONLY a valid JSON array with no other text, in this exact format:
[
  {"question": "...", "answer": "...", "hint": "..."},
  ...
]

Make the questions test key GCSE knowledge, definitions, processes, and application. Vary the style: definitions, "explain why", "what is the effect of", etc.`

export async function POST(req: NextRequest) {
  const { subject, topic, count, context, studentName } = await req.json()

  if (!subject?.trim() || !topic?.trim()) {
    return NextResponse.json(
      { error: 'Subject and topic are required' },
      { status: 400 }
    )
  }

  if (!process.env.OLLAMA_API_KEY) {
    return NextResponse.json(
      { error: 'OLLAMA_API_KEY is not configured on the server.' },
      { status: 500 }
    )
  }

  const cardCount = Math.min(Math.max(parseInt(count) || 10, 1), 30)
  const name = studentName?.trim() || ''

  let userMessage = `Subject: ${subject.trim()}\nTopic: ${topic.trim()}\n`
  if (name) userMessage += `Student name: ${name}\n`
  if (context?.trim()) {
    userMessage += `\nUse the following syllabus/study material to ensure the flashcards cover the exact content required:\n\n${context.trim()}\n`
  }
  userMessage += `\nGenerate exactly ${cardCount} GCSE-level flashcards.`

  try {
    const model = process.env.OLLAMA_MODEL || 'gemma3:12b'
    const response = await client.chat.completions.create({
      model,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    })

    const text = response.choices[0]?.message?.content?.trim() ?? ''
    const jsonStart = text.indexOf('[')
    const jsonEnd = text.lastIndexOf(']')

    if (jsonStart === -1 || jsonEnd === -1) {
      return NextResponse.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 500 }
      )
    }

    const flashcards = JSON.parse(text.slice(jsonStart, jsonEnd + 1))

    if (!Array.isArray(flashcards)) {
      return NextResponse.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ flashcards })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Ollama API error:', message)
    return NextResponse.json(
      { error: `Failed to generate flashcards: ${message}` },
      { status: 500 }
    )
  }
}
