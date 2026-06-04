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

  const handleFlip = () => setFlipped(f => !f)

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-slate-500 font-medium px-1">
        <span>Card {index + 1} of {total}</span>
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Card */}
      <div
        onClick={handleFlip}
        className="w-full cursor-pointer select-none"
        style={{ perspective: '1400px', height: '300px' }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.45, 0, 0.55, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-10 rounded-2xl bg-white border border-slate-200 shadow-lg text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-6">
              Question
            </span>
            <p className="text-2xl font-semibold text-slate-800 leading-relaxed">
              {question}
            </p>
            <p className="mt-8 text-xs text-slate-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Click to flip
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-10 rounded-2xl text-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(160deg, #0d1b2a 0%, #1a2f4a 100%)',
            }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400 mb-6">
              Answer
            </span>
            <p className="text-xl font-medium text-white leading-relaxed">
              {answer}
            </p>
            <p className="mt-8 text-xs text-slate-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Click to flip back
            </p>
          </div>
        </div>
      </div>

      {/* Hint panel — slides in when flipped */}
      <div
        className={`w-full rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex gap-3 transition-all duration-300 ${
          flipped ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'
        }`}
      >
        <div className="mt-0.5 text-amber-500 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed">{hint}</p>
      </div>

      {/* Self-assessment buttons — visible when flipped */}
      <div
        className={`flex gap-3 transition-all duration-300 ${
          flipped ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'
        }`}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onReview() }}
          className="flex-1 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-sm hover:bg-rose-100 transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Need to review
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onKnow() }}
          className="flex-1 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Got it!
        </button>
      </div>
    </div>
  )
}
