'use client'

import { useState } from 'react'
import Flashcard from './Flashcard'

interface FlashcardData {
  question: string
  answer: string
}

interface FlashcardDeckProps {
  flashcards: FlashcardData[]
  subject: string
  topic: string
  onReset: () => void
}

export default function FlashcardDeck({ flashcards, subject, topic, onReset }: FlashcardDeckProps) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(flashcards.length - 1, c + 1))

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">{topic}</h2>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">{subject} &mdash; GCSE Level</p>
      </div>

      {/* Card — full width of the container */}
      <Flashcard
        key={current}
        question={flashcards[current].question}
        answer={flashcards[current].answer}
        index={current}
        total={flashcards.length}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
        >
          ← Previous
        </button>

        {/* Dot indicators */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? 'bg-indigo-600 w-5 h-3'
                  : 'bg-slate-200 hover:bg-slate-300 w-3 h-3'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === flashcards.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
        >
          Next →
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onReset}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-4 transition"
        >
          ← Generate new flashcards
        </button>
      </div>
    </div>
  )
}
