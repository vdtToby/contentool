import React, { useState } from 'react'
import Spinner from './Spinner.jsx'
import ColleagueSelector from './ColleagueSelector.jsx'
import { CONTENT_PILLARS, DOELGROEPEN } from '../gemini.js'

const defaultForm = {
  onderwerp: '',
  pijler: null,
  doelgroep: 'Ondernemers',
  toon: 'Informatief',
  gebruik12tje: true,
  hashtagsToevoegen: true,
  extraContext: '',
  zoekWebsiteLink: false,
  websiteLink: '',
  collega: null,
}

function Checkbox({ name, checked, onChange, label, sublabel }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative" onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? 'border-[#2FA766] bg-[#2FA766]' : 'border-gray-300 bg-white group-hover:border-[#2FA766]'
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-700">{label} {sublabel && <span className="text-gray-400 text-xs">{sublabel}</span>}</span>
    </label>
  )
}

export default function LinkedInGenerator({ onGenerate, loading, apiKey }) {
  const [form, setForm] = useState(defaultForm)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function setPijler(id) {
    setForm((prev) => ({ ...prev, pijler: id }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.onderwerp.trim() || !form.pijler) return
    onGenerate('linkedin', form)
  }

  const activePijler = CONTENT_PILLARS.find((p) => p.id === form.pijler)

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#2FA766' }} />
        <h2 className="text-base font-semibold text-gray-900">LinkedIn Post genereren</h2>
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
                onClick={() => setPijler(p.id)}
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
                  borderColor: active ? '#2FA766' : '#e5e7eb',
                  backgroundColor: active ? '#2FA766' : '#fff',
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
          placeholder="Bijv. arbeidscontracten controleren vóór het zomerseizoen…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent resize-none"
        />
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
        <Checkbox name="gebruik12tje" checked={form.gebruik12tje} onChange={handleChange} label="1-2-tje gebruiken" sublabel="(Jij… / Wij…)" />
        <Checkbox name="hashtagsToevoegen" checked={form.hashtagsToevoegen} onChange={handleChange} label="Hashtags toevoegen" />
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
          placeholder="Bijv. cao-wijzigingen, seizoensarbeid, aankomend event…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent resize-none"
        />
      </div>

      {/* Website link */}
      <div className="rounded-lg border border-gray-200 p-3 space-y-2">
        <Checkbox
          name="zoekWebsiteLink"
          checked={form.zoekWebsiteLink}
          onChange={handleChange}
          label="Koppel aan VDT-website"
          sublabel="(AI zoekt passende pagina)"
        />
        {form.zoekWebsiteLink ? (
          <p className="text-xs text-gray-400 pl-8">AI zoekt live op vdt-advocaten.nl naar het meest relevante teamlid of de passende expertise-pagina.</p>
        ) : (
          <div className="pl-8">
            <input
              type="url"
              name="websiteLink"
              value={form.websiteLink}
              onChange={handleChange}
              placeholder="https://vdt-advocaten.nl/expertise/..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Optioneel — laat leeg als je geen link wil.</p>
          </div>
        )}
      </div>

      {/* Schrijfstijl van collega */}
      <ColleagueSelector
        apiKey={apiKey}
        value={form.collega}
        onChange={(collega) => setForm(f => ({ ...f, collega }))}
      />

      <button
        type="submit"
        disabled={loading || !form.onderwerp.trim() || !form.pijler}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: activePijler?.kleur || '#2FA766' }}
      >
        {loading ? (
          <><Spinner size="sm" color="white" /><span>Genereren…</span></>
        ) : (
          form.collega ? `Post genereren als ${form.collega.naam.split(' ')[0]}` : 'LinkedIn post genereren'
        )}
      </button>
    </form>
  )
}
