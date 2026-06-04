import React, { useState } from 'react'
import Spinner from './Spinner.jsx'
import { searchColleague } from '../gemini.js'

export default function ColleagueSelector({ apiKey, value, onChange }) {
  const [naam, setNaam] = useState('')
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleSearch() {
    if (!naam.trim()) return
    setSearching(true)
    setError(null)
    setResult(null)
    onChange(null)
    try {
      const found = await searchColleague(apiKey, naam.trim())
      setResult(found)
    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
    }
  }

  function handleConfirm() {
    onChange(result)
  }

  function handleReject() {
    setResult(null)
    setNaam('')
    onChange(null)
  }

  function handleClear() {
    setNaam('')
    setResult(null)
    setError(null)
    onChange(null)
  }

  // Confirmed state
  if (value) {
    return (
      <div className="rounded-lg border-2 border-[#2FA766] bg-[#2FA76608] p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#2FA766] uppercase tracking-wide mb-0.5">Schrijfstijl van</p>
            <p className="text-sm font-semibold text-gray-900">{value.naam}</p>
            {value.functie && <p className="text-xs text-gray-500">{value.functie}</p>}
            {value.stijlSamenvatting && (
              <p className="text-xs text-gray-500 mt-1.5 italic leading-relaxed">"{value.stijlSamenvatting}"</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
          >
            ✕ Wisselen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 p-3 space-y-3">
      <p className="text-sm font-medium text-gray-700">
        Schrijfstijl van collega <span className="text-gray-400 text-xs">(optioneel)</span>
      </p>

      {/* Search input */}
      {!result && (
        <div className="flex gap-2">
          <input
            type="text"
            value={naam}
            onChange={e => setNaam(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            placeholder="Naam collega, bijv. Jan de Vries"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching || !naam.trim()}
            className="px-3 py-2 rounded-lg bg-[#2FA766] text-white text-sm font-medium disabled:opacity-40 shrink-0 flex items-center gap-1.5"
          >
            {searching ? <Spinner size="sm" color="white" /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            {searching ? 'Zoeken…' : 'Zoek'}
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Confirmation card */}
      {result && !value && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Gevonden op LinkedIn</p>
          <div>
            <p className="text-sm font-semibold text-gray-900">{result.naam}</p>
            {result.functie && <p className="text-xs text-gray-500">{result.functie}</p>}
            {result.linkedinUrl && (
              <a
                href={result.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#2FA766] hover:underline"
              >
                Profiel bekijken ↗
              </a>
            )}
          </div>
          {result.stijlSamenvatting && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Schrijfstijl</p>
              <p className="text-xs text-gray-600 italic leading-relaxed">"{result.stijlSamenvatting}"</p>
            </div>
          )}
          <p className="text-sm font-medium text-gray-700 pt-1">Klopt dit?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-1.5 rounded-lg bg-[#2FA766] text-white text-xs font-semibold"
            >
              Ja, dit is de juiste
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-100"
            >
              Nee, andere persoon
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
