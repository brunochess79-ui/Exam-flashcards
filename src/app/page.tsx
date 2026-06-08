'use client'

import { useState } from 'react'
import FlashcardDeck from '@/components/FlashcardDeck'
import DocumentLibrary from '@/components/DocumentLibrary'
import ExamQuestionView from '@/components/ExamQuestionView'
import { getBuiltInContext } from '@/lib/topicContext'
import { getContextForTopic } from '@/lib/documents'

interface FlashcardData {
  question: string
  answer: string
  hint: string
}

interface ExamQuestionResult {
  question: string
  commandWord: string
  context: string
  markScheme: string[]
  examinerTip: string
}

const SUBJECT_TOPICS: Record<string, string[]> = {
  Biology: [
    'Cells, Organelles and Microscopy',
    'Breathing and Respiration',
    'Variation and Inheritance',
    'Photosynthesis and Plant Reproduction',
  ],
  Chemistry: [
    '7.1 — Intro to Chemistry',
    '7.2 — Particle Theory',
    '7.3 — Elements, Compounds and Mixtures',
    '7.4 — Separating Substances',
    '7.5 — Types of Chemical Reaction',
    '7.6 — Acids and Alkalis',
    '8.1 — Atomic Structure and the Periodic Table',
    '8.2 — Heat Energy Changes',
    '8.3 — Reactivity Series, Metals, and Materials',
    '8.4 — Earth and Atmosphere',
  ],
  Physics: [
    'Forces & Motion — Density and Floating',
    'Forces & Motion — Speed, Distance and Time Graphs',
    'Forces & Motion — Acceleration and Velocity-Time Graphs',
    'Forces & Motion — Mass, Weight and Newton\'s Laws',
    'Forces & Motion — Terminal Velocity and Friction',
    'Energy — Forms, Conservation and Transfers',
    'Energy — Power, Efficiency and Units',
    'Thermal Physics — Particle Model and States of Matter',
    'Thermal Physics — Conduction, Convection and Radiation',
    'Thermal Physics — Evaporation and Brownian Motion',
    'Space — Day, Night, Seasons and Eclipses',
    'Space — Stars, Galaxies and Gravity',
    'Waves — Properties: Frequency, Wavelength, Amplitude',
    'Waves — Reflection and Refraction of Light',
    'Waves — Sound, Ultrasound and Echolocation',
    'Waves — Colour, Superposition and Interference',
    'Pressure — Pressure Equations and Upthrust',
    'Electronics — Components, Symbols and Circuit Diagrams',
    'Electronics — Thyristor, Polarisation',
  ],
  'Food Technology & Health': [
    'Eatwell Guide and Eight Tips for Healthy Living',
    'Factors Affecting Food Choice',
  ],
  English: [
    'Poetry — Key Terminology and Concepts (Y8)',
    'To Kill a Mockingbird — Key Terminology and Concepts',
    'Creative Writing — Key Terminology and Concepts',
    'Extended Creative Writing (inspired by TKAM)',
  ],
  Spanish: [
    'Viva 2 — Module 1',
    'Viva 2 — Module 2',
    'Viva 2 — Module 3',
    'Viva 2 — Module 4',
  ],
  Geography: [
    'Coasts',
    'Map Skills — OS and Atlas',
    'Africa',
    'Fieldwork',
    'Glaciation',
    'Polar Regions',
    'Tectonics',
    'Climate Change',
  ],
  History: [
    'The Transatlantic Slave Trade',
    'History of Warfare: Napoleonic Wars to WW1',
  ],
  'Religious Studies & Ethics': [
    'Ethical Theories',
    'Mindscapes — Key Concepts',
  ],
}

const SUBJECTS = Object.keys(SUBJECT_TOPICS)
const MARK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

type Mode = 'flashcards' | 'exam'

