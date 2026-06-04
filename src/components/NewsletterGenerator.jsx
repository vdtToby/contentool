import React, { useState } from 'react'
import Spinner from './Spinner.jsx'

const defaultForm = {
  onderwerp: '',
  pijler: 'Algemeen',
  typeNieuwsbrief: 'Maandelijkse update',
  doelgroep: 'Beide',
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
    if (!form.onderwerp.trim()) return
    onGenerate('newsletter', form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#007F81' }} />
        <h2 className="text-base font-semibold text-gray-900">Nieuwsbrief genereren</h2>
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
          placeholder="Bijv. nieuwe AVG-regels voor het MKB in 2025…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent resize-none"
        />
      </div>

      {/* Pijler */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pijler</label>
        <select
          name="pijler"
          value={form.pijler}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent bg-white"
        >
          <option value="Bedrijf">Bedrijf (Structure) — rood</option>
          <option value="Business">Business — teal</option>
          <option value="Mensen">Mensen (People) — geel</option>
          <option value="Algemeen">Algemeen</option>
        </select>
      </div>

      {/* Type nieuwsbrief */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type nieuwsbrief</label>
        <select
          name="typeNieuwsbrief"
          value={form.typeNieuwsbrief}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent bg-white"
        >
          <option value="Maandelijkse update">Maandelijkse update</option>
          <option value="Productaankondiging">Productaankondiging</option>
          <option value="Event / webinar">Event / webinar</option>
          <option value="Kennisartikel">Kennisartikel</option>
        </select>
      </div>

      {/* Doelgroep */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Doelgroep</label>
        <select
          name="doelgroep"
          value={form.doelgroep}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent bg-white"
        >
          <option value="Prospects">Prospects</option>
          <option value="Bestaande klanten">Bestaande klanten</option>
          <option value="Beide">Beide</option>
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
          placeholder="Bijv. specifieke wetgeving, aankomend event, naam spreker…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.onderwerp.trim()}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#007F81' }}
      >
        {loading ? (
          <>
            <Spinner size="sm" color="white" />
            <span>Genereren…</span>
          </>
        ) : (
          'Nieuwsbrief genereren'
        )}
      </button>
    </form>
  )
}
