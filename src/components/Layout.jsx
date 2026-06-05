import React from 'react'

export default function Layout({ children, onLogout, dark = false }) {
  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <header className={`border-b shadow-sm ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#2FA766' }}
            >
              V
            </div>
            <div>
              <h1 className={`text-xl font-bold leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>VDT Contenttool</h1>
              <p className={`text-xs italic ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Onderneemt met je mee.</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full text-white hidden sm:inline-block" style={{ backgroundColor: '#2FA766' }}>
              B.O.E.F.J.E.
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                title="API-sleutel wijzigen"
              >
                Sleutel wijzigen
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className={`border-t mt-12 ${dark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-400">
          VDT Advocaten · Hart van Brabantlaan 500, 5038 JA Tilburg · 013-544-0400 · lovetilburg@vdt-advocaten.nl
        </div>
      </footer>
    </div>
  )
}
