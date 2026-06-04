'use client'

interface ExamQuestionResult {
  question: string
  commandWord: string
  context: string
  markScheme: string[]
  examinerTip: string
}

interface ExamQuestionViewProps {
  result: ExamQuestionResult
  subject: string
  topic: string
  marks: number
  onReset: () => void
}

export default function ExamQuestionView({ result, subject, topic, marks, onReset }: ExamQuestionViewProps) {
  const commandColors: Record<string, string> = {
    State: 'bg-blue-100 text-blue-700 border-blue-200',
    Name: 'bg-blue-100 text-blue-700 border-blue-200',
    Describe: 'bg-violet-100 text-violet-700 border-violet-200',
    Explain: 'bg-amber-100 text-amber-700 border-amber-200',
    Calculate: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Evaluate: 'bg-rose-100 text-rose-700 border-rose-200',
    Discuss: 'bg-rose-100 text-rose-700 border-rose-200',
    Compare: 'bg-orange-100 text-orange-700 border-orange-200',
  }
  const cmdColor = commandColors[result.commandWord] ?? 'bg-slate-100 text-slate-700 border-slate-200'

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm text-slate-500 font-medium">{subject} &mdash; {topic}</p>
      </div>

      {/* Exam question paper */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Paper header strip */}
        <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Exam Question</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cmdColor}`}>
              {result.commandWord}
            </span>
            <span className="text-xs font-bold text-white bg-indigo-500 px-2.5 py-0.5 rounded-full">
              {marks} {marks === 1 ? 'mark' : 'marks'}
            </span>
          </div>
        </div>

        {/* Context / stimulus */}
        {result.context && (
          <div className="px-6 pt-5 pb-0">
            <p className="text-sm text-slate-600 italic leading-relaxed bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
              {result.context}
            </p>
          </div>
        )}

        {/* Question text */}
        <div className="px-6 py-5">
          <p className="text-base font-medium text-slate-800 leading-relaxed">{result.question}</p>

          {/* Answer lines */}
          <div className="mt-5 flex flex-col gap-2">
            {Array.from({ length: Math.min(marks + 1, 10) }).map((_, i) => (
              <div key={i} className="w-full border-b border-dashed border-slate-300 h-7" />
            ))}
          </div>
        </div>
      </div>

      {/* Mark scheme */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-emerald-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold text-emerald-800 uppercase tracking-wide">Mark Scheme</span>
        </div>
        <ul className="px-5 py-4 flex flex-col gap-2">
          {result.markScheme.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-emerald-900">
              <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Examiner tip */}
      {result.examinerTip && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Examiner&rsquo;s Tip</p>
            <p className="text-sm text-amber-900 leading-relaxed">{result.examinerTip}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition shadow-sm"
        >
          ← New question
        </button>
      </div>
    </div>
  )
}
