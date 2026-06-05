import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { TOP_CONTENT } from '../data/topContent.js'
import { fetchAllOmdb, getRating } from '../services/omdbService.js'

const GENRE_ALL = 'Alle genres'
const WATCHED_KEY = 'streampick_watched'

function loadWatched() {
  try {
    return new Set(JSON.parse(localStorage.getItem(WATCHED_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function saveWatched(set) {
  localStorage.setItem(WATCHED_KEY, JSON.stringify([...set]))
}

function parseGenres(genreStr) {
  if (!genreStr || genreStr === 'N/A') return []
  return genreStr.split(',').map((g) => g.trim())
}

function ScoreBadge({ omdb, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 mt-2">
        <div className="h-3 w-8 bg-gray-700 rounded animate-pulse" />
        <div className="h-3 w-8 bg-gray-700 rounded animate-pulse" />
      </div>
    )
  }
  if (!omdb || omdb.Response === 'False') return null

  const rt = getRating(omdb, 'Rotten Tomatoes')
  const rtPct = rt ? parseInt(rt) : null

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 text-xs font-semibold">
      {omdb.imdbRating && omdb.imdbRating !== 'N/A' && (
        <span className="flex items-center gap-0.5 text-yellow-300">
          ★ {omdb.imdbRating}
        </span>
      )}
      {rt && (
        <span className={rtPct >= 60 ? 'text-red-400' : 'text-gray-500'}>
          {rtPct >= 60 ? '🍅' : '🤢'} {rt}
        </span>
      )}
      {omdb.Metascore && omdb.Metascore !== 'N/A' && (
        <span className="text-cyan-400">M {omdb.Metascore}</span>
      )}
    </div>
  )
}

function PosterSkeleton() {
  return (
    <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
      <svg className="w-10 h-10 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v6H9V9z" />
      </svg>
    </div>
  )
}

function PosterPlaceholder({ title }) {
  const initials = title.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 gap-2">
      <span className="text-3xl font-black text-gray-600 select-none">{initials}</span>
      <span className="text-[9px] text-gray-600 text-center px-2 leading-tight select-none line-clamp-2">{title}</span>
    </div>
  )
}

function ContentCard({ item, omdb, loadingScores, watched, onToggleWatched }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const posterUrl = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : null
  const genres = parseGenres(omdb?.Genre)
  const runtime = omdb?.Runtime && omdb.Runtime !== 'N/A' ? omdb.Runtime : null

  // Reset image state when poster URL changes
  useEffect(() => {
    setImgLoaded(false)
    setImgError(false)
  }, [posterUrl])

  return (
    <div
      className={`relative bg-gray-900 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/60 ${
        watched ? 'opacity-50 saturate-50' : ''
      }`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
        {/* Skeleton shown while loading OR while image is fetching */}
        {!omdb && loadingScores && <PosterSkeleton />}

        {/* Placeholder when no poster available */}
        {(omdb || !loadingScores) && (!posterUrl || imgError) && (
          <PosterPlaceholder title={item.title} />
        )}

        {/* Real poster */}
        {posterUrl && !imgError && (
          <>
            {!imgLoaded && <PosterSkeleton />}
            <img
              src={posterUrl}
              alt={item.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          </>
        )}

        {/* Watched overlay */}
        {watched && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Type badge */}
        <span
          className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow ${
            item.type === 'movie' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
          }`}
        >
          {item.type === 'movie' ? 'Film' : 'Serie'}
        </span>

        {/* Live badge */}
        {omdb?.Response === 'True' && !watched && (
          <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-semibold bg-black/70 text-green-400 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            LIVE
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 flex-1">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
          <span>{item.year}</span>
          {runtime && <span>· {runtime}</span>}
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {genres.slice(0, 2).map((g) => (
              <span key={g} className="text-[10px] bg-gray-700/80 text-gray-300 px-1.5 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        )}

        <ScoreBadge omdb={omdb} loading={loadingScores && !omdb} />

        {/* Gezien button */}
        <button
          onClick={() => onToggleWatched(item.imdbId)}
          className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${
            watched
              ? 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/40'
          }`}
        >
          {watched ? '✓ Gezien — ongedaan maken' : '+ Markeer als gezien'}
        </button>
      </div>
    </div>
  )
}

export default function StreamPick() {
  const [omdbMap, setOmdbMap] = useState({})
  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [loadStarted, setLoadStarted] = useState(false)

  const [watched, setWatched] = useState(loadWatched)
  const [hideWatched, setHideWatched] = useState(false)

  const [filter, setFilter] = useState('all')
  const [genreFilter, setGenreFilter] = useState(GENRE_ALL)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('imdb')

  const toggleWatched = useCallback((imdbId) => {
    setWatched((prev) => {
      const next = new Set(prev)
      if (next.has(imdbId)) next.delete(imdbId)
      else next.add(imdbId)
      saveWatched(next)
      return next
    })
  }, [])

  const allGenres = useMemo(() => {
    const set = new Set()
    Object.values(omdbMap).forEach((d) => {
      if (d?.Genre && d.Genre !== 'N/A') {
        d.Genre.split(',').forEach((g) => set.add(g.trim()))
      }
    })
    return [GENRE_ALL, ...Array.from(set).sort()]
  }, [omdbMap])

  const visible = useMemo(() => {
    let list = TOP_CONTENT

    if (filter === 'movie') list = list.filter((i) => i.type === 'movie')
    if (filter === 'series') list = list.filter((i) => i.type === 'series')

    if (hideWatched) list = list.filter((i) => !watched.has(i.imdbId))

    if (genreFilter !== GENRE_ALL) {
      list = list.filter((i) => omdbMap[i.imdbId]?.Genre?.includes(genreFilter))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((i) => i.title.toLowerCase().includes(q))
    }

    list = [...list].sort((a, b) => {
      // Watched items always go to the bottom (unless hidden)
      const aw = watched.has(a.imdbId) ? 1 : 0
      const bw = watched.has(b.imdbId) ? 1 : 0
      if (aw !== bw) return aw - bw

      if (sortBy === 'year') return b.year - a.year
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      const ra = parseFloat(omdbMap[a.imdbId]?.imdbRating) || 0
      const rb = parseFloat(omdbMap[b.imdbId]?.imdbRating) || 0
      return rb - ra
    })

    return list
  }, [filter, genreFilter, search, sortBy, omdbMap, watched, hideWatched])

  async function loadScores() {
    if (isLoading || loadStarted) return
    setLoadStarted(true)
    setIsLoading(true)
    const ids = TOP_CONTENT.map((i) => i.imdbId)
    const results = await fetchAllOmdb(ids, (done) => setLoadedCount(done))
    setOmdbMap(results)
    setIsLoading(false)
  }

  useEffect(() => { loadScores() }, [])

  const loadPct = Math.round((loadedCount / TOP_CONTENT.length) * 100)
  const watchedCount = watched.size

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🎬</span> StreamPick
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Top 100 films &amp; series — scores live via OMDB
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {watchedCount > 0 && (
            <span className="text-green-400 font-medium">✓ {watchedCount} gezien</span>
          )}
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block" />
              Laden {loadedCount}/{TOP_CONTENT.length}
            </span>
          ) : loadStarted ? (
            <span className="flex items-center gap-1.5 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              OMDB live
            </span>
          ) : null}
        </div>
      </div>

      {/* Progress bar */}
      {isLoading && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Scores ophalen via OMDB API…</span>
            <span>{loadPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${loadPct}%` }} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5 flex-wrap">
        {/* Type */}
        <div className="flex gap-1 bg-gray-900 p-1 rounded-lg shrink-0">
          {[{ id: 'all', label: 'Alles' }, { id: 'movie', label: 'Films' }, { id: 'series', label: 'Series' }].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                filter === t.id ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Hide watched toggle */}
        <button
          onClick={() => setHideWatched((v) => !v)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium border transition-all shrink-0 ${
            hideWatched
              ? 'bg-green-500/20 text-green-400 border-green-500/40'
              : 'bg-gray-900 text-gray-400 border-gray-700 hover:text-white'
          }`}
        >
          {hideWatched ? '👁 Toon gezien' : '🙈 Verberg gezien'}
        </button>

        {/* Genre */}
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="bg-gray-900 text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500"
        >
          {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-900 text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500"
        >
          <option value="imdb">Sorteren: IMDb score</option>
          <option value="year">Sorteren: Jaar (nieuwste)</option>
          <option value="title">Sorteren: Titel A-Z</option>
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-40">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Zoek titel…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 text-gray-100 text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500 mb-4">{visible.length} van {TOP_CONTENT.length} titels</p>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-4xl mb-3">🎭</p>
          <p>Geen resultaten gevonden</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {visible.map((item) => (
            <ContentCard
              key={item.imdbId}
              item={item}
              omdb={omdbMap[item.imdbId]}
              loadingScores={isLoading}
              watched={watched.has(item.imdbId)}
              onToggleWatched={toggleWatched}
            />
          ))}
        </div>
      )}
    </div>
  )
}
