'use client'

import { useState } from 'react'

interface FlashcardProps {
  question: string
  answer: string
  hint: string
  index: number
  total: number
  onKnow: () => void
  onReview: () => void
}

export default function Flashcard({ question, answer, hint, index, total, onKnow, onReview }: FlashcardProps) {
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
          {/* Front face */}
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

          {/* Back face */}
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

      {/* Hint — shown after flip */}
      {flipped && hint && (
        <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-5 py-3 flex items-start gap-3">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm text-amber-800 leading-relaxed">{hint}</p>
        </div>
      )}

      {/* Self-assessment buttons — shown after flip */}
      {flipped && (
        <div className="w-full flex gap-3 mt-1">
          <button
            onClick={(e) => { e.stopPropagation(); onReview() }}
            className="flex-1 py-3 rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-700 font-semibold text-sm hover:bg-rose-100 hover:border-rose-300 transition"
          >
            Need to review
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onKnow() }}
            className="flex-1 py-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 hover:border-emerald-300 transition"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  )
}
