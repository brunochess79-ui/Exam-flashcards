'use client'

import { useState, useEffect, useRef } from 'react'
import { getDocuments, saveDocument, deleteDocument, StoredDocument } from '@/lib/documents'

const SUBJECTS = [
  'All subjects',
  'Biology',
  'Chemistry',
  'Physics',
  'Food Technology & Health',
  'English',
  'Spanish',
  'Geography',
  'History',
  'Religious Studies & Ethics',
]

interface DocumentLibraryProps {
  open: boolean
  onClose: () => void
}

export default function DocumentLibrary({ open, onClose }: DocumentLibraryProps) {
  const [docs, setDocs] = useState<StoredDocument[]>([])
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('All subjects')
  const [content, setContent] = useState('')
  const [adding, setAdding] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setDocs(getDocuments())
  }, [open])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!name) setName(file.name.replace(/\.[^.]+$/, ''))
    const reader = new FileReader()
    reader.onload = (ev) => setContent(ev.target?.result as string)
    reader.readAsText(file)
  }

  const handleAdd = () => {
    if (!name.trim() || !content.trim()) return
    const doc = saveDocument({ name: name.trim(), subject, content: content.trim() })
    setDocs(d => [...d, doc])
    setName('')
    setSubject('All subjects')
    setContent('')
    setAdding(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = (id: string) => {
    deleteDocument(id)
    setDocs(d => d.filter(doc => doc.id !== id))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Document Library</h2>
            <p className="text-xs text-slate-400 mt-0.5">Uploaded docs are used as context when generating flashcards</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
          {docs.length === 0 && !adding && (
            <p className="text-sm text-slate-400 text-center py-8">No documents yet. Add one below to enrich your flashcards.</p>
          )}
          {docs.map(doc => (
            <div key={doc.id} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                <p className="text-xs text-slate-400">{doc.subject} &middot; {doc.content.length.toLocaleString()} chars</p>
              </div>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-slate-300 hover:text-rose-500 transition p-1 rounded shrink-0"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {/* Add form */}
          {adding ? (
            <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-4 flex flex-col gap-3 mt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Document name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-indigo-600 font-medium cursor-pointer hover:text-indigo-700 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload a text file
                <input ref={fileRef} type="file" accept=".txt,.md,.csv" className="hidden" onChange={handleFile} />
              </label>
              <textarea
                placeholder="Or paste content here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setAdding(false); setName(''); setContent('') }} className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 transition">
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!name.trim() || !content.trim()}
                  className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Save document
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="mt-2 flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 transition px-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add document
            </button>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
