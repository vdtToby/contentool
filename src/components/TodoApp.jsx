import React, { useState, useEffect, useRef, useCallback } from 'react'

const API = 'http://localhost:3001'

const PRIORITY_CONFIG = {
  high:   { label: 'Hoog',    color: 'bg-red-100 text-red-700 border-red-200',    dot: 'bg-red-500' },
  normal: { label: 'Normaal', color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  low:    { label: 'Laag',    color: 'bg-blue-100 text-blue-600 border-blue-200', dot: 'bg-blue-400' },
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins <= 1 ? 'zojuist' : `${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}u`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  const weeks = Math.floor(days / 7)
  return `${weeks}w`
}

function labelColors(label) {
  const colors = ['bg-purple-100 text-purple-700', 'bg-teal-100 text-teal-700', 'bg-yellow-100 text-yellow-700', 'bg-pink-100 text-pink-700', 'bg-indigo-100 text-indigo-700']
  let hash = 0
  for (const c of label) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff
  return colors[hash % colors.length]
}

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('normal')
  const [labelInput, setLabelInput] = useState('')
  const [filter, setFilter] = useState('open')
  const [activeLabel, setActiveLabel] = useState(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [whisperLoading, setWhisperLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const fileInputRef = useRef(null)

  const fetchTodos = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/todos`)
      setTodos(await r.json())
    } catch (e) { setError('Kan todos niet laden') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchTodos() }, [fetchTodos])

  async function addTodo(text, opts = {}) {
    if (!text.trim()) return
    const labels = labelInput.split(',').map(l => l.trim().replace(/^#/, '')).filter(Boolean)
    const r = await fetch(`${API}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), priority: opts.priority || priority, labels: opts.labels || labels })
    })
    const todo = await r.json()
    setTodos(prev => [todo, ...prev])
    setInput('')
    setLabelInput('')
  }

  async function toggleDone(todo) {
    const r = await fetch(`${API}/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done })
    })
    const updated = await r.json()
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  async function deleteTodo(id) {
    await fetch(`${API}/api/todos/${id}`, { method: 'DELETE' })
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  async function handleScreenshot(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setOcrLoading(true)
    setError(null)
    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result.split(',')[1])
        reader.onerror = rej
        reader.readAsDataURL(file)
      })
      const r = await fetch(`${API}/api/ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mediaType: file.type })
      })
      const { text, error: err } = await r.json()
      if (err) throw new Error(err)
      setInput(text)
    } catch (e) {
      setError(`OCR mislukt: ${e.message}`)
    } finally {
      setOcrLoading(false)
      e.target.value = ''
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const mr = new MediaRecorder(stream)
      mr.ondataavailable = e => chunksRef.current.push(e.data)
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(blob)
      }
      mr.start()
      mediaRecorderRef.current = mr
      setRecording(true)
    } catch (e) {
      setError('Geen microfoon toegang')
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  async function transcribeAudio(blob) {
    setWhisperLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('audio', blob, 'audio.webm')
      const r = await fetch(`${API}/api/whisper`, { method: 'POST', body: fd })
      const { text, error: err } = await r.json()
      if (err) throw new Error(err)
      setInput(text)
    } catch (e) {
      setError(`Whisper mislukt: ${e.message}`)
    } finally {
      setWhisperLoading(false)
    }
  }

  const allLabels = [...new Set(todos.flatMap(t => t.labels))]

  const visible = todos.filter(t => {
    if (filter === 'open' && t.done) return false
    if (filter === 'done' && !t.done) return false
    if (activeLabel && !t.labels.includes(activeLabel)) return false
    return true
  })

  const sorted = [...visible].sort((a, b) => {
    const po = { high: 0, normal: 1, low: 2 }
    if (!a.done && !b.done) return po[a.priority] - po[b.priority]
    return 0
  })

  return (
    <div className="max-w-2xl mx-auto px-2 py-4">
      {/* Input area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA766]/40"
            placeholder="Nieuwe taak..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo(input)}
          />
          <button
            onClick={() => addTodo(input)}
            className="bg-[#2FA766] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#28966a] transition-colors"
          >
            +
          </button>
        </div>

        {/* Priority + labels row */}
        <div className="flex gap-2 flex-wrap">
          {['high', 'normal', 'low'].map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${priority === p ? PRIORITY_CONFIG[p].color + ' font-semibold' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
            >
              {PRIORITY_CONFIG[p].label}
            </button>
          ))}
          <input
            className="flex-1 min-w-24 border border-gray-200 rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#2FA766]/40"
            placeholder="#label, #label"
            value={labelInput}
            onChange={e => setLabelInput(e.target.value)}
          />
        </div>

        {/* Quick-add buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={ocrLoading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2FA766] transition-colors disabled:opacity-50"
            title="Screenshot uploaden"
          >
            {ocrLoading ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            Screenshot
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshot} />

          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={whisperLoading}
            className={`flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 ${recording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-[#2FA766]'}`}
            title="Spraak invoer"
          >
            {whisperLoading ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <svg className="w-4 h-4" fill={recording ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
            {recording ? 'Stop opname' : 'Spreek in'}
          </button>
        </div>

        {error && (
          <div className="mt-2 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {['open', 'done', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filter === f ? 'bg-[#2FA766] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
          >
            {{ open: 'Open', done: 'Gedaan', all: 'Alles' }[f]}
            {f === 'open' && <span className="ml-1 opacity-70">{todos.filter(t => !t.done).length}</span>}
          </button>
        ))}
        {allLabels.map(l => (
          <button
            key={l}
            onClick={() => setActiveLabel(activeLabel === l ? null : l)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${activeLabel === l ? 'ring-2 ring-offset-1 ring-[#2FA766] ' + labelColors(l) : labelColors(l) + ' opacity-70 hover:opacity-100'}`}
          >
            #{l}
          </button>
        ))}
      </div>

      {/* Todo list */}
      {loading ? (
        <div className="text-center text-gray-400 py-12 text-sm">Laden...</div>
      ) : sorted.length === 0 ? (
        <div className="text-center text-gray-300 py-12 text-sm">Geen taken</div>
      ) : (
        <div className="space-y-2">
          {sorted.map(todo => (
            <div
              key={todo.id}
              className={`group flex items-start gap-3 bg-white rounded-xl border p-3.5 transition-all ${todo.done ? 'opacity-50 border-gray-100' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleDone(todo)}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors ${todo.done ? 'bg-[#2FA766] border-[#2FA766]' : 'border-gray-300 hover:border-[#2FA766]'}`}
              >
                {todo.done && (
                  <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {todo.text}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {/* Priority dot */}
                  {!todo.done && todo.priority !== 'normal' && (
                    <span className={`inline-flex items-center gap-1 text-xs ${PRIORITY_CONFIG[todo.priority].color} px-2 py-0.5 rounded-full border`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_CONFIG[todo.priority].dot}`} />
                      {PRIORITY_CONFIG[todo.priority].label}
                    </span>
                  )}
                  {/* Labels */}
                  {todo.labels.map(l => (
                    <span key={l} className={`text-xs px-2 py-0.5 rounded-full ${labelColors(l)}`}>#{l}</span>
                  ))}
                  {/* Age */}
                  <span className="text-xs text-gray-300">
                    {todo.done
                      ? `klaar na ${timeAgo(todo.createdAt)}`
                      : `open ${timeAgo(todo.createdAt)}`
                    }
                  </span>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-300 hover:text-red-400 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
