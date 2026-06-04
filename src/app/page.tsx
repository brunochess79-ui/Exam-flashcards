'use client'

import { useState } from 'react'
import FlashcardDeck from '@/components/FlashcardDeck'

interface FlashcardData {
  question: string
  answer: string
}

const SUBJECTS = [
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'English Literature',
  'English Language',
  'History',
  'Geography',
  'Computer Science',
  'French',
  'Spanish',
  'German',
  'Religious Studies',
  'Business Studies',
  'Economics',
  'Psychology',
  'Sociology',
  'Art & Design',
  'Music',
  'Physical Education',
  'Other',
]

export default function Home() {
  const [subject, setSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [flashcards, setFlashcards] = useState<FlashcardData[] | null>(null)
  const [generatedSubject, setGeneratedSubject] = useState('')
  const [generatedTopic, setGeneratedTopic] = useState('')

  const activeSubject = subject === 'Other' ? customSubject : subject

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeSubject.trim() || !topic.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: activeSubject, topic, count }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setFlashcards(data.flashcards)
      setGeneratedSubject(activeSubject)
      setGeneratedTopic(topic)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFlashcards(null)
    setError('')
  }

  if (flashcards) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <FlashcardDeck
          flashcards={flashcards}
          subject={generatedSubject}
          topic={generatedTopic}
          onReset={handleReset}
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GCSE Flashcards</h1>
          <p className="text-gray-500 mt-2">Enter a subject and topic to generate revision flashcards</p>
        </div>

        <form onSubmit={handleGenerate} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              required
            >
              <option value="" disabled>Select a subject...</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {subject === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Custom Subject</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Media Studies"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, The French Revolution, Quadratic Equations..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-gray-700">Number of flashcards</label>
              <span className="text-sm font-semibold text-indigo-600 tabular-nums w-6 text-right">{count}</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-gray-200"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !activeSubject.trim() || !topic.trim()}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating flashcards...
              </>
            ) : (
              'Generate Flashcards'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by Claude AI &middot; GCSE Level (UK)
        </p>
      </div>
    </main>
  )
}
