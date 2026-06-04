import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const client = new OpenAI({
  baseURL: 'https://ollama.com/v1',
  apiKey: process.env.OLLAMA_API_KEY,
})

export async function POST(req: NextRequest) {
  const { subject, topic, totalCards, reviewCards, studentName } = await req.json()

  const model = process.env.OLLAMA_MODEL || 'gemma3:12b'
  const score = totalCards - reviewCards.length
  const percent = Math.round((score / totalCards) * 100)
  const nameGreeting = studentName?.trim() ? `The student's name is ${studentName.trim()}. Address them by name throughout.` : ''

  try {
    const response = await client.chat.completions.create({
      model,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: `You are an encouraging GCSE tutor giving personalised end-of-session feedback to a student. Be warm, specific, and motivating. Keep it concise — 3 short paragraphs max. ${nameGreeting}`,
        },
        {
          role: 'user',
          content: `Subject: ${subject}
Topic: ${topic}
Cards answered correctly: ${score} out of ${totalCards} (${percent}%)
Cards marked for review: ${reviewCards.length > 0 ? reviewCards.map((q: string, i: number) => `\n${i + 1}. ${q}`).join('') : 'None — great work!'}

Give the student:
1. A brief encouraging assessment of their performance
2. Specific study advice for the cards they struggled with (if any)
3. A motivating closing message to keep them going`,
        },
      ],
    })

    const feedback = response.choices[0]?.message?.content?.trim() ?? ''
    return NextResponse.json({ feedback })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
