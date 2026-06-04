import React, { useState, useEffect } from 'react'
import { CONTENT_PILLARS, DOELGROEPEN, generateContent } from '../gemini.js'

function getWeekStart(weekOffset) {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  monday.setDate(monday.getDate() + weekOffset * 7)
  return new Date(monday.getFullYear(), monday.getMonth(), monday.getDate())
}

function formatDate(date) {
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

function dateToISO(date) {
  return date.toISOString().split('T')[0]
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function weekRangeLabel(weekIndex) {
  const start = getWeekStart(weekIndex)
  const end = addDays(start, 4)
  return `${formatDate(start)} – ${formatDate(end)}`
}

function getPillar(id) {
  return CONTENT_PILLARS.find(p => p.id === id) || CONTENT_PILLARS[0]
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const STATUS_COLORS = {
  gepland: 'bg-gray-100 text-gray-600',
  gegenereerd: 'bg-blue-100 text-blue-700',
  klaar: 'bg-green-100 text-green-700',
}

const STATUS_LABELS = {
  gepland: 'Gepland',
  gegenereerd: 'Gegenereerd',
  klaar: 'Klaar ✓',
}

const STATUS_NEXT = {
  gepland: 'gegenereerd',
  gegenereerd: 'klaar',
  klaar: 'gepland',
}

const TYPE_LABELS = {
  linkedin: 'LinkedIn',
  newsletter: 'Nieuwsbrief',
}

const PLANNING_PROMPT = `Stel een 4-weken LinkedIn-contentplanning voor voor VDT Advocaten.
Gebruik de VDT Content Engine strategie:
- Week 1-2: Herkenning (wie is VDT, veelgemaakte fouten, ondernemersvraagstukken)
- Week 3-4: Autoriteit (inzichten, trends, praktijklessen)
Wissel af tussen doelgroepen: Ondernemers, Accountants, Vastgoedprofessionals, HR-professionals, Financieel professionals.
Wissel af tussen contentpijlers: Praktijkinzichten, Praktijkcases, Netwerk & Events, Mensen achter VDT.

Geef precies 8 posts terug (2 per week), in dit JSON-formaat (alleen JSON, geen uitleg):
[
  {
    "week": 1,
    "type": "linkedin",
    "pijler": "Praktijkinzichten",
    "doelgroep": "Ondernemers",
    "onderwerp": "...",
    "toelichting": "..."
  }
]`

export default function Planning({ apiKey }) {
  const [slots, setSlots] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vdt_planning') || '[]')
    } catch {
      return []
    }
  })
  const [generatingId, setGeneratingId] = useState(null)
  const [activeSlot, setActiveSlot] = useState(null)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestError, setSuggestError] = useState(null)
  const [addingWeek, setAddingWeek] = useState(null)
  const [newSlotForm, setNewSlotForm] = useState({
    type: 'linkedin',
    pijler: CONTENT_PILLARS[0].id,
    doelgroep: DOELGROEPEN[0].id,
    onderwerp: '',
    datum: '',
  })
  const [generateError, setGenerateError] = useState(null)

  useEffect(() => {
    localStorage.setItem('vdt_planning', JSON.stringify(slots))
  }, [slots])

  async function handleStelPlanningVoor() {
    setSuggesting(true)
    setSuggestError(null)
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: PLANNING_PROMPT }] }] }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || 'Fout bij Gemini')
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      const suggestions = JSON.parse(text)
      const newSlots = suggestions.map((s) => {
        const weekStart = getWeekStart(s.week - 1)
        const dayOffset = s.type === 'newsletter' ? 2 : 0
        return {
          id: uid(),
          week: s.week,
          datum: dateToISO(addDays(weekStart, dayOffset)),
          type: s.type === 'newsletter' ? 'newsletter' : 'linkedin',
          pijler: s.pijler || CONTENT_PILLARS[0].id,
          doelgroep: s.doelgroep || DOELGROEPEN[0].id,
          onderwerp: s.onderwerp || '',
          toelichting: s.toelichting || '',
          content: '',
          status: 'gepland',
        }
      })
      setSlots(newSlots)
    } catch (err) {
      setSuggestError(err.message)
    } finally {
      setSuggesting(false)
    }
  }

  async function handleGenereer(slot) {
    setGeneratingId(slot.id)
    setGenerateError(null)
    try {
      const formData = {
        onderwerp: slot.onderwerp,
        pijler: slot.pijler,
        doelgroep: slot.doelgroep,
        toon: 'professioneel maar benaderbaar',
        gebruik12tje: true,
        hashtagsToevoegen: true,
        extraContext: slot.toelichting || '',
      }
      const content = await generateContent(apiKey, slot.type === 'newsletter' ? 'newsletter' : 'linkedin', formData)
      setSlots(prev =>
        prev.map(s =>
          s.id === slot.id ? { ...s, content, status: 'gegenereerd' } : s
        )
      )
      setActiveSlot(slot.id)
    } catch (err) {
      setGenerateError(err.message)
    } finally {
      setGeneratingId(null)
    }
  }

  function handleKopieer(slot) {
    navigator.clipboard.writeText(slot.content)
  }

  function handleStatusToggle(slot) {
    setSlots(prev =>
      prev.map(s =>
        s.id === slot.id ? { ...s, status: STATUS_NEXT[s.status] } : s
      )
    )
  }

  function handleDeleteSlot(id) {
    setSlots(prev => prev.filter(s => s.id !== id))
    if (activeSlot === id) setActiveSlot(null)
  }

  function handleAddSlot(weekNum) {
    const weekStart = getWeekStart(weekNum - 1)
    const newSlot = {
      id: uid(),
      week: weekNum,
      datum: dateToISO(weekStart),
      type: newSlotForm.type,
      pijler: newSlotForm.pijler,
      doelgroep: newSlotForm.doelgroep,
      onderwerp: newSlotForm.onderwerp,
      toelichting: '',
      content: '',
      status: 'gepland',
    }
    if (!newSlot.onderwerp.trim()) return
    setSlots(prev => [...prev, newSlot])
    setAddingWeek(null)
    setNewSlotForm({
      type: 'linkedin',
      pijler: CONTENT_PILLARS[0].id,
      doelgroep: DOELGROEPEN[0].id,
      onderwerp: '',
      datum: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Contentplanning</h2>
          <p className="text-sm text-gray-500">4 weken vooruit — 2 posts per week</p>
        </div>
        <button
          onClick={handleStelPlanningVoor}
          disabled={suggesting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-60"
          style={{ background: '#2FA766' }}
        >
          {suggesting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Planning genereren…
            </>
          ) : (
            <>
              <span className="text-base leading-none">✦</span>
              Stel planning voor
            </>
          )}
        </button>
      </div>

      {suggestError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {suggestError}
        </div>
      )}
      {generateError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {generateError}
        </div>
      )}

      {/* Weeks */}
      {[1, 2, 3, 4].map(weekNum => {
        const weekSlots = slots.filter(s => s.week === weekNum)
        return (
          <div key={weekNum} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Week {weekNum}
                <span className="ml-2 font-normal text-gray-400 normal-case tracking-normal">
                  — {weekRangeLabel(weekNum - 1)}
                </span>
              </h3>
              <button
                onClick={() => setAddingWeek(weekNum)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <span className="text-base leading-none">+</span> Post toevoegen
              </button>
            </div>

            {weekSlots.length === 0 && (
              <p className="text-sm text-gray-400 italic pl-1">Nog geen posts ingepland.</p>
            )}

            {weekSlots.map(slot => {
              const pillar = getPillar(slot.pijler)
              const isGenerating = generatingId === slot.id
              const isOpen = activeSlot === slot.id

              return (
                <div key={slot.id}>
                  <div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    style={{ borderLeft: `4px solid ${pillar.kleur}` }}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Top row: date + type + status */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400">
                              {slot.datum
                                ? new Date(slot.datum + 'T12:00:00').toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
                                : `Week ${slot.week}`}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {TYPE_LABELS[slot.type] || slot.type}
                            </span>
                            <button
                              onClick={() => handleStatusToggle(slot)}
                              className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${STATUS_COLORS[slot.status]}`}
                            >
                              {STATUS_LABELS[slot.status]}
                            </button>
                          </div>

                          {/* Pillar + doelgroep */}
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm" style={{ color: pillar.kleur }}>
                              {pillar.icon} {pillar.label}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: '#007F81' }}>
                              {slot.doelgroep}
                            </span>
                          </div>

                          {/* Onderwerp */}
                          <p className="text-sm font-medium text-gray-800 leading-snug">
                            {slot.onderwerp || <span className="italic text-gray-400">Geen onderwerp</span>}
                          </p>

                          {/* Toelichting */}
                          {slot.toelichting && (
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{slot.toelichting}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleGenereer(slot)}
                            disabled={isGenerating}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white font-medium disabled:opacity-60 transition-opacity"
                            style={{ background: pillar.kleur }}
                          >
                            {isGenerating ? (
                              <>
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Genereren…
                              </>
                            ) : (
                              <>✦ Genereer</>
                            )}
                          </button>

                          {slot.content && (
                            <>
                              <button
                                onClick={() => handleKopieer(slot)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Kopieer
                              </button>
                              <button
                                onClick={() => setActiveSlot(isOpen ? null : slot.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                {isOpen ? '▲ Verberg' : '▼ Bekijk'}
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="px-3 py-1.5 rounded-lg text-xs border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                          >
                            Verwijder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable content panel */}
                  {isOpen && slot.content && (
                    <div className="mt-1 mx-1 bg-gray-50 border border-gray-200 rounded-b-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gegenereerde content</p>
                      {slot.type === 'newsletter' ? (
                        <div
                          className="prose prose-sm max-w-none text-gray-800"
                          dangerouslySetInnerHTML={{ __html: slot.content }}
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                          {slot.content}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add slot form inline */}
            {addingWeek === weekNum && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-3">Nieuwe post — Week {weekNum}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Type</label>
                    <select
                      value={newSlotForm.type}
                      onChange={e => setNewSlotForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="newsletter">Nieuwsbrief</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Datum</label>
                    <input
                      type="date"
                      value={newSlotForm.datum}
                      onChange={e => setNewSlotForm(f => ({ ...f, datum: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pijler</label>
                    <select
                      value={newSlotForm.pijler}
                      onChange={e => setNewSlotForm(f => ({ ...f, pijler: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                    >
                      {CONTENT_PILLARS.map(p => (
                        <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Doelgroep</label>
                    <select
                      value={newSlotForm.doelgroep}
                      onChange={e => setNewSlotForm(f => ({ ...f, doelgroep: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                    >
                      {DOELGROEPEN.map(d => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Onderwerp *</label>
                    <input
                      type="text"
                      value={newSlotForm.onderwerp}
                      onChange={e => setNewSlotForm(f => ({ ...f, onderwerp: e.target.value }))}
                      placeholder="Waar gaat deze post over?"
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAddSlot(weekNum)}
                    disabled={!newSlotForm.onderwerp.trim()}
                    className="px-4 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-50"
                    style={{ background: '#2FA766' }}
                  >
                    Toevoegen
                  </button>
                  <button
                    onClick={() => setAddingWeek(null)}
                    className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50"
                  >
                    Annuleer
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