export default function Home() {
  const [mode, setMode] = useState<Mode>('flashcards')

  // Shared
  const [subject, setSubject] = useState('')
  const [studentName, setStudentName] = useState('')

  // Flashcard mode — multi-topic
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  // Exam mode — single topic
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [docLibOpen, setDocLibOpen] = useState(false)

  // Flashcard mode
  const [count, setCount] = useState(10)
  const [flashcards, setFlashcards] = useState<FlashcardData[] | null>(null)
  const [generatedSubject, setGeneratedSubject] = useState('')
  const [generatedTopic, setGeneratedTopic] = useState('')
  const [generatedName, setGeneratedName] = useState('')

  // Exam mode
  const [marks, setMarks] = useState(4)
  const [customTopic, setCustomTopic] = useState('')
  const [examResult, setExamResult] = useState<ExamQuestionResult | null>(null)
  const [examSubject, setExamSubject] = useState('')
  const [examTopic, setExamTopic] = useState('')
  const [examMarks, setExamMarks] = useState(4)

  const handleSubjectChange = (s: string) => {
    setSubject(s)
    setTopic('')
    setSelectedTopics([])
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || selectedTopics.length === 0) return
    setLoading(true)
    setError('')

    const topicStr = selectedTopics.join(', ')
    const builtIn = selectedTopics
      .map(t => {
        const ctx = getBuiltInContext(subject, t)
        return ctx ? `[${t}]\n${ctx}` : ''
      })
      .filter(Boolean)
      .join('\n\n')
    const userDocs = getContextForTopic(subject)
    const context = [builtIn, userDocs].filter(Boolean).join('\n\n')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic: topicStr, count, context, studentName }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setFlashcards(data.flashcards)
      setGeneratedSubject(subject)
      setGeneratedTopic(topicStr)
      setGeneratedName(studentName)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    const topicValue = customTopic.trim() || topic.trim()
    if (!subject.trim() || !topicValue) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/exam-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic: topicValue, marks, studentName }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setExamResult(data.result)
      setExamSubject(subject)
      setExamTopic(topicValue)
      setExamMarks(marks)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setFlashcards(null); setError('') }
  const handleExamReset = () => { setExamResult(null); setError('') }

  if (flashcards) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-16 px-4">
        <FlashcardDeck
          flashcards={flashcards}
          subject={generatedSubject}
          topic={generatedTopic}
          studentName={generatedName}
          onReset={handleReset}
        />
      </main>
    )
  }

  if (examResult) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-16 px-4">
        <ExamQuestionView
          result={examResult}
          subject={examSubject}
          topic={examTopic}
          marks={examMarks}
          onReset={handleExamReset}
        />
      </main>
    )
  }

  const topics = subject ? SUBJECT_TOPICS[subject] : []

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <DocumentLibrary open={docLibOpen} onClose={() => setDocLibOpen(false)} />

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GCSE Revision</h1>
          <p className="text-gray-500 mt-1">Flashcards and exam practice, powered by AI</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          <button
            onClick={() => { setMode('flashcards'); setError('') }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              mode === 'flashcards'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => { setMode('exam'); setError('') }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              mode === 'exam'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Exam Practice
          </button>
        </div>

        {/* ── FLASHCARD FORM ── */}
        {mode === 'flashcards' && (
          <form onSubmit={handleGenerate} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                required
              >
                <option value="" disabled>Select a subject...</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Topics <span className="text-gray-400 font-normal">(pick one or more)</span>
                </label>
                {subject && topics.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTopics(selectedTopics.length === topics.length ? [] : [...topics])}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition"
                  >
                    {selectedTopics.length === topics.length ? 'Deselect all' : 'Select all'}
                  </button>
                )}
              </div>
              <div className={`border border-gray-200 rounded-lg overflow-hidden ${!subject ? 'opacity-40' : ''}`}>
                {!subject ? (
                  <p className="text-sm text-gray-400 px-3 py-3">Select a subject first</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                    {topics.map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTopics.includes(t)}
                          onChange={(e) =>
                            setSelectedTopics(prev =>
                              e.target.checked ? [...prev, t] : prev.filter(x => x !== t)
                            )
                          }
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
                        />
                        <span className="text-sm text-gray-700 leading-snug">{t}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {selectedTopics.length > 0 && (
                <p className="text-xs text-indigo-600 mt-1.5 font-medium">
                  {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Number of flashcards
              </label>
              <input
                type="number"
                min={1}
                max={selectedTopics.length > 1 ? 30 * selectedTopics.length : 30}
                value={count}
                onChange={(e) => {
                  const max = selectedTopics.length > 1 ? 30 * selectedTopics.length : 30
                  setCount(Math.min(max, Math.max(1, Number(e.target.value))))
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {selectedTopics.length > 1 && (
                <p className="text-xs text-indigo-600 mt-1.5 font-medium">
                  ~{Math.ceil(count / selectedTopics.length)} per topic · max {30 * selectedTopics.length}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || !subject || selectedTopics.length === 0}
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
              ) : 'Generate Flashcards'}
            </button>
          </form>
        )}

        {/* ── EXAM PRACTICE FORM ── */}
        {mode === 'exam' && (
          <form onSubmit={handleGenerateExam} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                required
              >
                <option value="" disabled>Select a subject...</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic</label>
              <select
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setCustomTopic('') }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white disabled:opacity-40"
                disabled={!subject}
              >
                <option value="">{subject ? 'Select a topic (or type below)...' : 'Select a subject first'}</option>
                {topics.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Custom topic <span className="text-gray-400 font-normal">(overrides dropdown)</span>
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => { setCustomTopic(e.target.value); if (e.target.value) setTopic('') }}
                placeholder="e.g. Terminal velocity"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mark allocation</label>
              <div className="flex flex-wrap gap-2">
                {MARK_OPTIONS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMarks(m)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition border ${
                      marks === m
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {marks <= 2 ? 'State / recall' : marks <= 4 ? 'Describe / short explain' : marks <= 6 ? 'Explain in detail' : marks <= 9 ? 'Extended explanation' : 'Evaluate / essay'}
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || !subject || (!topic && !customTopic.trim())}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating question...
                </>
              ) : `Generate ${marks}-Mark Question`}
            </button>
          </form>
        )}

        {/* Document library button */}
        <button
          onClick={() => setDocLibOpen(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
        >
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Document Library
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by Ollama AI &middot; GCSE Level (UK)
        </p>
      </div>
    </main>
  )
}
