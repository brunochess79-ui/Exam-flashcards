export interface StoredDocument {
  id: string
  name: string
  subject: string
  content: string
  createdAt: number
}

const KEY = 'gcse_documents'

export function getDocuments(): StoredDocument[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveDocument(doc: Omit<StoredDocument, 'id' | 'createdAt'>): StoredDocument {
  const docs = getDocuments()
  const newDoc: StoredDocument = {
    ...doc,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  docs.push(newDoc)
  localStorage.setItem(KEY, JSON.stringify(docs))
  return newDoc
}

export function deleteDocument(id: string): void {
  const docs = getDocuments().filter(d => d.id !== id)
  localStorage.setItem(KEY, JSON.stringify(docs))
}

export function getContextForTopic(subject: string): string {
  const docs = getDocuments()
  const relevant = docs.filter(d => !d.subject || d.subject === subject || d.subject === 'All subjects')
  if (relevant.length === 0) return ''
  return relevant.map(d => `=== ${d.name} ===\n${d.content}`).join('\n\n')
}
