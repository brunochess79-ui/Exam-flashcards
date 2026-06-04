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
    <div className="w-full flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-indigo-500 tracking-wide">
        {index + 1} / {total}
      </p>

      {/* Perspective wrapper — must have explicit height so absolute children fill it */}
      <div
        onClick={() => setFlipped(f => !f)}
        className="w-full cursor-pointer select-none"
        style={{ perspective: '1400px', height: '320px' }}
      >
        {/* Rotating inner card */}
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.45, 0, 0.55, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ── Front face ── */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-12 rounded-2xl text-center bg-white border-2 border-slate-200 shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-5">
              Question
            </span>
            <p className="text-2xl font-semibold text-slate-800 leading-relaxed max-w-3xl">
              {question}
            </p>
            <span className="mt-8 text-xs text-slate-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
              Click to reveal answer
            </span>
          </div>

          {/* ── Back face ── */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-12 rounded-2xl text-center shadow-xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
            }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200 mb-5">
              Answer
            </span>
            <p className="text-xl font-medium text-white leading-relaxed max-w-3xl">
              {answer}
            </p>
            <span className="mt-8 text-xs text-indigo-300 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
              Click to see question
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
