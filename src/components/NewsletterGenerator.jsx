import React, { useState } from 'react'
import Spinner from './Spinner.jsx'
import { CONTENT_PILLARS, DOELGROEPEN } from '../gemini.js'

const defaultForm = {
  onderwerp: '',
  pijler: null,
  doelgroep: 'Ondernemers',
  typeNieuwsbrief: 'Maandelijkse update',
  extraContext: '',
}

export default function NewsletterGenerator({ onGenerate, loading }) {
  const [form, setForm] = useState(defaultForm)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.onderwerp.trim() || !form.pijler) return
    onGenerate('newsletter', form)
  }

  const activePijler = CONTENT_PILLARS.find((p) => p.id === form.pijler)
  const accentKleur = activePijler?.kleur || '#007F81'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: accentKleur }} />
        <h2 className="text-base font-semibold text-gray-900">Nieuwsbrief genereren</h2>
      </div>

      {/* Contentpijler buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contentpijler <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CONTENT_PILLARS.map((p) => {
            const active = form.pijler === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, pijler: p.id }))}
                className="text-left rounded-lg border-2 p-3 transition-all"
                style={{
                  borderColor: active ? p.kleur : '#e5e7eb',
                  backgroundColor: active ? p.kleur + '12' : '#fff',
                }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-base leading-none">{p.icon}</span>
                  <span className="text-xs font-semibold text-gray-900">{p.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-tight">{p.omschrijving}</p>
              </button>
            )
          })}
        </div>
        {activePijler && (
          <p className="mt-2 text-xs text-gray-400 italic">{activePijler.toelichting}</p>
        )}
      </div>

      {/* Doelgroep */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Doelgroep</label>
        <div className="flex flex-wrap gap-2">
          {DOELGROEPEN.map((d) => {
            const active = form.doelgroep === d.id
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, doelgroep: d.id }))}
                className="px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all"
                style={{
                  borderColor: active ? accentKleur : '#e5e7eb',
                  backgroundColor: active ? accentKleur : '#fff',
                  color: active ? '#fff' : '#374151',
                }}
              >
                {d.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Onderwerp */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Onderwerp / thema <span className="text-red-500">*</span>
        </label>
        <textarea
          name="onderwerp"
          value={form.onderwerp}
          onChange={handleChange}
          rows={3}
          required
          placeholder="Bijv. nieuwe AVG-regels voor het MKB…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 resize-none"
          style={{ '--tw-ring-color': accentKleur }}
        />
      </div>

      {/* Type nieuwsbrief */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type mailing</label>
        <select
          name="typeNieuwsbrief"
          value={form.typeNieuwsbrief}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2FA766] bg-white"
        >
          <option value="Maandelijkse update">Maandelijkse update</option>
          <option value="Eventuitnodiging">Eventuitnodiging</option>
          <option value="Kennisartikel">Kennisartikel</option>
          <option value="Productaankondiging">Productaankondiging</option>
        </select>
      </div>

      {/* Extra context */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Extra context <span className="text-gray-400 text-xs">(optioneel)</span>
        </label>
        <textarea
          name="extraContext"
          value={form.extraContext}
          onChange={handleChange}
          rows={2}
          placeholder="Bijv. naam event, datum, spreker, specifieke wetgeving…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2FA766] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.onderwerp.trim() || !form.pijler}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: accentKleur }}
      >
        {loading ? (
          <><Spinner size="sm" color="white" /><span>Genereren…</span></>
        ) : (
          'Nieuwsbrief genereren'
        )}
      </button>
    </form>
  )
}
