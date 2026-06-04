'use client'

import { useState } from 'react'
import Flashcard from './Flashcard'

interface FlashcardData {
  question: string
  answer: string
  hint: string
}

interface FlashcardDeckProps {
  flashcards: FlashcardData[]
  subject: string
  topic: string
  onReset: () => void
}

export default function FlashcardDeck({ flashcards, subject, topic, onReset }: FlashcardDeckProps) {
  const [current, setCurrent] = useState(0)
  const [known, setKnown] = useState<Set<number>>(new Set())
  const [review, setReview] = useState<Set<number>>(new Set())
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  const advance = () => {
    if (current < flashcards.length - 1) {
      setCurrent(c => c + 1)
    } else {
      fetchFeedback()
      setDone(true)
    }
  }

  const handleKnow = () => {
    setKnown(s => new Set(s).add(current))
    setReview(s => { const n = new Set(s); n.delete(current); return n })
    advance()
  }

  const handleReview = () => {
    setReview(s => new Set(s).add(current))
    setKnown(s => { const n = new Set(s); n.delete(current); return n })
    advance()
  }

  const fetchFeedback = async () => {
    setLoadingFeedback(true)
    const reviewQuestions = Array.from(review).map(i => flashcards[i].question)
    // include current card in review count if not yet answered
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          totalCards: flashcards.length,
          reviewCards: reviewQuestions,
        }),
      })
      const data = await res.json()
      setFeedback(data.feedback || '')
    } catch {
      setFeedback('')
    } finally {
      setLoadingFeedback(false)
    }
  }

  if (done) {
    const knownCount = known.size
    const reviewCount = review.size
    const unanswered = flashcards.length - knownCount - reviewCount
    const total = flashcards.length
    const score = Math.round((knownCount / total) * 100)

    return (
      <div className="w-full max-w-3xl mx-auto px-6 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Session Complete!</h2>
          <p className="text-slate-500 mt-1">{topic} &mdash; {subject}</p>
        </div>

        {/* Score */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-emerald-600">{knownCount}</p>
            <p className="text-sm text-emerald-700 font-medium mt-1">Got it</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-indigo-600">{score}%</p>
            <p className="text-sm text-indigo-700 font-medium mt-1">Score</p>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-rose-600">{reviewCount + unanswered}</p>
            <p className="text-sm text-rose-700 font-medium mt-1">To review</p>
          </div>
        </div>

        {/* Cards to review */}
        {review.size > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Questions to revisit
            </h3>
            <ul className="flex flex-col gap-2">
              {Array.from(review).map(i => (
                <li key={i} className="text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-100">
                  {flashcards[i].question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Feedback */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Your tutor says...
          </h3>
          {loadingFeedback ? (
            <div className="flex items-center gap-3 text-indigo-600 text-sm">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Preparing your personalised feedback...
            </div>
          ) : feedback ? (
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{feedback}</p>
          ) : (
            <p className="text-slate-500 text-sm">Great effort working through all {total} cards!</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition shadow-sm"
          >
            New topic
          </button>
          <button
            onClick={() => { setCurrent(0); setKnown(new Set()); setReview(new Set()); setDone(false); setFeedback('') }}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition shadow-sm"
          >
            Retry this deck
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">{topic}</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">{subject} &mdash; GCSE Level</p>
      </div>

      <Flashcard
        key={current}
        question={flashcards[current].question}
        answer={flashcards[current].answer}
        hint={flashcards[current].hint ?? ''}
        index={current}
        total={flashcards.length}
        onKnow={handleKnow}
        onReview={handleReview}
      />

      {/* Manual navigation */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-2 rounded-lg text-slate-500 text-sm font-medium hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          ← Back
        </button>
        <div className="flex flex-wrap justify-center gap-1.5">
          {flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current ? 'bg-indigo-600 w-5 h-3' :
                known.has(i) ? 'bg-emerald-400 w-3 h-3' :
                review.has(i) ? 'bg-rose-400 w-3 h-3' :
                'bg-slate-200 hover:bg-slate-300 w-3 h-3'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent(c => Math.min(flashcards.length - 1, c + 1))}
          disabled={current === flashcards.length - 1}
          className="px-4 py-2 rounded-lg text-slate-500 text-sm font-medium hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Skip →
        </button>
      </div>

      <div className="text-center">
        <button onClick={onReset} className="text-xs text-slate-400 hover:text-slate-600 transition">
          ← Start over
        </button>
      </div>
    </div>
  )
}
