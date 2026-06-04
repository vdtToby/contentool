import React, { useState } from 'react'

export default function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = key.trim()
    if (!trimmed) return
    localStorage.setItem('vdt_gemini_key', trimmed)
    onSave(trimmed)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#2FA766' }}>
            V
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">VDT Contenttool</h1>
            <p className="text-xs text-gray-500 italic">Onderneemt met je mee.</p>
          </div>
        </div>

        <h2 className="text-base font-semibold text-gray-900 mb-1">Voer je Gemini API-sleutel in</h2>
        <p className="text-sm text-gray-500 mb-5">
          Je sleutel wordt alleen lokaal in je browser opgeslagen — nergens naartoe gestuurd.
          Nog geen sleutel?{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline" style={{ color: '#2FA766' }}>
            Haal hem gratis op via Google AI Studio →
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AQ... of AIza..."
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-20 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2FA766] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              {show ? 'Verberg' : 'Toon'}
            </button>
          </div>
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full py-2.5 px-4 rounded-lg text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: '#2FA766' }}
          >
            Aan de slag →
          </button>
        </form>
      </div>
    </div>
  )
}
