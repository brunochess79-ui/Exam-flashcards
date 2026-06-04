'use client'

import { useState } from 'react'

interface FlashcardProps {
  question: string
  answer: string
  index: number
  total: number
}

export default function Flashcard({ question, answer, index, total }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm font-medium text-indigo-600">
        Card {index + 1} of {total}
      </p>

      <div
        onClick={() => setFlipped((f) => !f)}
        className={`w-full min-h-48 rounded-2xl shadow-lg cursor-pointer transition-colors duration-300 flex flex-col items-center justify-center p-10 text-center ${
          flipped
            ? 'bg-indigo-600 border-2 border-indigo-600'
            : 'bg-white border-2 border-indigo-200'
        }`}
      >
        <span className={`text-xs font-semibold uppercase tracking-widest mb-4 ${flipped ? 'text-indigo-200' : 'text-indigo-400'}`}>
          {flipped ? 'Answer' : 'Question'}
        </span>
        <p className={`text-xl font-semibold leading-relaxed ${flipped ? 'text-white' : 'text-gray-800'}`}>
          {flipped ? answer : question}
        </p>
        <p className={`mt-6 text-xs ${flipped ? 'text-indigo-300' : 'text-gray-400'}`}>
          {flipped ? 'Click to see question' : 'Click to reveal answer'}
        </p>
      </div>
    </div>
  )
}
