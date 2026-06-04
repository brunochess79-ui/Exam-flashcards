import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const client = new OpenAI({
  baseURL: 'https://ollama.com/v1',
  apiKey: process.env.OLLAMA_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert GCSE examiner writing exam questions for UK students aged 14-16.

Generate a realistic GCSE exam question for the given subject, topic, and mark allocation.

Return ONLY valid JSON in this exact format (no other text):
{
  "question": "The full exam question text, including the mark allocation in square brackets at the end e.g. [4 marks]",
  "commandWord": "The command word used e.g. State / Describe / Explain / Evaluate / Calculate",
  "context": "Optional short scenario or stimulus text shown before the question (empty string if not needed)",
  "markScheme": ["Point 1 (1 mark)", "Point 2 (1 mark)", "..."],
  "examinerTip": "A brief tip on how to approach this type of question to score full marks"
}

Guidelines by mark allocation:
- 1–2 marks: Use "State" or "Name" — simple recall, one fact per mark
- 3–4 marks: Use "Describe" or "Explain" — require developed points
- 5–6 marks: Use "Explain" or "Describe and explain" — multi-step reasoning
- 7–9 marks: Use "Explain in detail" — thorough mechanistic explanation
- 10–12 marks: Use "Evaluate" or "Discuss" — balanced argument, conclusion required

Mark scheme format: each entry should be one creditworthy point. For "explain" marks, show linked pairs e.g. "As speed increases (1) → air resistance increases (1)". For extended writing, include a Quality of Written Communication (QWC) note if ≥ 6 marks.`

export async function POST(req: NextRequest) {
  const { subject, topic, marks, studentName } = await req.json()

  if (!subject?.trim() || !topic?.trim() || !marks) {
    return NextResponse.json({ error: 'Subject, topic and marks are required' }, { status: 400 })
  }

  if (!process.env.OLLAMA_API_KEY) {
    return NextResponse.json({ error: 'OLLAMA_API_KEY is not configured on the server.' }, { status: 500 })
  }

  const markCount = Math.min(Math.max(parseInt(marks) || 4, 1), 12)
  const name = studentName?.trim() ? ` The student's name is ${studentName.trim()}.` : ''

  try {
    const model = process.env.OLLAMA_MODEL || 'gemma3:12b'
    const response = await client.chat.completions.create({
      model,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Subject: ${subject.trim()}\nTopic: ${topic.trim()}\nMark allocation: ${markCount} marks${name}\n\nGenerate a GCSE exam question.`,
        },
      ],
    })

    const text = response.choices[0]?.message?.content?.trim() ?? ''
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}')

    if (jsonStart === -1 || jsonEnd === -1) {
      return NextResponse.json({ error: 'AI returned an unexpected format. Please try again.' }, { status: 500 })
    }

    const result = JSON.parse(text.slice(jsonStart, jsonEnd + 1))
    return NextResponse.json({ result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Ollama API error:', message)
    return NextResponse.json({ error: `Failed to generate question: ${message}` }, { status: 500 })
  }
}
