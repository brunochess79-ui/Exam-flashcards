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
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-indigo-600">
        Card {index + 1} of {total}
      </p>

      <div
        className="perspective-1000 w-full max-w-2xl cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full h-72 transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl bg-white border-2 border-indigo-200 shadow-lg flex flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
              Question
            </span>
            <p className="text-xl font-semibold text-gray-800 leading-relaxed">{question}</p>
            <p className="mt-6 text-xs text-gray-400">Click to reveal answer</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl bg-indigo-600 shadow-lg flex flex-col items-center justify-center p-8 text-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-4">
              Answer
            </span>
            <p className="text-lg font-medium text-white leading-relaxed">{answer}</p>
            <p className="mt-6 text-xs text-indigo-300">Click to see question</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        {flipped ? 'Showing answer' : 'Showing question'}
      </p>
    </div>
  )
}
