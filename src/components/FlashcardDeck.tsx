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

  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(flashcards.length - 1, c + 1))

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">{topic}</h2>
        <p className="text-sm text-gray-500 mt-1">{subject} &mdash; GCSE Level</p>
      </div>

      <Flashcard
        key={current}
        question={flashcards[current].question}
        answer={flashcards[current].answer}
        index={current}
        total={flashcards.length}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          disabled={current === 0}
          className="px-6 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>

        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
          {flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === current ? 'bg-indigo-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === flashcards.length - 1}
          className="px-6 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>

      <button
        onClick={onReset}
        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition"
      >
        Generate new flashcards
      </button>
    </div>
  )
}
