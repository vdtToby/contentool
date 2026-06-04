import React from 'react'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_LIVE_MODE

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {DEMO_MODE && (
        <div className="bg-amber-50 border-b border-amber-200 text-center py-2 px-4">
          <p className="text-xs font-semibold text-amber-700">
            ✦ DEMO-MODUS — Dit is een voorbeeldversie met vooraf geschreven teksten. Voeg een gratis Gemini API-sleutel toe om echte AI-teksten te genereren.
          </p>
        </div>
      )}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#2FA766' }}
            >
              V
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">VDT Contenttool</h1>
              <p className="text-xs text-gray-500 italic">Onderneemt met je mee.</p>
            </div>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: '#2FA766' }}
            >
              B.O.E.F.J.E.
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-400">
          VDT Advocaten · Hart van Brabantlaan 500, 5038 JA Tilburg · 013-544-0400 · lovetilburg@vdt-advocaten.nl
        </div>
      </footer>
    </div>
  )
}
