import React from 'react'

export default function HomeScreen({ onSelect }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Welkom terug</h1>
        <p className="text-gray-400 mt-2 text-sm">Kies een omgeving om verder te gaan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
        {/* VDT */}
        <button
          onClick={() => onSelect('vdt')}
          className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-7 text-left hover:border-[#2FA766] hover:shadow-xl hover:shadow-[#2FA766]/10 transition-all duration-200"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg"
            style={{ backgroundColor: '#2FA766' }}
          >
            V
          </div>
          <h2 className="text-white font-bold text-lg leading-tight">VDT</h2>
          <p className="text-gray-400 text-sm mt-1">Contenttool voor VDT Advocaten</p>
          <ul className="mt-4 space-y-1.5">
            {['LinkedIn Posts', 'Nieuwsbrief', 'Planning'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2FA766] inline-block" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 text-xs font-semibold text-[#2FA766] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Openen →
          </div>
        </button>

        {/* Toby Privé */}
        <button
          onClick={() => onSelect('prive')}
          className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-7 text-left hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg bg-violet-600">
            T
          </div>
          <h2 className="text-white font-bold text-lg leading-tight">Toby Privé</h2>
          <p className="text-gray-400 text-sm mt-1">Persoonlijke tools</p>
          <ul className="mt-4 space-y-1.5">
            {['StreamPick', 'Films & Series', 'Live OMDB scores'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Openen →
          </div>
        </button>
      </div>
    </div>
  )
}
