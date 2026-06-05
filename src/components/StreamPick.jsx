import React, { useState, useEffect, useMemo } from 'react'
import { TOP_CONTENT } from '../data/topContent.js'
import { fetchAllOmdb, getRating } from '../services/omdbService.js'

const GENRE_ALL = 'Alle genres'

function parseGenres(genreStr) {
  if (!genreStr || genreStr === 'N/A') return []
  return genreStr.split(',').map((g) => g.trim())
}

function ImdbStar() {
  return (
    <span className="text-yellow-400" title="IMDb rating">★</span>
  )
}

function RtDot({ value }) {
  if (!value) return null
  const pct = parseInt(value)
  const fresh = pct >= 60
  return (
    <span title={`Rotten Tomatoes: ${value}`} className={fresh ? 'text-red-400' : 'text-gray-500'}>
      {fresh ? '🍅' : '🤢'} {value}
    </span>
  )
}

function ScoreBadge({ omdb, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 mt-2">
        <div className="h-3 w-10 bg-gray-700 rounded animate-pulse" />
        <div className="h-3 w-10 bg-gray-700 rounded animate-pulse" />
      </div>
    )
  }

  if (!omdb || omdb.Response === 'False') {
    return <p className="text-xs text-gray-600 mt-2">Score niet beschikbaar</p>
  }

  const rt = getRating(omdb, 'Rotten Tomatoes')

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs font-medium">
      {omdb.imdbRating && omdb.imdbRating !== 'N/A' && (
        <span className="flex items-center gap-0.5 text-yellow-300">
          <ImdbStar /> {omdb.imdbRating}
        </span>
      )}
      {rt && <RtDot value={rt} />}
      {omdb.Metascore && omdb.Metascore !== 'N/A' && (
        <span className="text-green-400" title="Metacritic">M {omdb.Metascore}</span>
      )}
    </div>
  )
}

function PosterPlaceholder({ title }) {
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-2xl font-bold select-none">
      {initials}
    </div>
  )
}

function ContentCard({ item, omdb, loading }) {
  const [imgError, setImgError] = useState(false)
  const posterUrl = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : null
  const genres = parseGenres(omdb?.Genre)
  const runtime = omdb?.Runtime && omdb.Runtime !== 'N/A' ? omdb.Runtime : null

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/60 cursor-default group">
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
        {posterUrl && !imgError ? (
          <img
            src={posterUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <PosterPlaceholder title={item.title} />
        )}

        {/* Type badge */}
        <span
          className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            item.type === 'movie'
              ? 'bg-blue-600 text-white'
              : 'bg-purple-600 text-white'
          }`}
        >
          {item.type === 'movie' ? 'Film' : 'Serie'}
        </span>

        {/* Live badge */}
        {omdb?.Response === 'True' && (
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
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.slice(0, 3).map((g) => (
              <span key={g} className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        )}

        <ScoreBadge omdb={omdb} loading={loading && !omdb} />
      </div>
    </div>
  )
}

export default function StreamPick() {
  const [omdbMap, setOmdbMap] = useState({})
  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [loadStarted, setLoadStarted] = useState(false)

  const [filter, setFilter] = useState('all')        // 'all' | 'movie' | 'series'
  const [genreFilter, setGenreFilter] = useState(GENRE_ALL)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('imdb')       // 'imdb' | 'year' | 'title'

  // Collect all unique genres from loaded OMDB data
  const allGenres = useMemo(() => {
    const set = new Set()
    Object.values(omdbMap).forEach((d) => {
      if (d?.Genre && d.Genre !== 'N/A') {
        d.Genre.split(',').forEach((g) => set.add(g.trim()))
      }
    })
    return [GENRE_ALL, ...Array.from(set).sort()]
  }, [omdbMap])

  // Filtered + sorted list
  const visible = useMemo(() => {
    let list = TOP_CONTENT

    if (filter === 'movie') list = list.filter((i) => i.type === 'movie')
    if (filter === 'series') list = list.filter((i) => i.type === 'series')

    if (genreFilter !== GENRE_ALL) {
      list = list.filter((i) => {
        const d = omdbMap[i.imdbId]
        return d?.Genre?.includes(genreFilter)
      })
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((i) => i.title.toLowerCase().includes(q))
    }

    // Sort
    list = [...list].sort((a, b) => {
      if (sortBy === 'year') return b.year - a.year
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      // imdb rating sort (default)
      const ra = parseFloat(omdbMap[a.imdbId]?.imdbRating) || 0
      const rb = parseFloat(omdbMap[b.imdbId]?.imdbRating) || 0
      return rb - ra
    })

    return list
  }, [filter, genreFilter, search, sortBy, omdbMap])

  async function loadScores() {
    if (isLoading || loadStarted) return
    setLoadStarted(true)
    setIsLoading(true)
    const ids = TOP_CONTENT.map((i) => i.imdbId)

    await fetchAllOmdb(ids, (done, total) => {
      setLoadedCount(done)
    }).then((results) => {
      setOmdbMap(results)
    })

    setIsLoading(false)
  }

  useEffect(() => {
    loadScores()
  }, [])

  const loadPct = Math.round((loadedCount / TOP_CONTENT.length) * 100)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🎬</span> StreamPick
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Top 100 films &amp; series — scores live via OMDB
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block" />
              Laden {loadedCount}/{TOP_CONTENT.length}
            </span>
          ) : loadStarted ? (
            <span className="flex items-center gap-1.5 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {Object.values(omdbMap).filter(d => d?.Response === 'True').length} scores geladen · OMDB live
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
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${loadPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Type filter */}
        <div className="flex gap-1 bg-gray-900 p-1 rounded-lg shrink-0">
          {[
            { id: 'all', label: 'Alles' },
            { id: 'movie', label: 'Films' },
            { id: 'series', label: 'Series' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                filter === t.id
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Genre filter */}
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="bg-gray-900 text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500"
        >
          {allGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
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
        <div className="relative flex-1 min-w-0">
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

      {/* Results count */}
      <p className="text-xs text-gray-500 mb-4">
        {visible.length} van {TOP_CONTENT.length} titels
      </p>

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
              loading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  )
}
