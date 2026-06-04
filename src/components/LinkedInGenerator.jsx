import React, { useState } from 'react'
import Spinner from './Spinner.jsx'

const defaultForm = {
  onderwerp: '',
  pijler: 'Algemeen',
  toon: 'Informatief',
  gebruik12tje: true,
  hashtagsToevoegen: true,
  extraContext: '',
}

export default function LinkedInGenerator({ onGenerate, loading }) {
  const [form, setForm] = useState(defaultForm)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.onderwerp.trim()) return
    onGenerate('linkedin', form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#2FA766' }} />
        <h2 className="text-base font-semibold text-gray-900">LinkedIn Post genereren</h2>
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
          placeholder="Bijv. arbeidscontracten controleren vóór het zomerseizoen…"
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

      {/* Toon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Toon</label>
        <select
          name="toon"
          value={form.toon}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent bg-white"
        >
          <option value="Informatief">Informatief</option>
          <option value="Prikkelend / provocerend">Prikkelend / provocerend</option>
          <option value="Verhaal / case">Verhaal / case</option>
        </select>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              name="gebruik12tje"
              checked={form.gebruik12tje}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                form.gebruik12tje ? 'border-[#2FA766] bg-[#2FA766]' : 'border-gray-300 bg-white group-hover:border-[#2FA766]'
              }`}
            >
              {form.gebruik12tje && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-700">1-2-tje gebruiken <span className="text-gray-400 text-xs">(Jij… / Wij…)</span></span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              name="hashtagsToevoegen"
              checked={form.hashtagsToevoegen}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                form.hashtagsToevoegen ? 'border-[#2FA766] bg-[#2FA766]' : 'border-gray-300 bg-white group-hover:border-[#2FA766]'
              }`}
            >
              {form.hashtagsToevoegen && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-700">Hashtags toevoegen</span>
        </label>
      </div>

      {/* Extra context */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Extra context / trefwoorden <span className="text-gray-400 text-xs">(optioneel)</span>
        </label>
        <textarea
          name="extraContext"
          value={form.extraContext}
          onChange={handleChange}
          rows={2}
          placeholder="Bijv. cao-wijzigingen, seizoensarbeid, ZZP…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.onderwerp.trim()}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#2FA766' }}
      >
        {loading ? (
          <>
            <Spinner size="sm" color="white" />
            <span>Genereren…</span>
          </>
        ) : (
          'LinkedIn post genereren'
        )}
      </button>
    </form>
  )
}
